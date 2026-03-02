import copy
import itertools
import json
import sys


TOP_LEVEL_ONLY_DIRECTIVES = {
    "GOAL",
    "VOID",
    "HIDDEN_LINE_CHAR",
    "DESCRIPTION",
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
    "ATOMIC",
    "ATOMIC_VERTICAL",
    "ATOMIC_HORIZONTAL",
    "MATCH1",
    "TRY_ALL",
    "RANDOM",
    "CALL",
}

ALL_DIRECTIVES = TOP_LEVEL_ONLY_DIRECTIVES | RULE_BLOCK_DIRECTIVES | {"CMD"}


class DSLParseError(Exception):
    def __init__(self, line_no, message):
        super().__init__(message)
        self.line_no = line_no
        self.message = message


def fail(line_no, message):
    raise DSLParseError(line_no, message)


def parse_int(token, line_no, field_name):
    try:
        return int(token)
    except ValueError:
        fail(line_no, f"invalid integer for {field_name}: {token!r}")


def expect_exact_arity(parts, expected, line_no, directive):
    if len(parts) != expected:
        fail(line_no, f"{directive} expects {expected - 1} argument(s)")


def expect_pairs(parts, start_index, line_no, directive):
    if len(parts) <= start_index:
        fail(line_no, f"{directive} expects at least one key/value pair")
    if (len(parts) - start_index) % 2 != 0:
        fail(line_no, f"{directive} expects key/value pairs")


def looks_like_unknown_rule_directive(head):
    if head in ALL_DIRECTIVES:
        return False
    if len(head) < 4:
        return False
    if not any(ch.isalpha() for ch in head):
        return False
    return all(ch.isalnum() or ch == "_" for ch in head) and head.upper() == head


def wildcard_assignments(wildcards_dict):
    wd = wildcards_dict
    combined = list(
        itertools.product(
            *[list(itertools.product(wd[k], repeat=1)) for k in wd]
        )
    )
    dicts = []
    for combination in combined:
        temp = {}
        for key, value in zip(wd, combination):
            temp[key] = value[0]
        dicts.append(temp)
    return tuple(dicts)


def deep_subs(rule, assn):
    trans_table = str.maketrans(assn)
    if rule["type"] == "simple":
        rule["from"] = [s.translate(trans_table) for s in rule["from"]]
        rule["to"] = [s.translate(trans_table) for s in rule["to"]]
    elif rule["type"] == "call":
        return
    elif rule["type"] in ["atomic", "match1", "try_all", "random", "cmd"]:
        for i in range(len(rule["rules"])):
            deep_subs(rule["rules"][i], assn)
    else:
        fail(0, f"unknown rule type during substitution: {rule['type']!r}")


if len(sys.argv) != 2:
    print("usage: python3 make-data.py <game-file>", file=sys.stderr)
    raise SystemExit(2)

filename = sys.argv[1]
with open(filename, "r", encoding="utf-8") as file:
    lines = file.readlines()


levels = []
rules = {}
binds = {}
goals = []
voids = []
whitespace = []
char_map = {}
color_map = {}
hidden_line_chars = []
global_tick = None

temp_board = []
temp_goal = None
temp_void = None
side_effects = []
method = "firstmatch"
temp_rule_from = []
temp_rule_to = []
temp_rule_line_numbers = []

call_references = []
side_effect_references = []

rules_stack = []
indent_stack = []


def add_rule(rule):
    rule = strip_rule_metadata(rule)
    if len(rules_stack) > 0:
        rules_stack[-1]["rules"].append(rule)
    else:
        name = rule["name"]
        rules[name]["rules"].extend(rule["rules"])


def strip_rule_metadata(rule):
    if not isinstance(rule, dict):
        return rule

    cleaned = {}
    for key, value in rule.items():
        if key == "line_no":
            continue
        if key == "rules":
            cleaned[key] = [strip_rule_metadata(child) for child in value]
        else:
            cleaned[key] = value
    return cleaned


