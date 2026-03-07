#!/usr/bin/env python3
from __future__ import annotations

import argparse
import shutil
import sys
from pathlib import Path

from compiler_common import load_make_data_module, repo_root


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


def emit_asset(output_dir: Path, game_name: str, compiled: dict) -> None:
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


def main(argv: list[str]) -> int:
    parser = argparse.ArgumentParser(
        description="Build Emacs-loadable compiled assets for UA4K games."
    )
    parser.add_argument(
        "game_files",
        nargs="+",
        help="Game source files to compile, for example drone-swarm.txt",
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
    output_dir.mkdir(parents=True, exist_ok=True)

    shutil.copy2(root / "ua4k.el", output_dir / "ua4k.el")

    module = load_make_data_module()
    for game_file in args.game_files:
        source_path = (root / game_file).resolve()
        game_name = source_path.stem
        try:
            compiled = module.compile_game(str(source_path))
        except module.DSLParseError as exc:
            print(f"{game_file}:{exc.line_no}: error: {exc.message}", file=sys.stderr)
            return 2
        emit_asset(output_dir, game_name, compiled)

    print(f"wrote Emacs assets to {output_dir}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main(sys.argv))
