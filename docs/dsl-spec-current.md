# Current DSL Spec (Descriptive)

This document describes the DSL behavior as implemented today in:
- `make-data.py` (compiler/parser)
- `ua4k.js` (runtime)

It is descriptive, not aspirational. If behavior is surprising, this doc still records it as-is.

## 1. Lexical Conventions

- Input is read line-by-line.
- Lines whose first non-space characters are `;;` are comments and ignored.
- Blank lines are semantic delimiters:
  - Flush current level board.
  - Flush current `GOAL` block.
  - Flush current `VOID` block.
  - Flush an accumulated simple rule (`from`/`to` pattern pair list).
- Indentation controls scope for compound rule constructs (`CMD`, `ROTATE_CMDS`, `ATOMIC`, `MATCH1`, `TRY_ALL`, `RANDOM`, `FOR`, `ZIP`, `LET_REPEAT`, `ROTATE`, `CALL`).
  - The parser maintains an indentation/rule stack and closes entries when indentation decreases (or equals) to the current level.

## 2. Top-Level Directives

Supported directives are:
- `GOAL`
- `VOID`
- `BIND`
- `CMD`
- `ROTATE_CMDS`
- `TITLE`
- `DESCRIPTION`
- `MINMOVES`
- `BY`
- `TICK`
- `WHITESPACE`
- `CHARMAP`
- `COLOR`
- `HIDDEN_LINE_CHAR`
- `ATOMIC`
- `ATOMIC_VERTICAL`
- `ATOMIC_HORIZONTAL`
- `MATCH1`
- `TRY_ALL`
- `RANDOM`
- `REPEAT`
- `FOR`
- `ZIP`
- `LET_REPEAT`
- `ROTATE`
- `CALL`
- `CALL_EACH`

Directive behavior:
- `GOAL` starts accumulating goal pattern lines until the next blank line.
  - Before any level: appended to the game-wide goal set.
  - After a level: attached to the most recent level. A level with its own
    goals uses them *instead of* the game-wide goals.
- `VOID` starts accumulating forbidden pattern lines until the next blank line.
  - Same scoping as `GOAL`: level voids replace game-wide voids for that level.
- `BIND` is parsed as repeated `key command ["description"]` entries.
  - Description is optional and must be quoted when present.
  - Runtime input dispatch uses `command`; UI docs show `description` when provided.
- `CMD <name>` creates/extends command rule set `<name>` (stored as a `match1` list at runtime).
- `ROTATE_CMDS <base> [orbit ...]` creates/extends generated command families:
  - `<base>_e`, `<base>_s`, `<base>_w`, `<base>_n`
  - enclosed rules are expanded once per direction (east/south/west/north).
- `TITLE`, `DESCRIPTION`, `MINMOVES`, `BY`, `TICK` attach to the most recent level when one exists.
  - `TITLE`, `DESCRIPTION`, `BY` before any level become game-level metadata
    (`gameTitle`, `gameDescription`, `gameAuthor`), used by the site index and
    standalone pages.
  - `TICK` before any level sets global tick interval.
  - `MINMOVES <n>` stores a solver-backed minimum-move count for the level and is displayed in the UI.
- `WHITESPACE` appends characters rendered as non-breaking spaces in the browser.
- `CHARMAP` maps display characters.
- `COLOR` maps display colors by source character.
- `HIDDEN_LINE_CHAR` marks characters that hide a rendered row.

## 3. Rule Forms and Control Nodes

## 3.1 Simple rules

A simple rule is built from one or more pattern lines:
- `fromPattern [toPattern] [sideEffect1 sideEffect2 ...]`

If `toPattern` is omitted, `toPattern = fromPattern`.
Multiple consecutive pattern lines (until a blank line) become one multi-row simple rule.

Runtime shape:
- `{"type":"simple","from":[...],"to":[...],"side_effects":[...],"method":"firstmatch|lastmatch|random"}`

## 3.2 Method annotation

Any extra token in brackets is parsed as a method annotation:
- `[firstmatch]` (default)
- `[lastmatch]`
- `[random]`
- `[norotate]` (compile-time flag; valid only inside `ROTATE`/`ROTATE_CMDS`)

Unbracketed extra tokens are parsed as side effects.

## 3.3 `CALL`

- `CALL <name>` emits `{"type":"call","name":"<name>"}`.
- At runtime, this applies `rules_dict[name]`.

## 3.4 `CALL_EACH`

- `CALL_EACH <name1> <name2> ...` is compile-time sugar for multiple `CALL` nodes.
- It emits the same ordered call sequence as writing each `CALL` on separate lines.
- At least one command name is required.

## 3.5 Compound control nodes

Supported:
- `MATCH1`
- `TRY_ALL`
- `RANDOM`
- `REPEAT`
- `ATOMIC`
- `ATOMIC_VERTICAL`
- `ATOMIC_HORIZONTAL`
- `ROTATE`

All wrap a nested `rules` list. Runtime behavior:
- `match1`: try children in order, stop on first success.
- `try_all`: apply every child (returns true).
- `random`: choose one child uniformly and apply it.
- `repeat`: like `match1`, repeatedly. Try the children in order; when one
  succeeds, start over from the first child. Stop when no child succeeds,
  or the successful child made no progress (guards against non-terminating
  loops of test rules). A `REPEAT` always succeeds, even with zero
  completed iterations. For an all-or-nothing *sequence* per iteration,
  nest a single `ATOMIC` inside the `REPEAT`. This is the primitive form
  of the older recursion idiom `MATCH1(ATOMIC(...body, CALL self), ?)`,
  and runs iteratively, so it does not grow the call stack with the board.
