#!/usr/bin/env python3
"""Regression checks for expected parser diagnostics on invalid fixtures."""

from __future__ import annotations

import sys
from pathlib import Path

import compiler_common


ROOT = Path(__file__).resolve().parent
INVALID_DIR = ROOT / "tests" / "invalid-fixtures"


CASES = [
    (
        "invalid-bind.txt",
        "invalid-bind.txt:3: error: BIND expects key/command pairs",
    ),
    (
        "invalid-rule-dimensions.txt",
        "invalid-rule-dimensions.txt:6: error: from/to width mismatch: 2 vs 1",
    ),
    (
        "invalid-call.txt",
        "invalid-call.txt:6: error: CALL references unknown command: missing_command",
    ),
    (
        "invalid-let-repeat.txt",
        "invalid-let-repeat.txt:6: error: LET_REPEAT step must not be zero",
    ),
    (
        "invalid-rule-directive.txt",
        "invalid-rule-directive.txt:6: error: unknown directive in rule block: BROKEN_DIRECTIVE",
    ),
    (
        "invalid-call-each.txt",
        "invalid-call-each.txt:6: error: CALL_EACH expects at least one command name",
    ),
    (
        "invalid-norotate.txt",
        "invalid-norotate.txt:10: error: [norotate] is only valid inside ROTATE or ROTATE_CMDS",
    ),
    (
        "invalid-orbit.txt",
        "invalid-orbit.txt:7: error: ROTATE orbit 'abc' must have length 2 or 4",
    ),
    (
        "invalid-flip.txt",
        "invalid-flip.txt:1: error: FLIP_HORIZONTAL must appear inside CMD or a rule block",
    ),
    (
        "invalid-detached-guard.txt",
        "invalid-detached-guard.txt:11: error: blank line required after rule pattern begun on line 10 before CALL",
    ),
    (
        "invalid-glued-sibling.txt",
        "invalid-glued-sibling.txt:8: error: blank line required after rule pattern begun on line 6 before ATOMIC",
    ),
    (
        "invalid-zipcmds-unequal.txt",
        "invalid-zipcmds-unequal.txt:1: error: ZIP_CMDS value lists must have equal length: 2 vs 3",
    ),
    (
        "invalid-zipcmds-no-marker.txt",
        "invalid-zipcmds-no-marker.txt:1: error: template name 'stepx' must contain the first variable marker <g>",
    ),
    (
        "invalid-zipcmds-unknown-marker.txt",
        "invalid-zipcmds-unknown-marker.txt:2: error: template marker <z> names an undeclared variable",
    ),
    (
        "invalid-zipcmds-unused.txt",
        "invalid-zipcmds-unused.txt:1: error: template variable 'G' is declared but never used",
    ),
    (
        "invalid-zipcmds-duplicate.txt",
        "invalid-zipcmds-duplicate.txt:1: error: template generates duplicate command name 'step_a'",
    ),
    (
        "invalid-zipcmds-reserved.txt",
        "invalid-zipcmds-reserved.txt:1: error: command name 'step_a' is reserved by a template",
    ),
    (
        "invalid-zipcmds-wildcard-value.txt",
        "invalid-zipcmds-wildcard-value.txt:1: error: template value list for 'g' contains the wildcard '?'",
    ),
    (
        "invalid-zipcmds-for-collision.txt",
        "invalid-zipcmds-for-collision.txt:1: error: template variable or value 'g' collides with a FOR variable declared on line 2",
    ),
    (
        "invalid-zipcmds-orbit-collision.txt",
        "invalid-zipcmds-orbit-collision.txt:1: error: template variable or value 'e' collides with an orbit character",
    ),
    (
        "invalid-zipcmds-capture-collision.txt",
        "invalid-zipcmds-capture-collision.txt:1: error: template variable or value 'b' collides with a capture variable declared on line 2",
    ),
    (
        "invalid-zipcmds-nested.txt",
        "invalid-zipcmds-nested.txt:2: error: ZIP_CMDS may not be nested inside a template",
    ),
]


def run_case(module, name: str, expected: str) -> None:
    fixture = INVALID_DIR / name
    if not fixture.is_file():
        raise FileNotFoundError(f"missing invalid fixture: {fixture.relative_to(ROOT)}")

    try:
        module.compile_game(str(fixture))
    except module.DSLParseError as exc:
        actual = f"{name}:{exc.line_no}: error: {exc.message}"
    else:
        raise AssertionError(f"{name}: expected failure, got success")

    if expected != actual:
        raise AssertionError(
            f"{name}: expected diagnostic:\n{expected}\n\nactual diagnostic:\n{actual}"
        )


def main() -> int:
    module = compiler_common.load_make_data_module()
    for name, expected in CASES:
        run_case(module, name, expected)
        print(f"ok: {name}")
    # Adjacent pattern rows remain the syntax for a legitimate multi-row
    # simple rule; only a directive before the terminating blank is rejected.
    valid = ROOT / "tests" / "fixtures" / "fixture-multiline-before-call.txt"
    module.compile_game(str(valid))
    print(f"ok: {valid.name} (valid multi-row rule)")
    return 0


if __name__ == "__main__":
    try:
        raise SystemExit(main())
    except Exception as exc:
        print(f"error: {exc}", file=sys.stderr)
        raise SystemExit(2)
