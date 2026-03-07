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
