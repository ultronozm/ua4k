#!/usr/bin/env python3
from __future__ import annotations

import argparse
import sys
from pathlib import Path

from asset_builders import build_emacs_assets, build_web_assets, compile_games
from compiler_common import discover_buildable_game_files, repo_root


def write_manifest(output_dir: Path, game_files: list[str]) -> None:
    manifest = output_dir / "manifest.txt"
    manifest.write_text("".join(f"{Path(name).stem}\n" for name in game_files), encoding="utf-8")


def main(argv: list[str]) -> int:
    parser = argparse.ArgumentParser(
        description="Build both standalone browser pages and Emacs assets for UA4K games."
    )
    parser.add_argument(
        "game_files",
        nargs="*",
        help="Game source files or unique stems to build. Defaults to all games under games/.",
    )
    parser.add_argument(
        "-o",
        "--output-dir",
        default="dist",
        help="Root output directory. Browser assets go in web/, Emacs assets in emacs/.",
    )
    args = parser.parse_args(argv[1:])

    skipped: list[tuple[str, str]] = []
    if args.game_files:
        game_files = args.game_files
        compiled = compile_games(game_files)
    else:
        game_files, skipped, compiled = discover_buildable_game_files()
    root = repo_root()
    output_root = (root / args.output_dir).resolve()
    web_dir = output_root / "web"
    emacs_dir = output_root / "emacs"
    output_root.mkdir(parents=True, exist_ok=True)

    build_web_assets(game_files, web_dir, compiled=compiled)
    build_emacs_assets(game_files, emacs_dir, compiled=compiled)
    write_manifest(output_root, game_files)

    print(f"built {len(game_files)} games")
    print(f"  web:   {web_dir}")
    print(f"  emacs: {emacs_dir}")
    if skipped:
        print("skipped non-buildable sources:", file=sys.stderr)
        for name, reason in skipped:
            print(f"  {name}: {reason}", file=sys.stderr)
    return 0


if __name__ == "__main__":
    raise SystemExit(main(sys.argv))
