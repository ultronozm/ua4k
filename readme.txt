ULTRONO ARENA 4000 (ua4k)

Overview
- This repository contains a text-DSL-driven puzzle/game engine.
- Games are authored in `*.txt` files, compiled by `make-data.py`, and then consumed by either the browser runtime or the Emacs frontend.

Main Files
- `make-data.py`: compiler for the DSL game files.
- `compile-game-json.py`: one-shot compiler entrypoint that writes compiled JSON for a single game.
- `ua4k.js`: runtime engine (rule application, rendering, input, levels).
- `ua4k.html`: browser shell UI.
- `ua4k.el`: Emacs frontend for compiled non-tick games.
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

Direct Browser Launch For Testing
- Compile and open a specific game in one step:
  - `./play-level.sh drone-swarm`
- Compile and open a specific game + level:
  - `./play-level.sh drone-swarm 3`
- You can also pass the source file name directly:
  - `./play-level.sh drone-swarm.txt 3`
- `play-level.sh` writes a temporary `.ua4k-launch.html` wrapper that injects the startup game/level before loading the normal browser UI.
- The browser runtime accepts injected startup selection and also still accepts `#game=<name>&level=<n>` or `?game=<name>&level=<n>` for direct loading.
- Level numbers are currently zero-based, matching the in-game `l` prompt.

TUI Play/Test (uses existing `ua4k.js`)
- Play a game in terminal with optional key sequence and level index:
  - `node tui_play.js drone-swarm`
  - `node tui_play.js drone-swarm wzaaassddddsawaaawwdddw 3`
- Useful for quickly validating puzzle behavior without opening a browser.

Play In Emacs
- Start a compiled game from Emacs:
  - `M-x load-file RET /path/to/ua4k.el RET`
  - `M-x ua4k-play-game RET drone-swarm RET`
- Or open a specific source file directly:
  - `M-x ua4k-play-file RET /path/to/drone-swarm.txt RET`
- Or select a raw board region and play it as a one-level scratch board using an existing game's rules:
  - copy/paste the board into any buffer
  - mark the region
  - `M-x ua4k-play-region RET /path/to/drone-swarm.txt RET`
- Commands inside `ua4k-mode`:
  - movement keys come from the game's `BIND` directives
  - `u` undo
  - `U` restart level
  - `l` jump to level
  - `q` quit
- Current scope:
  - non-tick games are supported
  - this frontend consumes the same compiled rule IR as the browser, via `compile-game-json.py`
  - rendering uses the compiled `COLOR` and `CHARMAP` metadata inside Emacs

Puzzle Solver (shortest-path search)
- Solve a specific level with BFS:
  - `node solve_level.js drone-swarm 1`
  - `node solve_level.js drone-swarm 5`

DSL Sketch (current behavior)
- Metadata/directives include: `GOAL`, `VOID`, `BIND`, `CMD`, `TITLE`, `DESCRIPTION`, `MINMOVES`, `BY`, `TICK`, `WHITESPACE`, `CHARMAP`, `COLOR`, `HIDDEN_LINE_CHAR`.
- Compound rule constructs include: `ATOMIC`, `ATOMIC_VERTICAL`, `ATOMIC_HORIZONTAL`, `MATCH1`, `TRY_ALL`, `RANDOM`, `FOR`, `ZIP`, `LET_REPEAT`, `CALL`, `CALL_EACH`.
- Rules are indentation-sensitive for nesting.
- Blank lines are meaningful and terminate accumulated sections/rules.
- `?` in patterns acts as wildcard/preserve cell behavior.
- Side effects can be attached to rules; `name!` means mandatory side effect with rollback if it fails.
- `BIND` supports optional quoted labels: `BIND w walk_n "move north"`.

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
- `drone-swarm.txt`: lockstep dual-drone puzzle with 39 levels. Both drones move on every input, and `#` acts as a hard force field that blocks approach without serving as a bump-stall surface.
- `drone-gate-pass.txt`: first gate-pass prototype. A drone can cross `g` only while the other drone spends `k` on the same move; the gate stays on the board afterward.
- `drone-gate-strict.txt`: stricter gate prototype. Keys cannot be banked; stepping on `k` only matters on the exact move the other drone passes a gate.
- `drone-gate-seal.txt`: irreversible gate prototype. Passing `g` consumes the paired `k` and turns the gate into `x`, permanently changing the board.
- `signal-relay.txt`: single-agent relay-routing puzzle with 5 levels. Core order is `a -> b -> f -> c`; touching `c` overloads the board (`m -> x`); `h` is a late gate that only opens after `c`; and the whole puzzle is about planning one route that works both before and after overload.
- `ice-slides.txt`: momentum puzzle with 8 levels. Inputs slide until blocked; collecting `k` upgrades the skater (`1 -> 2`) so `g` gates can be breached (`2g -> -1`); and fragile ice (`*`) melts into water (`w`), turning earlier lines into fatal traps.
