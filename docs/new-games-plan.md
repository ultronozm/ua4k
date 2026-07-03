# Plan: 10 New Games for UA4K

> **Status (2026-07): historical.** This plan is kept for reference. Several of
> the proposed games shipped (ice-slides, dockstep, signal-relay), others were
> superseded by different designs (clockwise, lantern-trail, phase-shift). The
> runtime smoke idea landed as the solver-based `verify_minmoves.js` check
> rather than a Playwright harness, and `run_all_checks.py` became `make check`.

## Scope

Create 10 new DSL game files, each playable from `ua4k.html`, each with at least:
- one complete level,
- clear win/fail behavior (`GOAL` and/or `VOID`),
- control bindings (`BIND` + `CMD`),
- one deterministic smoke test sequence.

## Proposed 10 Games

1. `ice-slides.txt`  
Sliding-movement puzzle; player moves until blocked.

2. `magnet-crates.txt`  
Push/pull crates with magnet toggle.

3. `laser-mirrors-mini.txt`  
Mirror orientation puzzle with beam path goals.

4. `dockstep.txt`
One input moves multiple agents by rule priority.

5. `factory-lines.txt`  
Conveyor routing puzzle with timed ticks.

6. `bridge-builder.txt`  
Spend limited resources to place bridge tiles.

7. `orbital-escape.txt`  
Gravity-like pull zone and hazard avoidance.

8. `signal-relay.txt`  
Activate nodes in dependency order.

9. `vault-heist.txt`  
Keycard + switch + guard patrol timing puzzle.

10. `bio-lab-cleanup.txt`  
Contain spread mechanic using area-control actions.

## Delivery Sequence

1. Add a compact per-game design header in each `.txt` (`TITLE`, `DESCRIPTION`, controls, objective).
2. Build games in three waves:
   - Wave A (1-3): no timers/randomness.
   - Wave B (4-7): add `ATOMIC`, `FOR`, `ZIP`, `LET_REPEAT`.
   - Wave C (8-10): add `_tick`, side effects, multi-step level logic.
3. Commit each game separately to keep review diffs small.

## Test Strategy

## 1) Compiler correctness

Run:
- `python3 golden_snapshots.py refresh <new game files...>`
- `python3 golden_snapshots.py check`

Add one snapshot per new game to catch compiler regressions.

## 2) Parser failure safety

Keep:
- `python3 parser_diagnostics.py`

This guards existing diagnostics behavior while adding new DSL files.

## 3) Runtime smoke tests (new harness)

Add:
- `runtime_smoke.py` (Playwright-based browser runner)
- `runtime_cases.json` (per-game scripted key sequences)

Each case should verify:
- game loads from dropdown,
- key sequence executes without JS errors,
- board changes as expected at checkpoints,
- final state reaches level completion or expected fail-state banner.

## 4) CI-friendly local command

Add one command script:
- `python3 run_all_checks.py`

It should run, in order:
1. `python3 parser_diagnostics.py`
2. `python3 golden_snapshots.py check`
3. `python3 runtime_smoke.py`

## Quality Gate for Each New Game

Before merging each game:
1. Compiles cleanly.
2. Added to snapshot coverage.
3. Has one passing runtime smoke case.
4. Has a short player-facing description and clear controls.
