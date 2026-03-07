#!/usr/bin/env python3
from __future__ import annotations

import argparse
import sys

from asset_builders import build_web_assets
from compiler_common import load_make_data_module, repo_root


def main(argv: list[str]) -> int:
    parser = argparse.ArgumentParser(
        description="Build standalone browser pages for UA4K games."
    )
    parser.add_argument(
        "game_files",
        nargs="+",
        help="Game source files to compile, for example drone-swarm.txt",
    )
    parser.add_argument(
        "-o",
        "--output-dir",
        default="web-build",
        help="Output directory for generated standalone pages",
    )
    args = parser.parse_args(argv[1:])

    root = repo_root()
    output_dir = (root / args.output_dir).resolve()
    module = load_make_data_module()
    for game_file in args.game_files:
        source_path = (root / game_file).resolve()
        try:
            module.compile_game(str(source_path))
        except module.DSLParseError as exc:
            print(f"{game_file}:{exc.line_no}: error: {exc.message}", file=sys.stderr)
            return 2

    build_web_assets(args.game_files, output_dir)
    print(f"wrote standalone pages to {output_dir}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main(sys.argv))
