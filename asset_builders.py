#!/usr/bin/env python3
from __future__ import annotations

import html
import json
import shutil
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


def emit_web_game(output_dir: Path, game_name: str, compiled: dict) -> None:
    data_path = output_dir / f"{game_name}.data.js"
    html_path = output_dir / f"{game_name}.html"
    data_path.write_text(
        "window.UA4K_GAME_DATA = " + json.dumps(compiled, indent=2) + ";\n",
        encoding="utf-8",
    )
    html_path.write_text(standalone_html(game_name), encoding="utf-8")


def build_web_assets(game_files: list[str], output_dir: Path) -> None:
    root = repo_root()
    output_dir.mkdir(parents=True, exist_ok=True)

    shutil.copy2(root / "ua4k.js", output_dir / "ua4k.js")
    shutil.copy2(root / "ua4k.css", output_dir / "ua4k.css")
    shutil.copy2(root / "kitten.jpg", output_dir / "kitten.jpg")

    module = load_make_data_module()
    for game_file in game_files:
        source_path = (root / game_file).resolve()
        compiled = module.compile_game(str(source_path))
        emit_web_game(output_dir, source_path.stem, compiled)


def to_elisp(value) -> str:
    if value is None:
        return "nil"
    if value is True:
        return "t"
    if value is False:
        return "nil"
    if isinstance(value, str):
        escaped = (
            value.replace("\\", "\\\\")
            .replace('"', '\\"')
            .replace("\n", "\\n")
            .replace("\t", "\\t")
            .replace("\r", "\\r")
        )
        return f'"{escaped}"'
    if isinstance(value, (int, float)):
        return repr(value)
    if isinstance(value, list):
        return "(" + " ".join(to_elisp(item) for item in value) + ")"
    if isinstance(value, dict):
        pairs = [f"({to_elisp(key)} . {to_elisp(val)})" for key, val in value.items()]
        return "(" + " ".join(pairs) + ")"
    raise TypeError(f"unsupported value for elisp emission: {type(value)!r}")


def asset_variable_name(game_name: str) -> str:
    safe_name = game_name.replace("-", "_")
    return f"ua4k_data_{safe_name}"


def emit_emacs_asset(output_dir: Path, game_name: str, compiled: dict) -> None:
    variable_name = asset_variable_name(game_name)
    provide_name = variable_name.replace("_", "-")
    asset_path = output_dir / f"{provide_name}.el"
    asset_path.write_text(
        f""";;; {provide_name}.el --- compiled UA4K data -*- lexical-binding: t; -*-

(defconst {variable_name}
  '{to_elisp(compiled)}
  "Compiled UA4K data for {game_name}.")

(provide '{provide_name})

;;; {provide_name}.el ends here
""",
        encoding="utf-8",
    )


def build_emacs_assets(game_files: list[str], output_dir: Path) -> None:
    root = repo_root()
    output_dir.mkdir(parents=True, exist_ok=True)

    shutil.copy2(root / "ua4k.el", output_dir / "ua4k.el")

    module = load_make_data_module()
    for game_file in game_files:
        source_path = (root / game_file).resolve()
        compiled = module.compile_game(str(source_path))
        emit_emacs_asset(output_dir, source_path.stem, compiled)
