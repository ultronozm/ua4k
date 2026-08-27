from __future__ import annotations

import copy
import itertools
import json
import re
import shutil
import sys
from dataclasses import dataclass, field
from pathlib import Path
from typing import NoReturn


TOP_LEVEL_ONLY_DIRECTIVES = {
    "GOAL",
    "VOID",
    "WILDCARD",
    "CLASS",
    "HIDDEN_LINE_CHAR",
    "DESCRIPTION",
    "MINMOVES",
    "TICK",
    "TITLE",
    "WHITESPACE",
    "CHARMAP",
    "COLOR",
    "BY",
    "BIND",
}

RULE_BLOCK_DIRECTIVES = {
    "FOR",
    "ZIP",
    "LET_REPEAT",
    "ROTATE",
    "FLIP_HORIZONTAL",
    "FLIP_VERTICAL",
    "ATOMIC",
    "ATOMIC_VERTICAL",
    "ATOMIC_HORIZONTAL",
    "MATCH1",
    "TRY_ALL",
    "RANDOM",
    "REPEAT",
    "CALL",
    "CALL_EACH",
}

TOP_LEVEL_BLOCK_DIRECTIVES = {"ROTATE_CMDS"}

# Compile-time command templating (ZIP_CMDS / FOR_CMDS). Expanded by a
# template-aware preprocessor before ordinary parsing; never seen by
# parse_tokens.
TEMPLATE_DIRECTIVES = {"ZIP_CMDS", "FOR_CMDS"}

# Compound control blocks that share one parse shape: open a nested rule
# list at the current indent level. Values are the runtime node skeletons.
BLOCK_DIRECTIVE_NODES = {
    "ATOMIC": {"type": "atomic"},
    "ATOMIC_VERTICAL": {"type": "atomic", "condition": "vertical"},
    "ATOMIC_HORIZONTAL": {"type": "atomic", "condition": "horizontal"},
    "MATCH1": {"type": "match1"},
    "TRY_ALL": {"type": "try_all"},
    "RANDOM": {"type": "random"},
    "REPEAT": {"type": "repeat"},
}

ALL_DIRECTIVES = TOP_LEVEL_ONLY_DIRECTIVES | RULE_BLOCK_DIRECTIVES | TOP_LEVEL_BLOCK_DIRECTIVES | {
    "CMD"
}

METHOD_ANNOTATIONS = {"firstmatch", "lastmatch", "random"}
FLAG_ANNOTATIONS = {"norotate"}
DIRECTION_SUFFIXES = ("_e", "_s", "_w", "_n")


class DSLParseError(Exception):
    def __init__(self, line_no: int, message: str):
        super().__init__(message)
        self.line_no = line_no
        self.message = message


@dataclass(frozen=True)
class LineToken:
    line_no: int
    raw: str
    stripped: str
    indent: int
    parts: list[str]
    kind: str
    origin: str | None = None


@dataclass
class RuleBuffer:
    from_rows: list[str] = field(default_factory=list)
    to_rows: list[str] = field(default_factory=list)
    line_nos: list[int] = field(default_factory=list)
    side_effects: list[str] = field(default_factory=list)
    method: str = "firstmatch"
    flags: set[str] = field(default_factory=set)


@dataclass
class ParseState:
    levels: list[dict] = field(default_factory=list)
    rules: dict[str, dict] = field(default_factory=dict)
    binds: dict[str, str | dict[str, str]] = field(default_factory=dict)
    goals: list[list[str]] = field(default_factory=list)
    voids: list[list[str]] = field(default_factory=list)
    whitespace: list[str] = field(default_factory=list)
    char_map: dict[str, str] = field(default_factory=dict)
    color_map: dict[str, str] = field(default_factory=dict)
    hidden_line_chars: list[str] = field(default_factory=list)
    wildcard_char: str | None = None
    patterns_started: bool = False
    classes: dict[str, tuple[str, bool]] = field(default_factory=dict)
    global_tick: int | None = None
    game_title: str | None = None
    game_description: str | None = None
    game_author: str | None = None

    temp_board: list[str] = field(default_factory=list)
    temp_goal: list[str] | None = None
    temp_void: list[str] | None = None
    rule_buffer: RuleBuffer = field(default_factory=RuleBuffer)

    rules_stack: list[dict] = field(default_factory=list)
    indent_stack: list[int] = field(default_factory=list)

    generated_command_names: frozenset[str] = frozenset()

    call_references: list[tuple[str, int, str]] = field(default_factory=list)
    side_effect_references: list[tuple[str, int, str]] = field(default_factory=list)


def fail(line_no: int, message: str) -> NoReturn:
    raise DSLParseError(line_no, message)


def parse_int(token: str, line_no: int, field_name: str) -> int:
    try:
        return int(token)
    except ValueError:
        fail(line_no, f"invalid integer for {field_name}: {token!r}")


def expect_exact_arity(parts: list[str], expected: int, line_no: int, directive: str) -> None:
    if len(parts) != expected:
        fail(line_no, f"{directive} expects {expected - 1} argument(s)")


def expect_pairs(parts: list[str], start_index: int, line_no: int, directive: str) -> None:
    if len(parts) <= start_index:
        fail(line_no, f"{directive} expects at least one key/value pair")
    if (len(parts) - start_index) % 2 != 0:
        fail(line_no, f"{directive} expects key/value pairs")


def parse_bind_tokens(body: str, line_no: int) -> list[tuple[str, bool]]:
    tokens: list[tuple[str, bool]] = []
    i = 0
    while i < len(body):
        while i < len(body) and body[i].isspace():
            i += 1
        if i >= len(body):
            break

        if body[i] in {"'", '"'}:
            quote = body[i]
            i += 1
            chars: list[str] = []
            while i < len(body):
                char = body[i]
                if char == "\\" and i + 1 < len(body):
                    chars.append(body[i + 1])
                    i += 2
                    continue
                if char == quote:
                    i += 1
                    break
                chars.append(char)
                i += 1
            else:
                fail(line_no, "unterminated quoted string in BIND")

            if i < len(body) and not body[i].isspace():
                fail(line_no, "expected whitespace after quoted BIND description")
            tokens.append(("".join(chars), True))
            continue

        start = i
        while i < len(body) and not body[i].isspace():
            i += 1
        tokens.append((body[start:i], False))
    return tokens


def parse_bind_entries(body: str, line_no: int) -> list[tuple[str, str, str | None]]:
    tokens = parse_bind_tokens(body, line_no)
    if not tokens:
        fail(line_no, "BIND expects at least one key/command pair")

    entries: list[tuple[str, str, str | None]] = []
    i = 0
    while i < len(tokens):
        if i + 1 >= len(tokens):
            fail(line_no, "BIND expects key/command pairs")

        key = tokens[i][0]
        command = tokens[i + 1][0]
        i += 2

        description: str | None = None
        if i < len(tokens) and tokens[i][1]:
            description = tokens[i][0]
            i += 1

        entries.append((key, command, description))
    return entries


CLASS_NAME_RE = re.compile(r"[a-z_]{2,}")


