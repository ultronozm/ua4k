#!/usr/bin/env python3
from __future__ import annotations

import importlib.util
import json
import sys
from pathlib import Path


def load_make_data_module():
    module_path = Path(__file__).with_name("make-data.py")
    spec = importlib.util.spec_from_file_location("make_data", module_path)
    if spec is None or spec.loader is None:
        raise RuntimeError(f"unable to load compiler module from {module_path}")
    module = importlib.util.module_from_spec(spec)
    sys.modules[spec.name] = module
    spec.loader.exec_module(module)
    return module


def main(argv: list[str]) -> int:
    if len(argv) != 2:
        print("usage: python3 compile-game-json.py <game-file>", file=sys.stderr)
        return 2

    filename = argv[1]
    module = load_make_data_module()
    try:
        result = module.compile_game(filename)
    except module.DSLParseError as exc:
        print(f"{filename}:{exc.line_no}: error: {exc.message}", file=sys.stderr)
        return 2

    json.dump(result, sys.stdout, indent=2)
    sys.stdout.write("\n")
    return 0


if __name__ == "__main__":
    raise SystemExit(main(sys.argv))