def validate_simple_rule():
    if not temp_rule_from:
        return

    first_line = temp_rule_line_numbers[0]
    if len(temp_rule_from) != len(temp_rule_to):
        fail(first_line, "simple rule has mismatched from/to row count")

    from_width = len(temp_rule_from[0])
    to_width = len(temp_rule_to[0])
    for idx, row in enumerate(temp_rule_from):
        if len(row) != from_width:
            fail(
                temp_rule_line_numbers[idx],
                f"inconsistent from-pattern width: expected {from_width}, got {len(row)}",
            )
    for idx, row in enumerate(temp_rule_to):
        if len(row) != to_width:
            fail(
                temp_rule_line_numbers[idx],
                f"inconsistent to-pattern width: expected {to_width}, got {len(row)}",
            )
    for idx, (from_row, to_row) in enumerate(zip(temp_rule_from, temp_rule_to)):
        if len(from_row) != len(to_row):
            fail(
                temp_rule_line_numbers[idx],
                f"from/to width mismatch: {len(from_row)} vs {len(to_row)}",
            )


def process_rule_stack_to_level(level):
    while len(indent_stack) > 0 and indent_stack[-1] >= level:
        indent_stack.pop()
        rule = rules_stack.pop()
        rule_type = rule["type"]
        match rule_type:
            case "simple" | "atomic" | "match1" | "try_all" | "random" | "cmd":
                add_rule(rule)
            case "for":
                wildcards_dict = rule["wildcards_dict"]
                for child in rule["rules"]:
                    for assn in wildcard_assignments(wildcards_dict):
                        modified_rule = copy.deepcopy(child)
                        deep_subs(modified_rule, assn)
                        add_rule(modified_rule)
            case "zip":
                zip_dict = rule["zip_dict"]
                if len(zip_dict) == 0:
                    fail(rule["line_no"], "ZIP expects at least one wildcard/value pair")
                lengths = {len(value) for value in zip_dict.values()}
                if len(lengths) != 1:
                    fail(rule["line_no"], "ZIP value strings must all have equal length")
                length = len(next(iter(zip_dict.values())))
                for i in range(length):
                    assn = {}
                    for key in zip_dict:
                        assn[key] = zip_dict[key][i]
                    for child in rule["rules"]:
                        modified_rule = copy.deepcopy(child)
                        deep_subs(modified_rule, assn)
                        add_rule(modified_rule)
            case "let_repeat":
                initial = rule["initial"]
                final = rule["final"]
                step = rule["step"]
                let_repeat_dict = rule["let_repeat_dict"]
                for i in range(initial, final, step):
                    if i < 0:
                        fail(rule["line_no"], "LET_REPEAT generated a negative repeat count")
                    assn = {}
                    for key in let_repeat_dict:
                        assn[key] = let_repeat_dict[key] * i
                    for child in rule["rules"]:
                        modified_rule = copy.deepcopy(child)
                        deep_subs(modified_rule, assn)
                        add_rule(modified_rule)
            case _:
                fail(rule.get("line_no", 0), f"unknown rule type: {rule_type!r}")


def on_blank_line():
    global temp_board
    global temp_goal
    global temp_void
    global temp_rule_from
    global temp_rule_to
    global side_effects
    global method
    global temp_rule_line_numbers

    if len(temp_board) > 0:
        levels.append({"board": temp_board})
        temp_board = []
    elif temp_goal is not None and len(temp_goal) > 0:
        goals.append(temp_goal)
        temp_goal = None
    elif temp_void is not None and len(temp_void) > 0:
        voids.append(temp_void)
        temp_void = None
    elif len(temp_rule_from) > 0:
        validate_simple_rule()
        add_rule(
            {
                "type": "simple",
                "from": temp_rule_from,
                "to": temp_rule_to,
                "side_effects": side_effects,
                "method": method,
            }
        )
        temp_rule_from = []
        temp_rule_to = []
        temp_rule_line_numbers = []
        side_effects = []
        method = "firstmatch"


def ensure_rule_context(head, line_no):
    if len(rules_stack) == 0:
        fail(line_no, f"{head} must appear inside CMD or a rule block")


def validate_command_references():
    for command_name, line_no, source in call_references:
        if command_name not in rules:
            fail(line_no, f"{source} references unknown command: {command_name}")
    for command_name, line_no, source in side_effect_references:
        if command_name not in rules:
            fail(line_no, f"{source} references unknown command: {command_name}")


