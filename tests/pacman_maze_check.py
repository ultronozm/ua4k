#!/usr/bin/env python3
"""Two-graph maze checker for the toys Pacman.

Graph 1 (Pacman): cells passable to Pacman (floor, pellets, actors); the
door `=` is a wall.  Checks rectangularity, wall symmetry, connectivity,
pellet reachability, and dead ends.

Graph 2 (ghosts): Pacman's graph plus the house interior and the directed
door-hop edge (interior cell below a door column -> the cell above the
door).  Checks that every corridor cell is reachable from each ghost
start, and that the door is never crossed downward.

Run: python3 tests/pacman_maze_check.py
"""

from __future__ import annotations

import sys
from collections import deque
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT))
import compiler_common

PASSABLE = set("-.OPRKICkjpqxzb")
GHOST_LABEL = {"R": "R", "k": "K", "j": "I", "p": "C"}


def load_board() -> list[str]:
    module = compiler_common.load_make_data_module()
    data = module.compile_game(str(ROOT / "games" / "clones" / "pacman.txt"))
    board = data["levels"][0]["board"]
    # Maze rows: everything before the first HUD row.
    maze = []
    for row in board:
        if row.startswith(("score:", "lives:", "status:", "%")):
            break
        maze.append(row)
    return maze


def neighbors(maze, r, c, wrap_rows):
    h, w = len(maze), len(maze[0])
    for dr, dc in ((0, 1), (0, -1), (1, 0), (-1, 0)):
        nr, nc = r + dr, c + dc
        if nc < 0 or nc >= w:
            if r in wrap_rows:
                yield r, nc % w
            continue
        if 0 <= nr < h:
            yield nr, nc


def flood(maze, starts, passable, extra_edges, wrap_rows):
    seen = set(starts)
    queue = deque(starts)
    while queue:
        r, c = queue.popleft()
        targets = list(neighbors(maze, r, c, wrap_rows)) + extra_edges.get((r, c), [])
        for nr, nc in targets:
            if (nr, nc) not in seen and maze[nr][nc] in passable:
                seen.add((nr, nc))
                queue.append((nr, nc))
    return seen


def main() -> int:
    maze = load_board()
    h = len(maze)
    w = len(maze[0])
    ok = True

    for i, row in enumerate(maze):
        if len(row) != w:
            print(f"FAIL row {i} width {len(row)} != {w}: {row!r}")
            ok = False
    if not ok:
        return 1

    for i, row in enumerate(maze):
        for j in range(w):
            if (row[j] == "#") != (row[w - 1 - j] == "#"):
                print(f"warn: asymmetric walls row {i} col {j}")

    wrap_rows = {i for i, row in enumerate(maze) if row[0] in PASSABLE and row[-1] in PASSABLE}
    door_cells = [(i, j) for i, row in enumerate(maze) for j, ch in enumerate(row) if ch == "="]
    hop_edges: dict[tuple[int, int], list[tuple[int, int]]] = {}
    for (dr, dc) in door_cells:
        below, above = (dr + 1, dc), (dr - 1, dc)
        hop_edges.setdefault(below, []).append(above)

    pac = [(i, j) for i, row in enumerate(maze) for j, ch in enumerate(row) if ch == "P"]
    ghosts = [(i, j) for i, row in enumerate(maze) for j, ch in enumerate(row)
              if ch in GHOST_LABEL]
    dots = [(i, j) for i, row in enumerate(maze) for j, ch in enumerate(row) if ch in ".O"]

    # --- Graph 1: Pacman -------------------------------------------------
    reach = flood(maze, pac, PASSABLE, {}, wrap_rows)
    missing = [d for d in dots if d not in reach]
    print(f"pacman graph: start {pac[0]}, reaches {len(reach)} cells, "
          f"{len(dots)} pellets/dots, {len(missing)} unreachable")
    if missing:
        print(f"FAIL unreachable pellets: {missing[:8]}")
        ok = False

    # House interior must NOT be Pacman-reachable (door is his wall).
    interior = {cell for below in hop_edges for cell in [below]}
    leaked = interior & reach
    if leaked:
        print(f"FAIL pacman can reach house interior: {sorted(leaked)}")
        ok = False

    # Dead ends in Pacman graph (outside house, tunnel ends excused by wrap).
    for i, row in enumerate(maze):
        for j, ch in enumerate(row):
            if ch not in PASSABLE or (i, j) not in reach:
                continue
            deg = sum(1 for nr, nc in neighbors(maze, i, j, wrap_rows)
                      if maze[nr][nc] in PASSABLE)
            if deg <= 1:
                print(f"FAIL dead end at {(i, j)} ({ch!r})")
                ok = False

    # --- Graph 2: ghosts -------------------------------------------------
    for g in ghosts:
        greach = flood(maze, [g], PASSABLE, hop_edges, wrap_rows)
        unreached = [cell for cell in reach if cell not in greach]
        label = GHOST_LABEL[maze[g[0]][g[1]]]
        print(f"ghost graph ({label} at {g}): reaches {len(greach)} cells, "
              f"{len(unreached)} corridor cells unreachable")
        if unreached:
            print(f"FAIL ghost {label} cannot reach: {unreached[:8]}")
            ok = False

    print("door cells:", door_cells, "| wrap rows:", sorted(wrap_rows))
    print("maze check:", "PASS" if ok else "FAIL")
    return 0 if ok else 1


if __name__ == "__main__":
    raise SystemExit(main())
