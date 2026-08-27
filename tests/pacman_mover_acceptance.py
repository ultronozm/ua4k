#!/usr/bin/env python3
"""D19 before/after counts for a Pacman ghost-mover encoding."""

from __future__ import annotations

import json
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT))

import compiler_common


BEFORE = ROOT / "tests/fixtures/fixture-pacman-mover-before.txt"
AFTER = ROOT / "tests/fixtures/fixture-pacman-mover-after.txt"


def mover_lines(path: Path) -> int:
    inside = False
    count = 0
    for raw in path.read_text(encoding="utf-8").splitlines():
        stripped = raw.strip()
        if stripped == ";; BEGIN MOVER":
            inside = True
            continue
        if stripped == ";; END MOVER":
            break
        if inside and stripped and not stripped.startswith(";;"):
            count += 1
    return count


def node_counts(value) -> tuple[int, int]:
    simple = atomic = 0
    if isinstance(value, dict):
        simple += value.get("type") == "simple"
        atomic += value.get("type") == "atomic"
        for child in value.values():
            child_simple, child_atomic = node_counts(child)
            simple += child_simple
            atomic += child_atomic
    elif isinstance(value, list):
        for child in value:
            child_simple, child_atomic = node_counts(child)
            simple += child_simple
            atomic += child_atomic
    return simple, atomic


def main() -> int:
    module = compiler_common.load_make_data_module()
    before = module.compile_game(str(BEFORE))
    after = module.compile_game(str(AFTER))
    before_lines, after_lines = mover_lines(BEFORE), mover_lines(AFTER)
    before_simple, before_atomic = node_counts(before["rules"])
    after_simple, after_atomic = node_counts(after["rules"])
    before_bytes = len(json.dumps(before, separators=(",", ":"), ensure_ascii=False).encode())
    after_bytes = len(json.dumps(after, separators=(",", ":"), ensure_ascii=False).encode())

    assert (before_lines, after_lines) == (24, 18)
    assert (before_simple, after_simple) == (324, 36)
    assert (before_atomic, after_atomic) == (108, 12)
    assert after_bytes < before_bytes

    print(f"pacman mover source lines: {before_lines} -> {after_lines} (-{before_lines - after_lines}, {100 * (before_lines - after_lines) / before_lines:.1f}%)")
    print(f"compiled simple rules: {before_simple} -> {after_simple} (9.0x smaller)")
    print(f"compiled atomic nodes: {before_atomic} -> {after_atomic} (9.0x smaller)")
    print(f"compact JSON bytes: {before_bytes} -> {after_bytes} (-{100 * (before_bytes - after_bytes) / before_bytes:.1f}%)")
    print("four-ghost extrapolation: mover lines 96 -> 72; simple rules 1296 -> 144")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
