#!/usr/bin/env python3
from __future__ import annotations

import argparse
import sys

from asset_builders import build_emacs_assets
from compiler_common import load_make_data_module, repo_root, resolve_game_file


def main(argv: list[str]) -> int:
    parser = argparse.ArgumentParser(
        description="Build Emacs-loadable compiled assets for UA4K games."
    )
    parser.add_argument(
        "game_files",
        nargs="+",
        help="Game source files or unique stems, for example dockstep",
    )
    parser.add_argument(
        "-o",
        "--output-dir",
        default="emacs-build",
        help="Output directory for generated Emacs assets",
    )
    args = parser.parse_args(argv[1:])

    root = repo_root()
    output_dir = (root / args.output_dir).resolve()
    module = load_make_data_module()
    for game_file in args.game_files:
        source_path = resolve_game_file(game_file)
        try:
            module.compile_game(str(source_path))
        except module.DSLParseError as exc:
            print(f"{game_file}:{exc.line_no}: error: {exc.message}", file=sys.stderr)
            return 2

    build_emacs_assets(args.game_files, output_dir)
    print(f"wrote Emacs assets to {output_dir}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main(sys.argv))
