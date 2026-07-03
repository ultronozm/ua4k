#!/usr/bin/env python3
from __future__ import annotations

import importlib.util
import sys
from pathlib import Path


def repo_root() -> Path:
    return Path(__file__).resolve().parent


def games_root() -> Path:
    return repo_root() / "games"


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


def resolve_game_file(filename: str) -> Path:
    """Resolve a game argument from a path or unique stem under games/."""
    root = repo_root()
    raw_path = Path(filename)

    direct_candidates = []
    if raw_path.is_absolute():
        direct_candidates.append(raw_path)
    else:
        direct_candidates.append(root / raw_path)
    if raw_path.suffix != ".txt":
        if raw_path.is_absolute():
            direct_candidates.append(raw_path.with_suffix(".txt"))
        else:
            direct_candidates.append(root / raw_path.with_suffix(".txt"))

    for candidate in direct_candidates:
        if candidate.is_file():
            return candidate.resolve()

    target_name = raw_path.name if raw_path.suffix == ".txt" else raw_path.name + ".txt"
    matches = sorted(games_root().rglob(target_name))
    if not matches:
        raise FileNotFoundError(f"game file not found: {filename}")
    if len(matches) > 1:
        choices = ", ".join(str(path.relative_to(root)) for path in matches)
        raise ValueError(f"ambiguous game name {filename!r}; use one of: {choices}")
    return matches[0].resolve()


def game_key_for_path(path: str | Path) -> str:
    return Path(path).stem


def discover_game_files() -> list[str]:
    return sorted(
        str(path.relative_to(repo_root()))
        for path in games_root().rglob("*.txt")
    )


def discover_buildable_game_files() -> tuple[list[str], list[tuple[str, str]], dict[str, dict]]:
    """Return (buildable relpaths, skipped (name, reason) pairs, compiled data).

    Each game is compiled exactly once; the compiled data is keyed by game
    name so builders can reuse it instead of recompiling.
    """
    module = load_make_data_module()
    buildable: list[str] = []
    skipped: list[tuple[str, str]] = []
    compiled: dict[str, dict] = {}
    for name in discover_game_files():
        try:
            data = module.compile_game(str(repo_root() / name))
        except Exception as exc:  # noqa: BLE001
            skipped.append((name, str(exc)))
            continue
        buildable.append(name)
        compiled[Path(name).stem] = data
    return buildable, skipped, compiled
