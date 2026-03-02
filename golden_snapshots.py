#!/usr/bin/env python3
"""Golden snapshot harness for the game DSL compiler.

Usage:
  python3 golden_snapshots.py refresh [game files...]
  python3 golden_snapshots.py check [game files...]

If no game files are given, defaults to: game.txt, tetris.txt, crash-landing.txt.
"""

from __future__ import annotations

import argparse
import difflib
import json
import shutil
import subprocess
import sys
import tempfile
from pathlib import Path


ROOT = Path(__file__).resolve().parent
SNAPSHOT_DIR = ROOT / "snapshots"
DEFAULT_GAMES = ("game.txt", "tetris.txt", "crash-landing.txt")
GAMES_PREFIX = "let gamesData = "


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Refresh/check per-game compiler snapshots.")
    parser.add_argument("command", choices=("refresh", "check"))
    parser.add_argument("games", nargs="*", help="Game text files, e.g. game.txt")
    return parser.parse_args()


def resolve_game_files(games: list[str]) -> list[Path]:
    names = games or list(DEFAULT_GAMES)
    files = [ROOT / name for name in names]
    missing = [str(path.relative_to(ROOT)) for path in files if not path.is_file()]
    if missing:
        raise FileNotFoundError("Missing game files: " + ", ".join(missing))
    return files


def read_games_data(path: Path) -> dict:
    text = path.read_text(encoding="utf-8")
    if not text.startswith(GAMES_PREFIX):
        raise ValueError(f"Unexpected gamesData.js format in {path}")
    payload = text[len(GAMES_PREFIX) :].strip()
    if payload.endswith(";"):
        payload = payload[:-1]
    return json.loads(payload)


def compile_games(game_files: list[Path]) -> dict[str, dict]:
    with tempfile.TemporaryDirectory() as tmp:
        tmp_dir = Path(tmp)
        shutil.copy2(ROOT / "make-data.py", tmp_dir / "make-data.py")
        for game_file in game_files:
            shutil.copy2(game_file, tmp_dir / game_file.name)

        for game_file in game_files:
            subprocess.run(
                ["python3", "make-data.py", game_file.name],
                cwd=tmp_dir,
                check=True,
                capture_output=True,
                text=True,
            )

        all_games = read_games_data(tmp_dir / "gamesData.js")
        compiled: dict[str, dict] = {}
        for game_file in game_files:
            game_name = game_file.stem
            if game_name not in all_games:
                raise KeyError(f"Compiler did not emit key: {game_name}")
            compiled[game_name] = all_games[game_name]
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
        fromfile=f"snapshots/{game_name}.json",
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
