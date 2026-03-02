#!/usr/bin/env python3
"""Regression checks for expected parser diagnostics on invalid fixtures."""

from __future__ import annotations

import shutil
import subprocess
import sys
import tempfile
from pathlib import Path


ROOT = Path(__file__).resolve().parent
INVALID_DIR = ROOT / "invalid-fixtures"


CASES = [
    (
        "invalid-bind.txt",
        "invalid-bind.txt:3: error: BIND expects key/value pairs",
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
]


def run_case(name: str, expected: str) -> None:
    fixture = INVALID_DIR / name
    if not fixture.is_file():
        raise FileNotFoundError(f"missing invalid fixture: {fixture.relative_to(ROOT)}")

    with tempfile.TemporaryDirectory() as tmp:
        tmp_dir = Path(tmp)
        shutil.copy2(ROOT / "make-data.py", tmp_dir / "make-data.py")
        shutil.copy2(fixture, tmp_dir / name)

        proc = subprocess.run(
            ["python3", "make-data.py", name],
            cwd=tmp_dir,
            capture_output=True,
            text=True,
            check=False,
        )

    if proc.returncode == 0:
        raise AssertionError(f"{name}: expected failure, got success")
    if expected not in proc.stderr:
        raise AssertionError(
            f"{name}: expected stderr to contain:\n{expected}\n\nactual stderr:\n{proc.stderr}"
        )


def main() -> int:
    for name, expected in CASES:
        run_case(name, expected)
        print(f"ok: {name}")
    return 0


if __name__ == "__main__":
    try:
        raise SystemExit(main())
    except Exception as exc:
        print(f"error: {exc}", file=sys.stderr)
        raise SystemExit(2)