def is_class_name_token(token: str) -> bool:
    """Domain tokens shaped like class names always resolve as classes (D8)."""
    return CLASS_NAME_RE.fullmatch(token) is not None


def parse_class_directive(state: ParseState, line: str, line_no: int) -> None:
    body = line.split("CLASS", 1)[1].strip()
    tokens = parse_bind_tokens(body, line_no)
    if not tokens:
        fail(line_no, "CLASS expects a name and at least one character")
    name, name_quoted = tokens[0]
    if name_quoted or not is_class_name_token(name):
        fail(line_no, f"CLASS name {name!r} must match [a-z_]{{2,}}")
    if name in state.classes:
        fail(line_no, f"duplicate CLASS {name!r}")
    rest = tokens[1:]
    negated = False
    if rest and rest[0] == ("NOT", False):
        negated = True
        rest = rest[1:]
    chars = "".join(token for token, _quoted in rest)
    if not chars:
        fail(line_no, f"CLASS {name!r} expects at least one character")
    # Preserve first-occurrence order while removing duplicates.
    state.classes[name] = ("".join(dict.fromkeys(chars)), negated)


def parse_capture_arguments(state: ParseState, args: list[str], line_no: int) -> dict:
    """Parse `ATOMIC <var> <domain> ...` pairs into a variables table."""
    if len(args) % 2 != 0:
        fail(line_no, "ATOMIC expects variable/domain pairs")
    effective_wildcard = state.wildcard_char or "?"
    variables: dict[str, dict] = {}
    for i in range(0, len(args), 2):
        var = args[i]
        domain_token = args[i + 1]
        if len(var) != 1:
            fail(line_no, f"capture variable {var!r} must be a single character")
        if var == effective_wildcard:
            fail(line_no, f"capture variable {var!r} is the effective wildcard")
        if var in variables:
            fail(line_no, f"duplicate capture variable {var!r}")
        for entry in state.rules_stack:
            entry_type = entry["type"]
            if entry_type == "atomic" and var in (entry.get("variables") or {}):
                fail(line_no, f"capture variable {var!r} shadows an enclosing declaration")
            if entry_type == "for" and var in entry["wildcards_dict"]:
                fail(line_no, f"capture variable {var!r} collides with an enclosing FOR wildcard")
            if entry_type == "zip" and var in entry["zip_dict"]:
                fail(line_no, f"capture variable {var!r} collides with an enclosing ZIP wildcard")
            if entry_type in {"rotate", "rotate_cmds"}:
                for orbit in entry.get("orbits", []):
                    if var in orbit:
                        fail(line_no, f"capture variable {var!r} appears in an enclosing orbit {orbit!r}")
        if is_class_name_token(domain_token):
            if domain_token not in state.classes:
                fail(line_no, f"unknown class {domain_token!r} in capture domain")
            chars, negated = state.classes[domain_token]
        else:
            chars, negated = domain_token, False
        variables[var] = {"domain": chars, "negated": negated}
    return variables


def active_capture_chars(state: ParseState) -> set[str]:
    """Capture variables of every parameterized ATOMIC on the parse stack."""
    chars: set[str] = set()
    for entry in state.rules_stack:
        if entry["type"] == "atomic":
            chars.update((entry.get("variables") or {}).keys())
    return chars


def check_wildcards_vs_captures(
    state: ParseState, wildcard_chars, line_no: int, directive: str
) -> None:
    """Reject FOR/ZIP wildcards or orbits that collide with enclosing captures."""
    active = active_capture_chars(state)
    for char in wildcard_chars:
        if char in active:
            fail(
                line_no,
                f"{directive} uses {char!r}, which is a capture variable of an enclosing ATOMIC",
            )


def capture_mask_offsets(rows: list[str], chars: set[str]) -> list[int]:
    """Row-major offsets of capture-variable cells in ROWS (D23)."""
    if not rows:
        return []
    width = len(rows[0])
    offsets = []
    for i, row in enumerate(rows):
        for j, cell in enumerate(row):
            if cell in chars:
                offsets.append(i * width + j)
    return offsets


def rotate_mask_offsets(offsets: list[int], height: int, width: int, step: int) -> list[int]:
    """Move mask offsets to their post-rotation positions (D12/D23)."""
    step %= 4
    if step == 0 or not offsets:
        return list(offsets)
    result = []
    for offset in offsets:
        i, j = divmod(offset, width)
        if step == 1:
            new_i, new_j, new_width = j, height - 1 - i, height
        elif step == 2:
            new_i, new_j, new_width = height - 1 - i, width - 1 - j, width
        else:
            new_i, new_j, new_width = width - 1 - j, i, height
        result.append(new_i * new_width + new_j)
    return sorted(result)


def flip_mask_offsets(offsets: list[int], height: int, width: int, axis: str) -> list[int]:
    """Move mask offsets to their post-reflection positions (D12/D23)."""
    if not offsets:
        return []
    result = []
    for offset in offsets:
        i, j = divmod(offset, width)
        if axis == "horizontal":
            result.append(i * width + (width - 1 - j))
        else:
            result.append((height - 1 - i) * width + j)
    return sorted(result)


