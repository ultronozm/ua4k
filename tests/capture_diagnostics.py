#!/usr/bin/env python3
"""Adversarial diagnostics for captures and redirected wildcards (I1-I12/W1-W4)."""

from __future__ import annotations

import tempfile
import sys
from dataclasses import dataclass
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT))

import compiler_common


@dataclass(frozen=True)
class Case:
    name: str
    source: str
    line: int
    message: str


CASES = [
    Case("I1 unknown class", "CMD x\n ATOMIC 1 opne\n  1 1\n", 2, "unknown class 'opne'"),
    Case("I2 forward class", "CMD x\n ATOMIC 1 open\n  1 1\n\nCLASS open AB\n", 2, "unknown class 'open'"),
    Case("I3 duplicate class", "CLASS open AB\nCLASS open CD\n", 2, "duplicate CLASS 'open'"),
    Case("I4 odd ATOMIC arguments", "CMD x\n ATOMIC 1\n  A A\n", 2, "ATOMIC expects variable/domain pairs"),
    Case("I4 multi-cell variable", "CMD x\n ATOMIC 12 AB\n  A A\n", 2, "capture variable '12' must be a single character"),
    Case("I4 duplicate variable", "CMD x\n ATOMIC 1 AB 1 CD\n  1 1\n", 2, "duplicate capture variable '1'"),
    Case("I4 effective wildcard variable", "CMD x\n ATOMIC ? AB\n  A A\n", 2, "capture variable '?' is the effective wildcard"),
    Case("I5 definitely unbound destination", "CMD x\n ATOMIC 1 AB\n  A 1\n", 3, "capture variable '1' is used in a destination before any possible source binding"),
    Case("I6 nested shadow", "CMD x\n ATOMIC 1 AB\n  ATOMIC 1 AB\n   1 1\n", 3, "capture variable '1' shadows an enclosing declaration"),
    Case("I7 vertical arguments", "CMD x\n ATOMIC_VERTICAL 1 AB\n  1 1\n", 2, "ATOMIC_VERTICAL arguments are not supported (yet)"),
    Case("I7 horizontal arguments", "CMD x\n ATOMIC_HORIZONTAL 1 AB\n  1 1\n", 2, "ATOMIC_HORIZONTAL arguments are not supported (yet)"),
    Case("I8 outer FOR collision", "CMD x\n FOR 1 AB\n  ATOMIC 1 AB\n   1 1\n", 3, "capture variable '1' collides with an enclosing FOR wildcard"),
    Case("I8 outer ZIP collision", "CMD x\n ZIP 1 AB\n  ATOMIC 1 AB\n   1 1\n", 3, "capture variable '1' collides with an enclosing ZIP wildcard"),
    Case("I9 inner FOR collision", "CMD x\n ATOMIC 1 AB\n  FOR 1 AB\n   1 1\n", 3, "FOR uses '1', which is a capture variable of an enclosing ATOMIC"),
    Case("I9 inner ZIP collision", "CMD x\n ATOMIC 1 AB\n  ZIP 1 AB\n   1 1\n", 3, "ZIP uses '1', which is a capture variable of an enclosing ATOMIC"),
    Case("I10 inner orbit collision", "CMD x\n ATOMIC 1 AB\n  ROTATE 1234\n   1 1\n", 3, "ROTATE orbit uses '1', which is a capture variable of an enclosing ATOMIC"),
    Case("I10 outer orbit collision", "CMD x\n ROTATE 1234\n  ATOMIC 1 AB\n   1 1\n", 3, "capture variable '1' appears in an enclosing orbit '1234'"),
    Case("I12 unterminated CLASS quote", 'CLASS open "AB\n', 1, "unterminated quoted string in BIND"),
    Case("I12 text after CLASS quote", 'CLASS open "AB"x\n', 1, "expected whitespace after quoted BIND description"),
    Case("W1 duplicate", "WILDCARD *\nWILDCARD !\n", 2, "duplicate WILDCARD declaration"),
    Case("W1 late after board", "A\n\nWILDCARD *\n", 3, "WILDCARD must appear before any rule, board, GOAL, or VOID"),
    Case("W1 late after rule", "CMD x\n A A\n\nWILDCARD *\n", 4, "WILDCARD must appear before any rule, board, GOAL, or VOID"),
    Case("W1 late after GOAL", "GOAL\nA\n\nWILDCARD *\n", 4, "WILDCARD must appear before any rule, board, GOAL, or VOID"),
    Case("W1 late after VOID", "VOID\nA\n\nWILDCARD *\n", 4, "WILDCARD must appear before any rule, board, GOAL, or VOID"),
    Case("W1 empty", "WILDCARD\n", 1, "WILDCARD expects 1 argument(s)"),
    Case("W1 whitespace", "WILDCARD \" \"\n", 1, "WILDCARD expects 1 argument(s)"),
    Case("W1 multi-cell", "WILDCARD **\n", 1, "WILDCARD expects exactly one character"),
    Case("W3 redirected wildcard variable", "WILDCARD *\nCMD x\n ATOMIC * AB\n  A A\n", 3, "capture variable '*' is the effective wildcard"),
    Case("W4 redirected wildcard orbit", "WILDCARD *\nCMD x\n ROTATE *abc\n  A A\n", 3, "ROTATE orbit '*abc' contains the effective wildcard '*'"),
    Case("W4 default wildcard orbit", "CMD x\n ROTATE ?abc\n  A A\n", 2, "ROTATE orbit '?abc' contains the effective wildcard '?'"),
]


def main() -> int:
    module = compiler_common.load_make_data_module()
    with tempfile.TemporaryDirectory(prefix="ua4k-capture-diagnostics-") as directory:
        root = Path(directory)
        for index, case in enumerate(CASES):
            path = root / f"case-{index:02d}.txt"
            path.write_text(case.source, encoding="utf-8")
            try:
                module.compile_game(str(path))
            except module.DSLParseError as exc:
                if exc.line_no != case.line or case.message not in exc.message:
                    raise AssertionError(
                        f"{case.name}: expected line {case.line} containing {case.message!r}; "
                        f"got line {exc.line_no}: {exc.message}"
                    ) from exc
            else:
                raise AssertionError(f"{case.name}: expected compiler failure")
            print(f"ok: {case.name}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