- `atomic`: all-or-nothing; rollback board on first child failure.
- `atomic` with condition `vertical`/`horizontal`: same rollback behavior plus monotone cursor progression (`min_row`/`min_col`) across child applications.

## 3.6 Compile-time expansion forms

`FOR`:
- Syntax: `FOR <wildcards> <values> [<wildcards> <values> ...]`
- Each wildcard character maps to a value set; expansion is cartesian product.
- Nested rules are deep-copied and wildcard-substituted per assignment.

`ZIP`:
- Syntax: `ZIP <wildcard> <values> [<wildcard> <values> ...]`
- Positional substitution: nth chars are paired together.
- All value strings are expected to have equal length.

`LET_REPEAT`:
- Syntax: `LET_REPEAT <initial> <final> <step> <wildcard> <seed> [<wildcard> <seed> ...]`
- For each integer `i` in `range(initial, final, step)`, each wildcard is replaced with `seed * i`.
- Expanded nested rules are deep-copied per iteration.

`ROTATE`:
- Syntax: `ROTATE [orbit1 orbit2 ...]` inside a rule block.
- Emits four rotated copies of enclosed subtree children in fixed order: east, south, west, north.
- Orbit tokens must each be length 4 or 2:
  - length 4: east/south/west/north character cycle.
  - length 2: alternating pair (toggles each quarter turn), e.g. `'/\\'`.
- Applies to simple-rule patterns (`from`/`to`) only.
- Rewrites command references and side-effect names ending in `_e` to directional step suffixes (`_e/_s/_w/_n`).
- Names not ending in `_e` are unchanged.

`ROTATE_CMDS`:
- Syntax: `ROTATE_CMDS <base_name> [orbit1 orbit2 ...]` at top-level.
- Creates command families `<base_name>_e`, `<base_name>_s`, `<base_name>_w`, `<base_name>_n`.
- Pattern rotation/orbit substitution is the same as `ROTATE`.
- Rewrites command references and side-effect names that end with `_e` to the step suffix (`_e/_s/_w/_n`).
- Names that do not end with `_e` are left unchanged.

Rotation geometry (`M x N` patterns):
- Step 0/east: identity.
- Step 1/south: transpose + reverse each row.
- Step 2/west: reverse row order + reverse each row.
- Step 3/north: transpose + reverse row order.

`[norotate]` behavior:
- Skips geometric rotation for that simple rule.
- Orbit substitution still applies.
- Using `[norotate]` outside `ROTATE`/`ROTATE_CMDS` is a parse error.

## 4. Side Effects and Mandatory Side Effects

Simple rules may include side effects as command names.

Runtime behavior in `applyRuleAt`:
- After applying the main pattern rewrite, side effects execute in order.
- If side effect token ends with `!`:
  - Remove `!`, apply referenced command.
  - If that command fails, rollback the board to pre-rule state and fail the parent rule.
- Side effects without `!` are attempted but do not rollback the parent on failure.

## 5. Pattern Matching Semantics

- `?` in `from` matches any cell.
- `?` in `to` preserves existing cell (no write at that location).
- Matching methods:
  - `firstmatch`: top-left scan.
  - `lastmatch`: bottom-right scan.
  - `random`: choose uniformly from all matches.

Inactive behavior:
- There is code for digit-based wildcard matching/substitution in `ua4k.js`, but it is disabled behind `if (false && ...)` checks and is not active.

## 6. Output Data Contract

Compiler emits one entry per game into `gamesData.js`:
- `levels`
- `rules`
- `binds`
- `goals`
- `voids`
- `whitespaceChars`
- `charMap`
- `colorMap`
- `hiddenLineChars`
- `globalTick`
- `gameTitle`, `gameDescription`, `gameAuthor` (game-level metadata; `null` when absent)

Levels may additionally carry `goals`/`voids` lists (per-level overrides).

`make-data.py` is accumulative:
- Reads existing `gamesData.js` when possible.
- Replaces/sets one key for the current input file stem.
- Writes full `let gamesData = ...;` file.

## 7. Known Quirks Preserved

- Blank lines are overloaded as flush boundaries for multiple parser states.
- `MINMOVES` attaches only when a level already exists.
- `CMD <name>` merges rules across repeated declarations of the same command.
- `gamesData.js` read failures print a warning to stderr and start from `{}`.
- The parser is indentation-sensitive, with stack unwinding on equal-or-lower indentation.

## 8. Coverage Status (Snapshots/Fixtures)

Covered by default snapshot set:
- Representative games: `game`, `crash-landing`, `dockstep`, `tetris`, `ice-slides`
- Tiny fixtures:
  - `fixture-indent` (indent-sensitive nesting)
  - `fixture-for` (`FOR` expansion)
  - `fixture-zip-let-repeat` (`ZIP` + `LET_REPEAT`)
  - `fixture-mandatory-side-effects` (mandatory side-effect token `!`)
  - `fixture-call-each` (`CALL_EACH` call-list sugar)
  - `fixture-rotate` (`ROTATE`, `ROTATE_CMDS`, suffix rewrite, `[norotate]`)

Present in parser/runtime but not yet isolated by tiny fixtures:
- Complex interactions of `ATOMIC_VERTICAL`/`ATOMIC_HORIZONTAL` under deep nesting.
- Some large-scale `LET_REPEAT` edge cases used in full game files.
