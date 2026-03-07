#!/usr/bin/env python3
from __future__ import annotations

import importlib.util
import sys
from pathlib import Path


def repo_root() -> Path:
    return Path(__file__).resolve().parent


def load_make_data_module():
    module_path = repo_root() / "make-data.py"
    spec = importlib.util.spec_from_file_location("make_data", module_path)
    if spec is None or spec.loader is None:
        raise RuntimeError(f"unable to load compiler module from {module_path}")
    module = importlib.util.module_from_spec(spec)
    sys.modules[spec.name] = module
    spec.loader.exec_module(module)
    return module


def compile_game_file(filename: str):
    module = load_make_data_module()
    return module, module.compile_game(filename)


def discover_game_files() -> list[str]:
    return sorted(
        path.name
        for path in repo_root().glob("*.txt")
        if not path.name.startswith("fixture-") and path.name != "readme.txt"
    )


def discover_buildable_game_files() -> tuple[list[str], list[tuple[str, str]]]:
    module = load_make_data_module()
    buildable: list[str] = []
    skipped: list[tuple[str, str]] = []
    for name in discover_game_files():
        try:
            module.compile_game(str(repo_root() / name))
        except Exception as exc:  # noqa: BLE001
            skipped.append((name, str(exc)))
            continue
        buildable.append(name)
    return buildable, skipped
