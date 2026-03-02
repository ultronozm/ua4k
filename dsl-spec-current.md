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
- Indentation controls scope for compound rule constructs (`CMD`, `ATOMIC`, `MATCH1`, `TRY_ALL`, `RANDOM`, `FOR`, `ZIP`, `LET_REPEAT`, `CALL`).
  - The parser maintains an indentation/rule stack and closes entries when indentation decreases (or equals) to the current level.

## 2. Top-Level Directives

Supported directives are:
- `GOAL`
- `VOID`
- `BIND`
- `CMD`
- `TITLE`
- `DESCRIPTION`
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
- `FOR`
- `ZIP`
- `LET_REPEAT`
- `CALL`

Directive behavior:
- `GOAL` starts accumulating goal pattern lines until the next blank line.
- `VOID` starts accumulating forbidden pattern lines until the next blank line.
- `BIND` is parsed as key-command pairs.
- `CMD <name>` creates/extends command rule set `<name>` (stored as a `match1` list at runtime).
- `TITLE`, `DESCRIPTION`, `BY`, `TICK` attach to the most recent level when one exists.
  - `TICK` before any level sets global tick interval.
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

Unbracketed extra tokens are parsed as side effects.

## 3.3 `CALL`

- `CALL <name>` emits `{"type":"call","name":"<name>"}`.
- At runtime, this applies `rules_dict[name]`.

## 3.4 Compound control nodes

Supported:
- `MATCH1`
- `TRY_ALL`
- `RANDOM`
- `ATOMIC`
- `ATOMIC_VERTICAL`
- `ATOMIC_HORIZONTAL`

All wrap a nested `rules` list. Runtime behavior:
- `match1`: try children in order, stop on first success.
- `try_all`: apply every child (returns true).
- `random`: choose one child uniformly and apply it.
- `atomic`: all-or-nothing; rollback board on first child failure.
- `atomic` with condition `vertical`/`horizontal`: same rollback behavior plus monotone cursor progression (`min_row`/`min_col`) across child applications.

## 3.5 Compile-time expansion forms

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

`make-data.py` is accumulative:
- Reads existing `gamesData.js` when possible.
- Replaces/sets one key for the current input file stem.
- Writes full `let gamesData = ...;` file.

## 7. Known Quirks Preserved

- Blank lines are overloaded as flush boundaries for multiple parser states.
- `TITLE`/`DESCRIPTION`/`BY`/`TICK` attach only when a level already exists (except global `TICK` before levels).
- `CMD <name>` merges rules across repeated declarations of the same command.
- `gamesData.js` read failures print `data read failed` and start from `{}`.
- The parser is indentation-sensitive, with stack unwinding on equal-or-lower indentation.

## 8. Coverage Status (Snapshots/Fixtures)

Covered by default snapshot set:
- Representative games: `game`, `tetris`, `crash-landing`
- Tiny fixtures:
  - `fixture-indent` (indent-sensitive nesting)
  - `fixture-for` (`FOR` expansion)
  - `fixture-zip-let-repeat` (`ZIP` + `LET_REPEAT`)
  - `fixture-mandatory-side-effects` (mandatory side-effect token `!`)

Present in parser/runtime but not yet isolated by tiny fixtures:
- Complex interactions of `ATOMIC_VERTICAL`/`ATOMIC_HORIZONTAL` under deep nesting.
- Some large-scale `LET_REPEAT` edge cases used in full game files.
