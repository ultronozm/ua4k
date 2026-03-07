#!/usr/bin/env python3
from __future__ import annotations

import json
import sys
from compiler_common import load_make_data_module


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
