#!/usr/bin/env python3
"""D19 acceptance counts for Claude's two demonstration rewrites.

Compares the paired fixtures:
  fixture-tetris-lineclear-before/after  (label-column machinery vs captures)
  fixture-ghost-family-before/after      (floor-in-character vs register carry)

Counts are pinned: a regression in either direction fails `make check`.
"""

from __future__ import annotations

import json
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))
import compiler_common

ROOT = Path(__file__).resolve().parent.parent
FIXTURES = ROOT / "tests" / "fixtures"


def compile_fixture(name: str) -> dict:
    module = compiler_common.load_make_data_module()
    return module.compile_game(str(FIXTURES / f"{name}.txt"))


def count_nodes(rule, kind: str) -> int:
    if not isinstance(rule, dict):
        return 0
    total = 1 if rule.get("type") == kind else 0
    for child in rule.get("rules") or []:
        total += count_nodes(child, kind)
    return total


def metrics(name: str) -> dict:
    data = compile_fixture(name)
    simple = sum(count_nodes(rule, "simple") for rule in data["rules"].values())
    atomics = sum(count_nodes(rule, "atomic") for rule in data["rules"].values())
    size = len(json.dumps(data, separators=(",", ":")))
    board_cells = sum(len(row) for level in data["levels"] for row in level["board"])
    return {"simple": simple, "atomic": atomics, "bytes": size, "board": board_cells}


def check(label: str, before_name: str, after_name: str, expectations: dict) -> bool:
    before = metrics(before_name)
    after = metrics(after_name)
    ok = True
    print(f"{label}:")
    for key in ("simple", "atomic", "bytes", "board"):
        print(f"  {key:>6}: {before[key]:>6} -> {after[key]:>6}")
    for key, (expected_before, expected_after) in expectations.items():
        if before[key] != expected_before or after[key] != expected_after:
            print(
                f"  PINNED COUNT CHANGED: {key} expected "
                f"{expected_before} -> {expected_after}, got "
                f"{before[key]} -> {after[key]}"
            )
            ok = False
    return ok


def main() -> int:
    ok = True
    # The before machinery needs 240 compiled simple rules and a board that
    # carries a label column plus a scratch-register row; the capture
    # version needs 3 rules and a plain walled well.
    ok &= check(
        "tetris line-clear rewrite",
        "fixture-tetris-lineclear-before",
        "fixture-tetris-lineclear-after",
        {"simple": (240, 3), "atomic": (125, 2)},
    )
    # Four ghosts, one eastward move: 36 floor-product rules plus 4
    # register tests over twelve ghost characters become 16 capture rules
    # over four characters.
    ok &= check(
        "ghost-family rewrite",
        "fixture-ghost-family-before",
        "fixture-ghost-family-after",
        {"simple": (40, 16)},
    )
    if ok:
        print("rewrites acceptance: counts pinned and holding")
        return 0
    return 1


if __name__ == "__main__":
    raise SystemExit(main())
