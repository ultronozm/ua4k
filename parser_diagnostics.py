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
    return 0


if __name__ == "__main__":
    try:
        raise SystemExit(main())
    except Exception as exc:
        print(f"error: {exc}", file=sys.stderr)
        raise SystemExit(2)
