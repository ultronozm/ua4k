# Designing Levels With the Solver

`docs/creating-games.md` teaches the DSL syntax. This document teaches the
*method*: how to design levels that are provably solvable, honestly rated,
and hard for the right reasons. It is the workflow that produced Clockwise's
seventeen levels, written down so the next game can start from it.

The core loop is:

```
sketch a board  ->  solve it  ->  replay the solution  ->  tighten  ->  repeat
```

with three tools:

- `node solve_level.js <game> <level> [max-depth] [max-states]` — BFS for the
  shortest solution, through the real runtime.
- `node replay_level.js <game> <level> <keys>` — step a key sequence and print
  every board state, so you can *see* what the solver found.
- `node verify_minmoves.js` — re-check every `MINMOVES` claim in the repo
  (also runs in `make check`, so stale pars fail the build).

## 1. Start from a forcing argument, not a layout

A level is interesting when the solution is *forced* by the geometry, not
merely permitted by it. Before drawing walls, write down one sentence of the
form "the player must X, because Y makes every alternative fail":

> The player can never body-block a lane they start behind, because both move
> one cell per turn and blocking requires arriving first — so the crate push
> is mandatory.

If you cannot state the forcing argument, the level is a corridor with
decorations. The argument also tells you exactly what to test: remove the
crate and the solver should report `no_solution`.

## 2. Let the solver find the truth

Hand-simulating rewrite rules is error-prone; the solver is ground truth.
After every board tweak:

```sh
node solve_level.js games/wip/mygame.txt 3 60 2000000
```

Three outcomes, all useful:

- **Solvable, plausible length** — replay it before celebrating (see below).
- **Solvable, suspiciously short** — you have a cheese. The solver is a
  ruthless playtester that finds the degenerate line on the first try.
- **`no_solution` / `state_limit`** — either the level is broken or your
  depth/state caps are too tight. Raise them before concluding anything.

The `explored` count is a rough difficulty signal: tight corridor puzzles
explore hundreds of states, open boards explore hundreds of thousands. A
huge count with a short solution usually means the space is wide but the
puzzle is shallow.

## 3. Replay every minimal solution

The single most valuable habit. The solver often wins in a way you did not
design, and the replay is where you find out:

```sh
node replay_level.js games/wip/mygame.txt 3 "adwdaa"
```

Two of Clockwise's best levels came from this step. *Convoy*'s intended
solution used a crate as a wall; the minimal line instead leashed the robot
around a corner while bulldozing the crate down the lane — better than the
design, so the emergent line became the level. The reverse also happens: the
replay shows the robot docking via a lane you forgot to seal, and the level
needs another wall.

Adopt the emergent solution when it is *more* interesting than your intent,
and kill it when it is less. Both require watching the replay.

## 4. Kill cheese by construction, then verify

Common degenerate lines and their structural fixes:

- **Waiting wins.** If the automaton reaches the goal unaided, walls are
  doing all the work. Add a hazard on the do-nothing path so the clock
  matters, or move the goal out of every natural orbit.
- **The goal is open from too many sides.** Pens that only admit a specific
  arrival direction turn "touch the goal" into "engineer an approach".
- **One block does everything.** If a single well-placed intervention wins,
  either accept it (fine for tutorials) or arrange the geometry so the
  intervention points are far apart under time pressure.

After each fix, re-solve. The test for "is the crate really necessary?" is
not your intuition — it is deleting the crate and getting `no_solution`.

## 5. Rate difficulty honestly

`MINMOVES` is a factual claim, and `make check` enforces it: the verifier
searches to exactly the claimed depth and fails if the claim is beatable or
unachievable. So never guess — read the number off `solve_level.js`.

Minimal length is not difficulty, though. A 35-move level where every move
is a forced wait is easier than a 6-move level with one exact standing spot.
Better proxies, in order:

1. how many *distinct techniques* the minimal line chains,
2. how precisely timed the interventions are (zero-slack vs. forgiving),
3. minimal length, last.

Order levels by technique dependency, not by par: introduce each mechanic in
isolation, then compose.

## 6. Keep boards small

Every cell you add multiplies the solver's state space and dilutes the
puzzle. If the forcing argument works on a 9x6 board, the 12x8 version is
strictly worse: slower to verify, easier to cheese, harder to read. Tight
walls are also what make BFS verification tractable — corridor levels verify
in milliseconds, open fields in minutes.

## 7. When randomness or ticks are involved

BFS assumes a deterministic, input-driven game, so `verify_minmoves.js`
skips games with `RANDOM` rules or tick timers. For those, do not publish
`MINMOVES` at all; scripted smoke sequences (`tui_play.js <game> <keys>`)
are the verification tool instead.
