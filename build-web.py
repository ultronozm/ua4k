#!/usr/bin/env python3
from __future__ import annotations

import argparse
import html
import json
import shutil
import sys
from pathlib import Path
from compiler_common import load_make_data_module, repo_root


def standalone_html(game_name: str) -> str:
    title = html.escape(game_name)
    return f"""<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <title>{title} - ULTRONO ARENA 4000</title>
    <link rel="stylesheet" href="ua4k.css">
  </head>
  <body>
    <h1>{title}</h1>
    <div id="level"></div>
    <div id="moves"></div>
    <div id="description"></div>
    <div id="status"></div>
    <div id="display"></div>
    <div id="title"></div>
    <div id="author"></div>
    <p>u: undo. U: restart level.</p>
    <div id="docs"></div>
    <div id="goals"></div>
    <div id="voids"></div>

    <div id="touchControls">
      <button class="controlBtn" data-key="w">↑</button>
      <button class="controlBtn" data-key="s">↓</button>
      <button class="controlBtn" data-key="a">←</button>
      <button class="controlBtn" data-key="d">→</button>
      <button class="controlBtn" data-key="z">Z</button>
      <button class="controlBtn" data-key="u">Undo</button>
      <button class="controlBtn" data-key="U">Restart</button>
    </div>

    <script src="ua4k.js"></script>
    <script src="{game_name}.data.js"></script>
    <script>
      window.UA4K.startStandalone(window.UA4K_GAME_DATA, {{ gameName: {json.dumps(game_name)} }});
    </script>
  </body>
</html>
"""


def emit_game(output_dir: Path, game_name: str, compiled: dict) -> None:
    data_path = output_dir / f"{game_name}.data.js"
    html_path = output_dir / f"{game_name}.html"
    data_path.write_text(
        "window.UA4K_GAME_DATA = " + json.dumps(compiled, indent=2) + ";\n",
        encoding="utf-8",
    )
    html_path.write_text(standalone_html(game_name), encoding="utf-8")


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
    output_dir.mkdir(parents=True, exist_ok=True)

    module = load_make_data_module()
    for asset_name in ("ua4k.js", "ua4k.css", "kitten.jpg"):
        shutil.copy2(root / asset_name, output_dir / asset_name)

    for game_file in args.game_files:
        source_path = (root / game_file).resolve()
        game_name = source_path.stem
        try:
            compiled = module.compile_game(str(source_path))
        except module.DSLParseError as exc:
            print(f"{game_file}:{exc.line_no}: error: {exc.message}", file=sys.stderr)
            return 2
        emit_game(output_dir, game_name, compiled)

    print(f"wrote standalone pages to {output_dir}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main(sys.argv))
