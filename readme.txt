ULTRONO ARENA 4000 (ua4k)

Overview
- This repository contains a text-DSL-driven puzzle/game engine.
- Games are authored in `*.txt` files, compiled into `gamesData.js`, and run in `ua4k.html` + `ua4k.js`.

Main Files
- `make-data.py`: compiler for the DSL game files.
- `ua4k.js`: runtime engine (rule application, rendering, input, levels).
- `ua4k.html`: browser shell UI.
- `golden_snapshots.py`: per-game golden snapshot harness for compiler regression checks.

Compile Workflow
- Compile one game:
  - `python3 make-data.py game.txt`
- Compile multiple games:
  - `./compile.sh game.txt tetris.txt crash-landing.txt`

Notes
- `gamesData.js` is accumulative output.
- Each compiler run reads existing `gamesData.js`, updates one game key, and writes the full file.
- `gamesData.js` is intentionally untracked and ignored by git.
- Rust parser status is documented in `rust-parser-decision.md`.

Run in Browser
1. Compile one or more games so `gamesData.js` exists.
2. Open `ua4k.html` in a browser.
3. Use the dropdown to select any compiled game.
4. For engine debug logging, set `DEBUG_LOGS = true` in `ua4k.js`.

DSL Sketch (current behavior)
- Metadata/directives include: `GOAL`, `VOID`, `BIND`, `CMD`, `TITLE`, `DESCRIPTION`, `BY`, `TICK`, `WHITESPACE`, `CHARMAP`, `COLOR`, `HIDDEN_LINE_CHAR`.
- Compound rule constructs include: `ATOMIC`, `ATOMIC_VERTICAL`, `ATOMIC_HORIZONTAL`, `MATCH1`, `TRY_ALL`, `RANDOM`, `FOR`, `ZIP`, `LET_REPEAT`, `CALL`, `CALL_EACH`.
- Rules are indentation-sensitive for nesting.
- Blank lines are meaningful and terminate accumulated sections/rules.
- `?` in patterns acts as wildcard/preserve cell behavior.
- Side effects can be attached to rules; `name!` means mandatory side effect with rollback if it fails.

Golden Snapshot Checks
- Refresh baselines:
  - `python3 golden_snapshots.py refresh`
- Check current compiler output against baselines:
  - `python3 golden_snapshots.py check`
- Default coverage:
  - `game.txt`, `tetris.txt`, `crash-landing.txt`
  - tiny fixtures for indentation, FOR, ZIP/LET_REPEAT, mandatory side effects, and CALL_EACH

Parser Diagnostics Checks
- Run parser error regression checks against invalid fixtures:
  - `python3 parser_diagnostics.py`

Adding a New Game
1. Create `my-game.txt` in DSL format.
2. Compile it:
  - `python3 make-data.py my-game.txt`
3. Reload `ua4k.html` and select `my-game` from the dropdown.

Included New Game
- `drone-swarm.txt`: lockstep dual-drone puzzle where both drones move on each input and must be parked onto separate targets.