try:
    for line_no, raw_line in enumerate(lines, start=1):
        if raw_line.lstrip().startswith(";;"):
            continue
        if raw_line.strip() == "":
            on_blank_line()
            continue

        line = raw_line.strip()
        parts = line.split()
        head = parts[0]
        indent = len(raw_line) - len(raw_line.lstrip())

        if head in TOP_LEVEL_ONLY_DIRECTIVES and len(rules_stack) > 0:
            fail(line_no, f"{head} is not allowed inside a rule block")

        match head:
            case "GOAL":
                expect_exact_arity(parts, 1, line_no, "GOAL")
                temp_goal = []
            case "VOID":
                expect_exact_arity(parts, 1, line_no, "VOID")
                temp_void = []
            case "HIDDEN_LINE_CHAR":
                expect_exact_arity(parts, 2, line_no, "HIDDEN_LINE_CHAR")
                for char in parts[1]:
                    hidden_line_chars.append(char)
            case "DESCRIPTION":
                description = line.split("DESCRIPTION", 1)[1].strip()
                if len(levels) > 0:
                    levels[-1]["description"] = description
            case "TICK":
                expect_exact_arity(parts, 2, line_no, "TICK")
                tick = parse_int(parts[1], line_no, "TICK")
                if tick <= 0:
                    fail(line_no, "TICK must be a positive integer")
                if len(levels) > 0:
                    levels[-1]["tickInterval"] = tick
                else:
                    global_tick = tick
            case "TITLE":
                title = line.split("TITLE", 1)[1].strip()
                if len(levels) > 0:
                    levels[-1]["title"] = title
            case "WHITESPACE":
                expect_exact_arity(parts, 2, line_no, "WHITESPACE")
                for char in parts[1]:
                    whitespace.append(char)
            case "CHARMAP":
                expect_pairs(parts, 1, line_no, "CHARMAP")
                for i in range(1, len(parts), 2):
                    char_map[parts[i]] = parts[i + 1]
            case "COLOR":
                expect_pairs(parts, 1, line_no, "COLOR")
                for i in range(1, len(parts), 2):
                    color_map[parts[i]] = parts[i + 1]
            case "BY":
                author = line.split("BY", 1)[1].strip()
                if len(levels) > 0:
                    levels[-1]["author"] = author
            case "BIND":
                expect_pairs(parts, 1, line_no, "BIND")
                for i in range(1, len(parts), 2):
                    binds[parts[i]] = parts[i + 1]
            case "CMD":
                expect_exact_arity(parts, 2, line_no, "CMD")
                level = indent + 1
                process_rule_stack_to_level(level)
                name = parts[1]
                rules_stack.append({"type": "cmd", "name": name, "rules": [], "line_no": line_no})
                indent_stack.append(level)
                if name not in rules:
                    rules[name] = {"type": "match1", "rules": []}
            case "FOR":
                ensure_rule_context("FOR", line_no)
                expect_pairs(parts, 1, line_no, "FOR")
                level = indent + 1
                process_rule_stack_to_level(level)
                wildcards_dict = {}
                for i in range(1, len(parts), 2):
                    for char in parts[i]:
                        wildcards_dict[char] = parts[i + 1]
                rules_stack.append(
                    {"type": "for", "wildcards_dict": wildcards_dict, "rules": [], "line_no": line_no}
                )
                indent_stack.append(level)
            case "ZIP":
                ensure_rule_context("ZIP", line_no)
                expect_pairs(parts, 1, line_no, "ZIP")
                level = indent + 1
                process_rule_stack_to_level(level)
                zip_dict = {}
                for i in range(1, len(parts), 2):
                    arg = parts[i]
                    if len(arg) != 1:
                        fail(line_no, "ZIP wildcard keys must be a single character")
                    zip_dict[arg] = parts[i + 1]
                rules_stack.append({"type": "zip", "zip_dict": zip_dict, "rules": [], "line_no": line_no})
                indent_stack.append(level)
            case "LET_REPEAT":
                ensure_rule_context("LET_REPEAT", line_no)
                if len(parts) < 6:
                    fail(
                        line_no,
                        "LET_REPEAT expects: initial final step wildcard seed [wildcard seed ...]",
                    )
                if (len(parts) - 4) % 2 != 0:
                    fail(line_no, "LET_REPEAT expects wildcard/seed pairs after step")

                level = indent + 1
                process_rule_stack_to_level(level)
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
                    arg = parts[i]
                    let_repeat_dict[arg] = parts[i + 1]
                rules_stack.append(
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
                indent_stack.append(level)
            case "ATOMIC":
                ensure_rule_context("ATOMIC", line_no)
                level = indent + 1
                process_rule_stack_to_level(level)
                rules_stack.append({"type": "atomic", "rules": [], "line_no": line_no})
                indent_stack.append(level)
            case "ATOMIC_VERTICAL":
                ensure_rule_context("ATOMIC_VERTICAL", line_no)
                level = indent + 1
                process_rule_stack_to_level(level)
                rules_stack.append(
                    {"type": "atomic", "condition": "vertical", "rules": [], "line_no": line_no}
                )
                indent_stack.append(level)
            case "ATOMIC_HORIZONTAL":
                ensure_rule_context("ATOMIC_HORIZONTAL", line_no)
                level = indent + 1
                process_rule_stack_to_level(level)
                rules_stack.append(
                    {"type": "atomic", "condition": "horizontal", "rules": [], "line_no": line_no}
                )
                indent_stack.append(level)
            case "MATCH1":
                ensure_rule_context("MATCH1", line_no)
                level = indent + 1
                process_rule_stack_to_level(level)
                rules_stack.append({"type": "match1", "rules": [], "line_no": line_no})
                indent_stack.append(level)
            case "TRY_ALL":
                ensure_rule_context("TRY_ALL", line_no)
                level = indent + 1
                process_rule_stack_to_level(level)
                rules_stack.append({"type": "try_all", "rules": [], "line_no": line_no})
                indent_stack.append(level)
            case "RANDOM":
                ensure_rule_context("RANDOM", line_no)
                level = indent + 1
                process_rule_stack_to_level(level)
                rules_stack.append({"type": "random", "rules": [], "line_no": line_no})
                indent_stack.append(level)
            case "CALL":
                ensure_rule_context("CALL", line_no)
                expect_exact_arity(parts, 2, line_no, "CALL")
                level = indent + 1
                process_rule_stack_to_level(level)
                command_name = parts[1]
                call_references.append((command_name, line_no, "CALL"))
                add_rule({"type": "call", "name": command_name, "line_no": line_no})
            case _:
                if len(rules_stack) > 0:
                    if looks_like_unknown_rule_directive(head) and len(parts) > 1:
                        fail(line_no, f"unknown directive in rule block: {head}")
                    process_rule_stack_to_level(indent + 1)

                    from_pattern = parts[0]
                    to_pattern = parts[1] if len(parts) > 1 else parts[0]
                    temp_rule_from.append(from_pattern)
                    temp_rule_to.append(to_pattern)
                    temp_rule_line_numbers.append(line_no)

                    if len(parts) > 2:
                        for token in parts[2:]:
                            if token[0] == "[" and token[-1] == "]":
                                method = token[1:-1]
                            else:
                                side_effects.append(token)
                                command_name = token[:-1] if token.endswith("!") else token
                                if command_name == "":
                                    fail(line_no, "empty side-effect command")
                                side_effect_references.append((command_name, line_no, "side effect"))
                elif temp_goal is not None:
                    temp_goal.append(line)
                elif temp_void is not None:
                    temp_void.append(line)
                else:
                    temp_board.append(line)

    on_blank_line()
    process_rule_stack_to_level(0)
    validate_command_references()

    result = {
        "levels": levels,
        "rules": rules,
        "binds": binds,
        "goals": goals,
        "voids": voids,
        "whitespaceChars": whitespace,
        "charMap": char_map,
        "colorMap": color_map,
        "hiddenLineChars": hidden_line_chars,
        "globalTick": global_tick,
    }
except DSLParseError as exc:
    print(f"{filename}:{exc.line_no}: error: {exc.message}", file=sys.stderr)
    raise SystemExit(2)

try:
    with open("gamesData.js", "r", encoding="utf-8") as json_file:
        data = json_file.read()[(len("let gamesData = ")) :].strip()
        data = data[:-1]
        data = json.loads(data)
except Exception:
    data = {}
    print("data read failed")

data[filename.split(".")[0]] = result

with open("gamesData.js", "w", encoding="utf-8") as json_file:
    json_file.write("let gamesData = ")
    json.dump(data, json_file, indent=4)
    json_file.write(";")
