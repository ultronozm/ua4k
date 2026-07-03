#!/usr/bin/env python3
"""Golden snapshot harness for the game DSL compiler.

Usage:
  python3 golden_snapshots.py refresh [game files...]
  python3 golden_snapshots.py check [game files...]

If no game files are given, the set is derived from tests/snapshots/*.json:
every existing snapshot is checked, so snapshots cannot silently fall out of
coverage. `refresh <new-game.txt>` adds a snapshot to the default set.
"""

from __future__ import annotations

import argparse
import difflib
import json
import sys
from pathlib import Path

import compiler_common


ROOT = Path(__file__).resolve().parent
SNAPSHOT_DIR = ROOT / "tests" / "snapshots"


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Refresh/check per-game compiler snapshots.")
    parser.add_argument("command", choices=("refresh", "check"))
    parser.add_argument("games", nargs="*", help="Game text files, e.g. game.txt")
    return parser.parse_args()


def default_game_files() -> list[Path]:
    """One entry per existing snapshot: fixtures by path, games by stem."""
    files = []
    for snapshot in sorted(SNAPSHOT_DIR.glob("*.json")):
        fixture = ROOT / "tests" / "fixtures" / f"{snapshot.stem}.txt"
        if fixture.is_file():
            files.append(fixture)
        else:
            files.append(compiler_common.resolve_game_file(snapshot.stem))
    return files


def resolve_game_files(games: list[str]) -> list[Path]:
    if not games:
        return default_game_files()
    files = [ROOT / name for name in games]
    missing = [str(path.relative_to(ROOT)) for path in files if not path.is_file()]
    if missing:
        raise FileNotFoundError("Missing game files: " + ", ".join(missing))
    return files


def compile_games(game_files: list[Path]) -> dict[str, dict]:
    module = compiler_common.load_make_data_module()
    compiled: dict[str, dict] = {}
    for game_file in game_files:
        compiled[game_file.stem] = module.compile_game(str(game_file))
    return compiled


def snapshot_path(game_name: str) -> Path:
    return SNAPSHOT_DIR / f"{game_name}.json"


def dump_json(data: dict) -> str:
    return json.dumps(data, indent=2, sort_keys=True, ensure_ascii=True) + "\n"


def refresh(compiled: dict[str, dict]) -> int:
    SNAPSHOT_DIR.mkdir(parents=True, exist_ok=True)
    for game_name, data in compiled.items():
        snapshot_path(game_name).write_text(dump_json(data), encoding="utf-8")
        print(f"updated snapshot: {game_name}")
    return 0


def read_snapshot(game_name: str) -> dict:
    path = snapshot_path(game_name)
    if not path.is_file():
        raise FileNotFoundError(f"Missing snapshot: {path.relative_to(ROOT)}")
    return json.loads(path.read_text(encoding="utf-8"))


def format_diff(game_name: str, expected: dict, actual: dict) -> str:
    expected_lines = dump_json(expected).splitlines(keepends=True)
    actual_lines = dump_json(actual).splitlines(keepends=True)
    diff = difflib.unified_diff(
        expected_lines,
        actual_lines,
        fromfile=f"tests/snapshots/{game_name}.json",
        tofile=f"current/{game_name}.json",
    )
    return "".join(diff)


def check(compiled: dict[str, dict]) -> int:
    failures = 0
    for game_name, actual in compiled.items():
        expected = read_snapshot(game_name)
        if expected != actual:
            failures += 1
            print(f"snapshot mismatch: {game_name}")
            print(format_diff(game_name, expected, actual))
        else:
            print(f"ok: {game_name}")
    return 1 if failures else 0


def main() -> int:
    args = parse_args()
    game_files = resolve_game_files(args.games)
    compiled = compile_games(game_files)
    if args.command == "refresh":
        return refresh(compiled)
    return check(compiled)


if __name__ == "__main__":
    try:
        raise SystemExit(main())
    except Exception as exc:  # concise top-level reporting
        print(f"error: {exc}", file=sys.stderr)
        raise SystemExit(2)