def rule_mask_char(rule: dict, side: str, offset: int) -> str:
    rows = rule[side]
    width = len(rows[0])
    return rows[offset // width][offset % width]


def check_definitely_unbound(node: dict, line_no: int) -> None:
    """Reject destination uses that no source occurrence could bind (D10)."""
    declared = set((node.get("variables") or {}).keys())
    if not declared:
        return
    possibly_bound: set[str] = set()

    def walk(rule: dict) -> None:
        if rule["type"] == "simple":
            for offset in rule.get("fromVariables") or []:
                char = rule_mask_char(rule, "from", offset)
                if char in declared:
                    possibly_bound.add(char)
            for offset in rule.get("toVariables") or []:
                char = rule_mask_char(rule, "to", offset)
                if char in declared and char not in possibly_bound:
                    fail(
                        rule.get("line_no", line_no),
                        f"capture variable {char!r} is used in a destination "
                        "before any possible source binding",
                    )
            return
        for child in rule.get("rules") or []:
            walk(child)

    for child in node["rules"]:
        walk(child)


def looks_like_unknown_rule_directive(head: str) -> bool:
    if head in ALL_DIRECTIVES:
        return False
    if len(head) < 4:
        return False
    if not any(ch.isalpha() for ch in head):
        return False
    return all(ch.isalnum() or ch == "_" for ch in head) and head.upper() == head


def tokenize_lines(raw_lines: list[str]) -> list[LineToken]:
    tokens: list[LineToken] = []
    for line_no, raw_line in enumerate(raw_lines, start=1):
        stripped = raw_line.strip()
        lstripped = raw_line.lstrip()
        indent = len(raw_line) - len(lstripped)

        if lstripped.startswith(";;"):
            kind = "comment"
            parts: list[str] = []
        elif stripped == "":
            kind = "blank"
            parts = []
        else:
            kind = "text"
            parts = stripped.split()

        tokens.append(
            LineToken(
                line_no=line_no,
                raw=raw_line,
                stripped=stripped,
                indent=indent,
                parts=parts,
                kind=kind,
            )
        )
    return tokens



# ---------------------------------------------------------------------------
# Command templating: ZIP_CMDS / FOR_CMDS.
#
# Two grammar shapes:
#   ZIP_CMDS name_<g> g rkic G RKIC     (implicit-CMD form: body is a
#    <command body>                       command body; one CMD per tuple)
#   ZIP_CMDS g rkic G RKIC              (full-body form: body is exactly one
#    CMD name_<g> / ROTATE_CMDS ...       CMD or ROTATE_CMDS definition)
#
# Substitution regimes: bare variable characters substitute in pattern rows
# exactly as ZIP does; identifiers (generated name, CALL/CALL_EACH targets,
# side-effect fields) substitute only inside an explicit <v> marker. Markers
# are never interpreted in pattern cells, so literal `<`/`>` board text is
# untouched. Expansion is textual and happens before all other parsing;
# ZIP tuples expand left-to-right.

TEMPLATE_MARKER_RE = re.compile(r"<(.)>")


def _template_fail(line_no: int, message: str) -> NoReturn:
    fail(line_no, message)


def _rebuild_token(line_no: int, indent: int, parts: list[str], origin: str) -> LineToken:
    stripped = " ".join(parts)
    raw = " " * indent + stripped + "\n"
    return LineToken(
        line_no=line_no,
        raw=raw,
        stripped=stripped,
        indent=indent,
        parts=parts,
        kind="text",
        origin=origin,
    )


def _marker_sub(token_text: str, assn: dict[str, str], line_no: int, declared: set[str]) -> str:
    def replace(match: "re.Match[str]") -> str:
        var = match.group(1)
        if var not in declared:
            _template_fail(line_no, f"template marker <{var}> names an undeclared variable")
        return assn[var]

    return TEMPLATE_MARKER_RE.sub(replace, token_text)


def _scan_markers(token_text: str) -> set[str]:
    return {m.group(1) for m in TEMPLATE_MARKER_RE.finditer(token_text)}


def _parse_template_header(token: LineToken) -> tuple[str | None, list[tuple[str, str]]]:
    parts = token.parts
    line_no = token.line_no
    head = parts[0]
    args = parts[1:]
    name = None
    if args and len(args[0]) > 1:
        name = args[0]
        args = args[1:]
    if len(args) < 2 or len(args) % 2 != 0:
        _template_fail(line_no, f"{head} expects variable/value-list pairs")
    pairs = [(args[i], args[i + 1]) for i in range(0, len(args), 2)]
    if head == "FOR_CMDS" and len(pairs) != 1:
        _template_fail(line_no, "FOR_CMDS takes exactly one variable (nest for products)")
    seen_vars: set[str] = set()
    length = None
    for var, values in pairs:
        if len(var) != 1:
            _template_fail(line_no, f"template variable {var!r} must be one character")
        if var in seen_vars:
            _template_fail(line_no, f"duplicate template variable {var!r}")
        seen_vars.add(var)
        if not values:
            _template_fail(line_no, f"template variable {var!r} has an empty value list")
        if head == "ZIP_CMDS":
            if length is None:
                length = len(values)
            elif len(values) != length:
                _template_fail(
                    line_no,
                    f"ZIP_CMDS value lists must have equal length: "
                    f"{len(values)} vs {length}",
                )
    return name, pairs


def _template_body_checks(
    directive: LineToken,
    body: list[LineToken],
    pairs: list[tuple[str, str]],
    wildcard: str,
    extra_orbits: list[str],
) -> None:
    """Pre-expansion collision pass (provenance-safe per the design decision)."""
    tchars = {var for var, _ in pairs} | {c for _, values in pairs for c in values}
    for var, values in pairs:
        if var == wildcard:
            _template_fail(directive.line_no, f"template variable {var!r} collides with the wildcard")
        if wildcard in values:
            _template_fail(
                directive.line_no,
                f"template value list for {var!r} contains the wildcard {wildcard!r}",
            )
    def check_decl(chars: list[str], line_no: int, what: str) -> None:
        for ch in chars:
            if ch in tchars:
                _template_fail(
                    directive.line_no,
                    f"template variable or value {ch!r} collides with {what} "
                    f"declared on line {line_no}",
                )
    for orbit in extra_orbits:
        for ch in orbit:
            if ch in tchars:
                _template_fail(
                    directive.line_no,
                    f"template variable or value {ch!r} collides with an orbit character",
                )
    for token in body:
        if token.kind != "text":
            continue
        parts = token.parts
        head = parts[0]
        if head == "FOR" and len(parts) >= 2:
            check_decl([parts[1]], token.line_no, "a FOR variable")
        elif head == "ZIP" and len(parts) >= 3:
            check_decl(parts[1::2], token.line_no, "a ZIP variable")
        elif head in ("ATOMIC", "ATOMIC_VERTICAL", "ATOMIC_HORIZONTAL") and len(parts) >= 3:
            check_decl(parts[1::2], token.line_no, "a capture variable")
        elif head == "ROTATE":
            for orbit in parts[1:]:
                for ch in orbit:
                    if ch in tchars:
                        _template_fail(
                            directive.line_no,
                            f"template variable or value {ch!r} collides with a ROTATE "
                            f"orbit character on line {token.line_no}",
                        )
        elif head in TEMPLATE_DIRECTIVES:
            _template_fail(token.line_no, f"{head} may not be nested inside a template")


def _expand_one_template(
    directive: LineToken,
    body: list[LineToken],
    wildcard: str,
    generated_names: set[str],
) -> list[LineToken]:
    head = directive.parts[0]
    name_template, pairs = _parse_template_header(directive)
    declared = {var for var, _ in pairs}
    first_var = pairs[0][0]

    # Locate the full-body definition line, if any.
    body_text = [t for t in body if t.kind == "text"]
    def_token = None
    if name_template is None:
        if not body_text or body_text[0].parts[0] not in ("CMD", "ROTATE_CMDS"):
            _template_fail(
                directive.line_no,
                f"{head} without a name requires the body to be one CMD or "
                f"ROTATE_CMDS definition",
            )
        def_token = body_text[0]
        if len(def_token.parts) < 2:
            _template_fail(def_token.line_no, f"{def_token.parts[0]} expects a command name")
        name_template = def_token.parts[1]
        for other in body_text[1:]:
            if other.indent <= def_token.indent and other.parts[0] in ("CMD", "ROTATE_CMDS"):
                _template_fail(
                    other.line_no,
                    f"{head} full-body form allows exactly one definition",
                )
    if f"<{first_var}>" not in name_template:
        _template_fail(
            directive.line_no,
            f"template name {name_template!r} must contain the first variable "
            f"marker <{first_var}>",
        )

    extra_orbits = def_token.parts[2:] if def_token is not None and def_token.parts[0] == "ROTATE_CMDS" else []
    _template_body_checks(directive, body, pairs, wildcard, extra_orbits)

    # Usage accounting and undeclared-marker detection.
    used: set[str] = _scan_markers(name_template) & declared
    for token in _scan_markers(name_template) - declared:
        _template_fail(directive.line_no, f"template marker <{token}> names an undeclared variable")
    for token in body:
        if token.kind != "text":
            continue
        parts = token.parts
        head_word = parts[0]
        if head_word in ("CALL", "CALL_EACH"):
            for target in parts[1:]:
                markers = _scan_markers(target)
                if markers - declared:
                    bad = sorted(markers - declared)[0]
                    _template_fail(token.line_no, f"template marker <{bad}> names an undeclared variable")
                used |= markers
        elif head_word in ALL_DIRECTIVES or head_word in TEMPLATE_DIRECTIVES:
            continue
        else:
            pattern_parts = parts[:2] if len(parts) >= 2 else parts[:1]
            for pattern in pattern_parts:
                used |= {var for var in declared if var in pattern}
            for extra in parts[2:]:
                if extra.startswith("[") and extra.endswith("]"):
                    continue
                markers = _scan_markers(extra)
                if markers - declared:
                    bad = sorted(markers - declared)[0]
                    _template_fail(token.line_no, f"template marker <{bad}> names an undeclared variable")
                used |= markers
    unused = declared - used
    if unused:
        _template_fail(
            directive.line_no,
            f"template variable {sorted(unused)[0]!r} is declared but never used",
        )

    # Expansion, tuples left-to-right.
    count = len(pairs[0][1])
    expanded: list[LineToken] = []
    for index in range(count):
        assn = {var: values[index] for var, values in pairs}
        origin = directive.parts[0] + " " + name_template + " with " + ", ".join(
            f"{var}={assn[var]}" for var, _ in pairs
        )
        trans = str.maketrans(assn)
        generated_name = _marker_sub(name_template, assn, directive.line_no, declared)
        if generated_name in generated_names:
            _template_fail(
                directive.line_no,
                f"template generates duplicate command name {generated_name!r}",
            )
        generated_names.add(generated_name)

        if def_token is None:
            expanded.append(
                _rebuild_token(directive.line_no, directive.indent, ["CMD", generated_name], origin)
            )
            emit_body = body
        else:
            def_parts = [def_token.parts[0], generated_name] + def_token.parts[2:]
            expanded.append(
                _rebuild_token(def_token.line_no, directive.indent, def_parts, origin)
            )
            emit_body = [t for t in body if t is not def_token]

        for token in emit_body:
            if token.kind != "text":
                expanded.append(token)
                continue
            parts = token.parts
            head_word = parts[0]
            indent = max(token.indent - 1, 0) if def_token is not None else token.indent
            if head_word in ("CALL", "CALL_EACH"):
                new_parts = [head_word] + [
                    _marker_sub(t, assn, token.line_no, declared) for t in parts[1:]
                ]
            elif head_word in ALL_DIRECTIVES:
                new_parts = parts
            else:
                new_parts = []
                for i, part in enumerate(parts):
                    if i < 2 and not (part.startswith("[") and part.endswith("]")):
                        new_parts.append(part.translate(trans))
                    elif part.startswith("[") and part.endswith("]"):
                        new_parts.append(part)
                    else:
                        new_parts.append(_marker_sub(part, assn, token.line_no, declared))
            expanded.append(_rebuild_token(token.line_no, indent, new_parts, origin))
        expanded.append(
            LineToken(directive.line_no, "\n", "", 0, [], "blank", origin)
        )
    return expanded


def expand_command_templates(tokens: list[LineToken]) -> tuple[list[LineToken], frozenset[str]]:
    wildcard = "?"
    for token in tokens:
        if token.kind == "text" and token.parts[0] == "WILDCARD" and len(token.parts) > 1:
            wildcard = token.parts[1]
            break
    out: list[LineToken] = []
    generated: set[str] = set()
    i = 0
    while i < len(tokens):
        token = tokens[i]
        if token.kind == "text" and token.parts[0] in TEMPLATE_DIRECTIVES:
            if token.indent != 0:
                fail(token.line_no, f"{token.parts[0]} must appear at top level")
            body: list[LineToken] = []
            j = i + 1
            while j < len(tokens):
                nxt = tokens[j]
                if nxt.kind == "text" and nxt.indent <= token.indent:
                    break
                body.append(nxt)
                j += 1
            while body and body[-1].kind != "text":
                body.pop()
            out.extend(_expand_one_template(token, body, wildcard, generated))
            i = j
            continue
        out.append(token)
        i += 1
    return out, frozenset(generated)


def wildcard_assignments(wildcards_dict: dict[str, str]) -> tuple[dict[str, str], ...]:
    combined = list(
        itertools.product(
            *[list(itertools.product(wildcards_dict[k], repeat=1)) for k in wildcards_dict]
        )
    )
    dicts = []
    for combination in combined:
        temp = {}
        for key, value in zip(wildcards_dict, combination):
            temp[key] = value[0]
        dicts.append(temp)
    return tuple(dicts)


def deep_subs(rule: dict, assn: dict[str, str]) -> None:
    trans_table = str.maketrans(assn)
    rule_type = rule["type"]
    if rule_type == "simple":
        rule["from"] = [row.translate(trans_table) for row in rule["from"]]
        rule["to"] = [row.translate(trans_table) for row in rule["to"]]
        return
    if rule_type == "call":
        return
    if rule_type in ["atomic", "match1", "try_all", "random", "repeat", "cmd", "rotate", "rotate_cmds"]:
        for child in rule["rules"]:
            deep_subs(child, assn)
        return
    fail(0, f"unknown rule type during substitution: {rule_type!r}")


def strip_rule_metadata(rule: dict) -> dict:
    cleaned = {}
    for key, value in rule.items():
        if key in {"line_no", "flags"}:
            continue
        if key == "rules":
            cleaned[key] = [strip_rule_metadata(child) for child in value]
        else:
            cleaned[key] = value
    return cleaned


def add_reference(state: ParseState, command_name: str, line_no: int, source: str) -> None:
    if source == "CALL":
        state.call_references.append((command_name, line_no, source))
        return
    state.side_effect_references.append((command_name, line_no, source))


def collect_references_from_rule(state: ParseState, rule: dict) -> None:
    rule_type = rule["type"]
    line_no = rule.get("line_no", 0)

    if rule_type == "call":
        add_reference(state, rule["name"], line_no, "CALL")
        return
    if rule_type == "simple":
        for token in rule["side_effects"]:
            command_name = token[:-1] if token.endswith("!") else token
            if command_name == "":
                fail(line_no, "empty side-effect command")
            add_reference(state, command_name, line_no, "side effect")
        return
    if rule_type in {"atomic", "match1", "try_all", "random", "repeat", "cmd", "for", "zip", "let_repeat"}:
        for child in rule["rules"]:
            collect_references_from_rule(state, child)
        return
    fail(line_no, f"unknown rule type during reference collection: {rule_type!r}")


def add_rule(state: ParseState, rule: dict) -> None:
    if state.rules_stack:
        state.rules_stack[-1]["rules"].append(copy.deepcopy(rule))
        return
    collect_references_from_rule(state, rule)
    cleaned = strip_rule_metadata(rule)
    name = cleaned["name"]
    state.rules[name]["rules"].extend(cleaned["rules"])


def add_rule_to_command(state: ParseState, command_name: str, rule: dict) -> None:
    collect_references_from_rule(state, rule)
    cleaned = strip_rule_metadata(rule)
    state.rules[command_name]["rules"].append(cleaned)


def ensure_orbits(orbits: list[str], line_no: int, directive: str, wildcard_char: str = "?") -> None:
    for orbit in orbits:
        if len(orbit) not in {2, 4}:
            fail(line_no, f"{directive} orbit {orbit!r} must have length 2 or 4")
        if wildcard_char in orbit:
            fail(
                line_no,
                f"{directive} orbit {orbit!r} contains the effective wildcard {wildcard_char!r}",
            )


def rotate_grid(grid_rows: list[str], step: int) -> list[str]:
    step %= 4
    if step == 0:
        return list(grid_rows)

    grid = [list(row) for row in grid_rows]
    row_count = len(grid)
    col_count = len(grid[0])

    if step == 1:
        rotated = []
        for col in range(col_count):
            row = [grid[r][col] for r in range(row_count)]
            row.reverse()
            rotated.append("".join(row))
        return rotated

    if step == 2:
        return ["".join(reversed(row)) for row in reversed(grid)]

    rotated = []
    for col in range(col_count):
        row = [grid[r][col] for r in range(row_count)]
        rotated.append("".join(row))
    rotated.reverse()
    return rotated


def flip_grid(grid_rows: list[str], axis: str) -> list[str]:
    if axis == "horizontal":
        return ["".join(reversed(row)) for row in grid_rows]
    if axis == "vertical":
        return list(reversed(grid_rows))
    raise ValueError(f"unknown flip axis: {axis!r}")


def apply_orbits_to_pattern_rows(rows: list[str], orbits: list[str], step: int) -> list[str]:
    if not orbits:
        return list(rows)

    mapping: dict[str, str] = {}
    for orbit in orbits:
        orbit_len = len(orbit)
        for idx, char in enumerate(orbit):
            mapping[char] = orbit[(idx + step) % orbit_len]

    transformed = []
    for row in rows:
        transformed.append("".join(mapping.get(char, char) for char in row))
    return transformed


def rewrite_directional_suffix(name: str, step: int) -> str:
    if not name.endswith("_e"):
        return name
    return name[:-2] + DIRECTION_SUFFIXES[step]


def rewrite_side_effect_token(token: str, step: int) -> str:
    mandatory = token.endswith("!")
    command_name = token[:-1] if mandatory else token
    rewritten = rewrite_directional_suffix(command_name, step)
    return rewritten + ("!" if mandatory else "")


def expand_rotate_subtree(rule: dict, step: int, orbits: list[str], rewrite_suffixes: bool) -> None:
    rule_type = rule["type"]
    if rule_type == "simple":
        flags = set(rule.get("flags", []))
        from_rows = list(rule["from"])
        to_rows = list(rule["to"])

        if "norotate" not in flags:
            height = len(from_rows)
            width = len(from_rows[0]) if from_rows else 0
            if rule.get("fromVariables"):
                rule["fromVariables"] = rotate_mask_offsets(
                    rule["fromVariables"], height, width, step
                )
            if rule.get("toVariables"):
                rule["toVariables"] = rotate_mask_offsets(
                    rule["toVariables"], height, width, step
                )
            from_rows = rotate_grid(from_rows, step)
            to_rows = rotate_grid(to_rows, step)

        rule["from"] = apply_orbits_to_pattern_rows(from_rows, orbits, step)
        rule["to"] = apply_orbits_to_pattern_rows(to_rows, orbits, step)

        if rewrite_suffixes:
            rule["side_effects"] = [rewrite_side_effect_token(token, step) for token in rule["side_effects"]]
        return

    if rule_type == "call":
        if rewrite_suffixes:
            rule["name"] = rewrite_directional_suffix(rule["name"], step)
        return

    if rule_type in {"atomic", "match1", "try_all", "random", "repeat", "cmd"}:
        for child in rule["rules"]:
            expand_rotate_subtree(child, step, orbits, rewrite_suffixes)
        return

    fail(rule.get("line_no", 0), f"unknown rule type during ROTATE expansion: {rule_type!r}")


def expand_flip_subtree(rule: dict, axis: str) -> None:
    rule_type = rule["type"]
    if rule_type == "simple":
        height = len(rule["from"])
        width = len(rule["from"][0]) if rule["from"] else 0
        if rule.get("fromVariables"):
            rule["fromVariables"] = flip_mask_offsets(rule["fromVariables"], height, width, axis)
        if rule.get("toVariables"):
            rule["toVariables"] = flip_mask_offsets(rule["toVariables"], height, width, axis)
        rule["from"] = flip_grid(rule["from"], axis)
        rule["to"] = flip_grid(rule["to"], axis)
        return

    if rule_type == "call":
        return

    if rule_type in {"atomic", "match1", "try_all", "random", "repeat", "cmd"}:
        for child in rule["rules"]:
            expand_flip_subtree(child, axis)
        return

    fail(rule.get("line_no", 0), f"unknown rule type during FLIP expansion: {rule_type!r}")


def validate_simple_rule_buffer(buffer: RuleBuffer) -> None:
    if not buffer.from_rows:
        return

    first_line = buffer.line_nos[0]
    if len(buffer.from_rows) != len(buffer.to_rows):
        fail(first_line, "simple rule has mismatched from/to row count")

    from_width = len(buffer.from_rows[0])
    to_width = len(buffer.to_rows[0])
    for idx, row in enumerate(buffer.from_rows):
        if len(row) != from_width:
            fail(
                buffer.line_nos[idx],
                f"inconsistent from-pattern width: expected {from_width}, got {len(row)}",
            )
    for idx, row in enumerate(buffer.to_rows):
        if len(row) != to_width:
            fail(
                buffer.line_nos[idx],
                f"inconsistent to-pattern width: expected {to_width}, got {len(row)}",
            )
    for idx, (from_row, to_row) in enumerate(zip(buffer.from_rows, buffer.to_rows)):
        if len(from_row) != len(to_row):
            fail(
                buffer.line_nos[idx],
                f"from/to width mismatch: {len(from_row)} vs {len(to_row)}",
            )


def flush_simple_rule(state: ParseState) -> None:
    if not state.rule_buffer.from_rows:
        return

    validate_simple_rule_buffer(state.rule_buffer)
    first_line = state.rule_buffer.line_nos[0]
    rule = {
        "type": "simple",
        "from": state.rule_buffer.from_rows,
        "to": state.rule_buffer.to_rows,
        "side_effects": state.rule_buffer.side_effects,
        "method": state.rule_buffer.method,
        "flags": sorted(state.rule_buffer.flags),
        "line_no": first_line,
    }
    capture_chars = active_capture_chars(state)
    if capture_chars:
        from_offsets = capture_mask_offsets(rule["from"], capture_chars)
        to_offsets = capture_mask_offsets(rule["to"], capture_chars)
        if from_offsets:
            rule["fromVariables"] = from_offsets
        if to_offsets:
            rule["toVariables"] = to_offsets
    add_rule(state, rule)
    state.rule_buffer = RuleBuffer()


def flush_on_blank_line(state: ParseState) -> None:
    if state.temp_board:
        state.levels.append({"board": state.temp_board})
        state.temp_board = []
        return
    if state.temp_goal is not None and state.temp_goal:
        if state.levels:
            state.levels[-1].setdefault("goals", []).append(state.temp_goal)
        else:
            state.goals.append(state.temp_goal)
        state.temp_goal = None
        return
    if state.temp_void is not None and state.temp_void:
        if state.levels:
            state.levels[-1].setdefault("voids", []).append(state.temp_void)
        else:
            state.voids.append(state.temp_void)
        state.temp_void = None
        return
    if state.rule_buffer.from_rows:
        flush_simple_rule(state)


def process_rule_stack_to_level(state: ParseState, level: int) -> None:
    while state.indent_stack and state.indent_stack[-1] >= level:
        state.indent_stack.pop()
        rule = state.rules_stack.pop()
        rule_type = rule["type"]

        if rule_type in {"simple", "atomic", "match1", "try_all", "random", "repeat", "cmd"}:
            if rule_type == "atomic" and rule.get("variables"):
                check_definitely_unbound(rule, rule.get("line_no", 0))
            add_rule(state, rule)
            continue

        if rule_type == "for":
            for child in rule["rules"]:
                for assn in wildcard_assignments(rule["wildcards_dict"]):
                    modified = copy.deepcopy(child)
                    deep_subs(modified, assn)
                    add_rule(state, modified)
            continue

        if rule_type == "zip":
            zip_dict = rule["zip_dict"]
            if not zip_dict:
                fail(rule["line_no"], "ZIP expects at least one wildcard/value pair")
            lengths = {len(value) for value in zip_dict.values()}
            if len(lengths) != 1:
                fail(rule["line_no"], "ZIP value strings must all have equal length")
            length = len(next(iter(zip_dict.values())))
            for i in range(length):
                assn = {key: zip_dict[key][i] for key in zip_dict}
                for child in rule["rules"]:
                    modified = copy.deepcopy(child)
                    deep_subs(modified, assn)
                    add_rule(state, modified)
            continue

        if rule_type == "let_repeat":
            initial = rule["initial"]
            final = rule["final"]
            step = rule["step"]
            for i in range(initial, final, step):
                if i < 0:
                    fail(rule["line_no"], "LET_REPEAT generated a negative repeat count")
                assn = {key: seed * i for key, seed in rule["let_repeat_dict"].items()}
                for child in rule["rules"]:
                    modified = copy.deepcopy(child)
                    deep_subs(modified, assn)
                    add_rule(state, modified)
            continue

        if rule_type == "rotate":
            for step in range(4):
                for child in rule["rules"]:
                    modified = copy.deepcopy(child)
                    expand_rotate_subtree(modified, step, rule["orbits"], rewrite_suffixes=True)
                    add_rule(state, modified)
            continue

        if rule_type == "flip":
            for flipped in (False, True):
                for child in rule["rules"]:
                    modified = copy.deepcopy(child)
                    if flipped:
                        expand_flip_subtree(modified, rule["axis"])
                    add_rule(state, modified)
            continue

        if rule_type == "rotate_cmds":
            base_name = rule["base_name"]
            for suffix in DIRECTION_SUFFIXES:
                generated_name = f"{base_name}{suffix}"
                if generated_name not in state.rules:
                    state.rules[generated_name] = {"type": "match1", "rules": []}
            for step in range(4):
                generated_name = f"{base_name}{DIRECTION_SUFFIXES[step]}"
                for child in rule["rules"]:
                    modified = copy.deepcopy(child)
                    expand_rotate_subtree(modified, step, rule["orbits"], rewrite_suffixes=True)
                    add_rule_to_command(state, generated_name, modified)
            continue

        fail(rule.get("line_no", 0), f"unknown rule type: {rule_type!r}")


def ensure_rule_context(state: ParseState, head: str, line_no: int) -> None:
    if not state.rules_stack:
        fail(line_no, f"{head} must appear inside CMD or a rule block")


def in_rotate_context(state: ParseState) -> bool:
    return any(rule["type"] in {"rotate", "rotate_cmds"} for rule in state.rules_stack)


def parse_annotation_token(state: ParseState, annotation: str, line_no: int) -> tuple[str, str]:
    if annotation in METHOD_ANNOTATIONS:
        return ("method", annotation)
    if annotation in FLAG_ANNOTATIONS:
        if annotation == "norotate" and not in_rotate_context(state):
            fail(line_no, "[norotate] is only valid inside ROTATE or ROTATE_CMDS")
        return ("flag", annotation)
    fail(line_no, f"unknown annotation token: [{annotation}]")


def parse_directive(state: ParseState, token: LineToken) -> bool:
    if token.kind != "text":
        return False

    parts = token.parts
    line_no = token.line_no
    line = token.stripped
    head = parts[0]

    # Pattern rows accumulate into one rectangular simple rule until a blank
    # line flushes them.  Silently accepting a directive here used to leave
    # the rows buffered: the directive became an earlier sibling and the rows
    # could then glue to a later sibling's pattern.  This twice broke Pacman's
    # steering guards while still producing valid-looking compiled JSON.
    if head in ALL_DIRECTIVES and state.rule_buffer.from_rows:
        first_line = state.rule_buffer.line_nos[0]
        fail(
            line_no,
            f"blank line required after rule pattern begun on line {first_line} "
            f"before {head}",
        )

    if head in TOP_LEVEL_ONLY_DIRECTIVES or head in TOP_LEVEL_BLOCK_DIRECTIVES:
        process_rule_stack_to_level(state, token.indent + 1)

    if head in TOP_LEVEL_ONLY_DIRECTIVES and state.rules_stack:
        fail(line_no, f"{head} is not allowed inside a rule block")
    if head in TOP_LEVEL_BLOCK_DIRECTIVES and state.rules_stack:
        fail(line_no, f"{head} is not allowed inside a rule block")

    if head == "GOAL":
        expect_exact_arity(parts, 1, line_no, "GOAL")
        state.patterns_started = True
        state.temp_goal = []
        return True

    if head == "VOID":
        expect_exact_arity(parts, 1, line_no, "VOID")
        state.patterns_started = True
        state.temp_void = []
        return True

    if head == "CLASS":
        parse_class_directive(state, line, line_no)
        return True

    if head == "WILDCARD":
        expect_exact_arity(parts, 2, line_no, "WILDCARD")
        token = parts[1]
        if len(token) != 1:
            fail(line_no, "WILDCARD expects exactly one character")
        if state.wildcard_char is not None:
            fail(line_no, "duplicate WILDCARD declaration")
        if state.patterns_started:
            fail(line_no, "WILDCARD must appear before any rule, board, GOAL, or VOID")
        state.wildcard_char = token
        return True

    if head == "HIDDEN_LINE_CHAR":
        expect_exact_arity(parts, 2, line_no, "HIDDEN_LINE_CHAR")
        for char in parts[1]:
            state.hidden_line_chars.append(char)
        return True

    if head == "DESCRIPTION":
        description = line.split("DESCRIPTION", 1)[1].strip()
        if state.levels:
            state.levels[-1]["description"] = description
        else:
            state.game_description = description
        return True

    if head == "MINMOVES":
        expect_exact_arity(parts, 2, line_no, "MINMOVES")
        min_moves = parse_int(parts[1], line_no, "MINMOVES")
        if min_moves < 0:
            fail(line_no, "MINMOVES must be a non-negative integer")
        if state.levels:
            state.levels[-1]["minMoves"] = min_moves
        return True

    if head == "TICK":
        expect_exact_arity(parts, 2, line_no, "TICK")
        tick = parse_int(parts[1], line_no, "TICK")
        if tick <= 0:
            fail(line_no, "TICK must be a positive integer")
        if state.levels:
            state.levels[-1]["tickInterval"] = tick
        else:
            state.global_tick = tick
        return True

    if head == "TITLE":
        title = line.split("TITLE", 1)[1].strip()
        if state.levels:
            state.levels[-1]["title"] = title
        else:
            state.game_title = title
        return True

    if head == "WHITESPACE":
        expect_exact_arity(parts, 2, line_no, "WHITESPACE")
        for char in parts[1]:
            state.whitespace.append(char)
        return True

    if head == "CHARMAP":
        expect_pairs(parts, 1, line_no, "CHARMAP")
        for i in range(1, len(parts), 2):
            state.char_map[parts[i]] = parts[i + 1]
        return True

    if head == "COLOR":
        expect_pairs(parts, 1, line_no, "COLOR")
        for i in range(1, len(parts), 2):
            state.color_map[parts[i]] = parts[i + 1]
        return True

    if head == "BY":
        author = line.split("BY", 1)[1].strip()
        if state.levels:
            state.levels[-1]["author"] = author
        else:
            state.game_author = author
        return True

    if head == "BIND":
        bind_body = line.split("BIND", 1)[1].strip()
        for key, command, description in parse_bind_entries(bind_body, line_no):
            if description is None:
                state.binds[key] = command
            else:
                state.binds[key] = {"command": command, "description": description}
        return True

    if head == "CMD":
        expect_exact_arity(parts, 2, line_no, "CMD")
        state.patterns_started = True
        level = token.indent + 1
        process_rule_stack_to_level(state, level)
        name = parts[1]
        if name in state.generated_command_names and token.origin is None:
            fail(line_no, f"command name {name!r} is reserved by a template")
        state.rules_stack.append({"type": "cmd", "name": name, "rules": [], "line_no": line_no})
        state.indent_stack.append(level)
        if name not in state.rules:
            state.rules[name] = {"type": "match1", "rules": []}
        return True

    if head == "ROTATE_CMDS":
        if len(parts) < 2:
            fail(line_no, "ROTATE_CMDS expects a base command name")
        state.patterns_started = True
        level = token.indent + 1
        process_rule_stack_to_level(state, level)
        base_name = parts[1]
        if base_name in state.generated_command_names and token.origin is None:
            fail(line_no, f"command name {base_name!r} is reserved by a template")
        orbits = parts[2:]
        ensure_orbits(orbits, line_no, "ROTATE_CMDS", state.wildcard_char or "?")
        state.rules_stack.append(
            {
                "type": "rotate_cmds",
                "base_name": base_name,
                "orbits": orbits,
                "rules": [],
                "line_no": line_no,
            }
        )
        state.indent_stack.append(level)
        return True

    if head == "FOR":
        ensure_rule_context(state, "FOR", line_no)
        expect_pairs(parts, 1, line_no, "FOR")
        level = token.indent + 1
        process_rule_stack_to_level(state, level)
        wildcards_dict = {}
        for i in range(1, len(parts), 2):
            for char in parts[i]:
                wildcards_dict[char] = parts[i + 1]
        check_wildcards_vs_captures(state, wildcards_dict.keys(), line_no, "FOR")
        state.rules_stack.append(
            {"type": "for", "wildcards_dict": wildcards_dict, "rules": [], "line_no": line_no}
        )
        state.indent_stack.append(level)
        return True

    if head == "ROTATE":
        ensure_rule_context(state, "ROTATE", line_no)
        level = token.indent + 1
        process_rule_stack_to_level(state, level)
        orbits = parts[1:]
        ensure_orbits(orbits, line_no, "ROTATE", state.wildcard_char or "?")
        check_wildcards_vs_captures(state, "".join(orbits), line_no, "ROTATE orbit")
        state.rules_stack.append({"type": "rotate", "orbits": orbits, "rules": [], "line_no": line_no})
        state.indent_stack.append(level)
        return True

    if head in {"FLIP_HORIZONTAL", "FLIP_VERTICAL"}:
        ensure_rule_context(state, head, line_no)
        expect_exact_arity(parts, 1, line_no, head)
        level = token.indent + 1
        process_rule_stack_to_level(state, level)
        axis = "horizontal" if head == "FLIP_HORIZONTAL" else "vertical"
        state.rules_stack.append({"type": "flip", "axis": axis, "rules": [], "line_no": line_no})
        state.indent_stack.append(level)
        return True

    if head == "ZIP":
        ensure_rule_context(state, "ZIP", line_no)
        expect_pairs(parts, 1, line_no, "ZIP")
        level = token.indent + 1
        process_rule_stack_to_level(state, level)
        zip_dict = {}
        for i in range(1, len(parts), 2):
            wildcard = parts[i]
            if len(wildcard) != 1:
                fail(line_no, "ZIP wildcard keys must be a single character")
            zip_dict[wildcard] = parts[i + 1]
        check_wildcards_vs_captures(state, zip_dict.keys(), line_no, "ZIP")
        state.rules_stack.append(
            {"type": "zip", "zip_dict": zip_dict, "rules": [], "line_no": line_no}
        )
        state.indent_stack.append(level)
        return True

    if head == "LET_REPEAT":
        ensure_rule_context(state, "LET_REPEAT", line_no)
        if len(parts) < 4:
            fail(
                line_no,
                "LET_REPEAT expects: initial final step [wildcard seed ...]",
            )
        if (len(parts) - 4) % 2 != 0:
            fail(line_no, "LET_REPEAT expects wildcard/seed pairs after step")

        level = token.indent + 1
        process_rule_stack_to_level(state, level)
        initial = parse_int(parts[1], line_no, "LET_REPEAT initial")
        final = parse_int(parts[2], line_no, "LET_REPEAT final")
        step = parse_int(parts[3], line_no, "LET_REPEAT step")
        if step == 0:
            fail(line_no, "LET_REPEAT step must not be zero")

        for i in range(initial, final, step):
            if i < 0:
                fail(line_no, "LET_REPEAT must not generate negative repeat counts")

        let_repeat_dict = {}
        for i in range(4, len(parts), 2):
            let_repeat_dict[parts[i]] = parts[i + 1]
        state.rules_stack.append(
            {
                "type": "let_repeat",
                "initial": initial,
                "final": final,
                "step": step,
                "let_repeat_dict": let_repeat_dict,
                "rules": [],
                "line_no": line_no,
            }
        )
        state.indent_stack.append(level)
        return True

    if head in BLOCK_DIRECTIVE_NODES:
        ensure_rule_context(state, head, line_no)
        level = token.indent + 1
        process_rule_stack_to_level(state, level)
        node: dict = dict(BLOCK_DIRECTIVE_NODES[head])
        if len(parts) > 1:
            if head != "ATOMIC":
                fail(line_no, f"{head} arguments are not supported (yet)")
            node["variables"] = parse_capture_arguments(state, parts[1:], line_no)
        node.update({"rules": [], "line_no": line_no})
        state.rules_stack.append(node)
        state.indent_stack.append(level)
        return True

    if head == "CALL":
        ensure_rule_context(state, "CALL", line_no)
        expect_exact_arity(parts, 2, line_no, "CALL")
        level = token.indent + 1
        process_rule_stack_to_level(state, level)
        command_name = parts[1]
        add_rule(state, {"type": "call", "name": command_name, "line_no": line_no})
        return True

    if head == "CALL_EACH":
        ensure_rule_context(state, "CALL_EACH", line_no)
        if len(parts) < 2:
            fail(line_no, "CALL_EACH expects at least one command name")
        level = token.indent + 1
        process_rule_stack_to_level(state, level)
        for command_name in parts[1:]:
            add_rule(state, {"type": "call", "name": command_name, "line_no": line_no})
        return True

    return False


def parse_rule_pattern_line(state: ParseState, token: LineToken) -> None:
    parts = token.parts
    line_no = token.line_no

    if looks_like_unknown_rule_directive(parts[0]) and len(parts) > 1:
        fail(line_no, f"unknown directive in rule block: {parts[0]}")

    process_rule_stack_to_level(state, token.indent + 1)
    from_pattern = parts[0]
    to_pattern = parts[1] if len(parts) > 1 else parts[0]

    state.rule_buffer.from_rows.append(from_pattern)
    state.rule_buffer.to_rows.append(to_pattern)
    state.rule_buffer.line_nos.append(line_no)

    if len(parts) <= 2:
        return

    for token_part in parts[2:]:
        if token_part[0] == "[" and token_part[-1] == "]":
            annotation = token_part[1:-1]
            kind, value = parse_annotation_token(state, annotation, line_no)
            if kind == "method":
                state.rule_buffer.method = value
            else:
                state.rule_buffer.flags.add(value)
            continue
        state.rule_buffer.side_effects.append(token_part)


def parse_plain_line(state: ParseState, token: LineToken) -> None:
    # Board rows, GOAL/VOID pattern rows, and rule pattern rows all fix the
    # wildcard's interpretation, so WILDCARD may no longer be declared.
    state.patterns_started = True
    if state.rules_stack:
        parse_rule_pattern_line(state, token)
        return
    if state.temp_goal is not None:
        state.temp_goal.append(token.stripped)
        return
    if state.temp_void is not None:
        state.temp_void.append(token.stripped)
        return
    state.temp_board.append(token.stripped)


def parse_tokens(tokens: list[LineToken], generated_names: frozenset[str] = frozenset()) -> ParseState:
    state = ParseState()
    state.generated_command_names = generated_names
    for token in tokens:
        if token.kind == "comment":
            continue
        if token.kind == "blank":
            flush_on_blank_line(state)
            continue

        try:
            if not parse_directive(state, token):
                parse_plain_line(state, token)
        except DSLParseError as exc:
            if token.origin and "(in " not in exc.message:
                raise DSLParseError(exc.line_no, f"{exc.message} (in {token.origin})") from exc
            raise

    flush_on_blank_line(state)
    process_rule_stack_to_level(state, 0)
    return state


def validate_state(state: ParseState) -> None:
    for command_name, line_no, source in state.call_references:
        if command_name not in state.rules:
            fail(line_no, f"{source} references unknown command: {command_name}")
    for command_name, line_no, source in state.side_effect_references:
        if command_name not in state.rules:
            fail(line_no, f"{source} references unknown command: {command_name}")


def emit_result(state: ParseState) -> dict:
    result = {
        "levels": state.levels,
        "rules": state.rules,
        "binds": state.binds,
        "goals": state.goals,
        "voids": state.voids,
        "whitespaceChars": state.whitespace,
        "charMap": state.char_map,
        "colorMap": state.color_map,
        "hiddenLineChars": state.hidden_line_chars,
        "globalTick": state.global_tick,
        "gameTitle": state.game_title,
        "gameDescription": state.game_description,
        "gameAuthor": state.game_author,
    }
    # Only declared wildcards reach the output, so games without the
    # directive keep byte-identical compiled data.
    if state.wildcard_char is not None:
        result["wildcardChar"] = state.wildcard_char
    return result


def compile_game(filename: str) -> dict:
    with open(filename, "r", encoding="utf-8") as file:
        raw_lines = file.readlines()

    tokens = tokenize_lines(raw_lines)
    tokens, generated_names = expand_command_templates(tokens)
    state = parse_tokens(tokens, generated_names)
    validate_state(state)
    return emit_result(state)


def read_existing_games_data() -> dict:
    if not Path("gamesData.js").exists():
        return {}
    try:
        with open("gamesData.js", "r", encoding="utf-8") as json_file:
            text = json_file.read()
            prefix = "let gamesData = "
            if not text.startswith(prefix):
                raise ValueError("unexpected gamesData.js prefix")
            data = text[len(prefix) :].strip()
            if data.endswith(";"):
                data = data[:-1]
            return json.loads(data)
    except Exception as exc:
        # Never silently discard previously compiled games: keep the
        # unparseable file around so nothing is lost.
        backup = "gamesData.js.corrupt"
        shutil.copy2("gamesData.js", backup)
        print(
            f"warning: could not parse gamesData.js ({exc}); "
            f"saved a copy to {backup} and starting from an empty set",
            file=sys.stderr,
        )
        return {}


def write_games_data(data: dict) -> None:
    with open("gamesData.js", "w", encoding="utf-8") as json_file:
        json_file.write("let gamesData = ")
        json.dump(data, json_file, indent=4)
        json_file.write(";")


def main(argv: list[str]) -> int:
    if len(argv) != 2:
        print("usage: python3 make-data.py <game-file>", file=sys.stderr)
        return 2

    filename = argv[1]
    try:
        result = compile_game(filename)
    except DSLParseError as exc:
        print(f"{filename}:{exc.line_no}: error: {exc.message}", file=sys.stderr)
        return 2

    data = read_existing_games_data()
    data[Path(filename).stem] = result
    write_games_data(data)
    return 0


if __name__ == "__main__":
    raise SystemExit(main(sys.argv))
