# Current DSL Spec (Descriptive)

This document describes the DSL behavior as implemented today in:
- `make-data.py` (compiler/parser)
- `ua4k.js` (browser runtime)
- `emacs/ua4k.el` (Emacs runtime; a second normative rule interpreter, not a viewer)

It is descriptive, not aspirational. If behavior is surprising, this doc still records it as-is.

## 1. Lexical Conventions

- Input is read line-by-line.
- Lines whose first non-space characters are `;;` are comments and ignored.
- Blank lines are semantic delimiters:
  - Flush current level board.
  - Flush current `GOAL` block.
  - Flush current `VOID` block.
  - Flush an accumulated simple rule (`from`/`to` pattern pair list).
- Indentation controls scope for compound rule constructs (`CMD`, `ROTATE_CMDS`, `ATOMIC`, `MATCH1`, `TRY_ALL`, `RANDOM`, `FOR`, `ZIP`, `LET_REPEAT`, `ROTATE`, `FLIP_HORIZONTAL`, `FLIP_VERTICAL`, `CALL`).
- Adjacent pattern lines form the rows of one simple rule. A blank line must
  terminate those rows before any directive (including `CALL` or a sibling
  control block); otherwise the parser reports an error instead of allowing
  the unfinished pattern to attach to a later sibling.
  - The parser maintains an indentation/rule stack and closes entries when indentation decreases (or equals) to the current level.

## 2. Top-Level Directives

Supported directives are:
- `GOAL`
- `VOID`
- `WILDCARD`
- `CLASS`
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
- `FLIP_HORIZONTAL`
- `FLIP_VERTICAL`
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
- `WILDCARD <char>` names the game's wildcard character (default `?`).
  - Optional; at most one declaration, placed before the first
    pattern-bearing construct (rule, board, `GOAL`, or `VOID`). Metadata,
    `BIND`, `CLASS`, and display directives may precede it.
  - The argument is exactly one non-whitespace character. Duplicate, late,
    or multi-character declarations are parse errors.
  - The effective wildcard plays `?`'s two roles in rule, `GOAL`, and `VOID`
    patterns: match-any in `from`, preserve-cell in `to`. With `WILDCARD *`,
    a `?` in a pattern is an ordinary literal, and `?` becomes a legal,
    matchable board character.
  - Any `ROTATE`/`ROTATE_CMDS` orbit containing the effective wildcard is a
    parse error (in either direction, orbit substitution would silently
    convert between wildcard syntax and literals). This applies to the
    default `?` as well.
  - Compiled output carries `wildcardChar` only when the directive is
    present, so games without it compile byte-identically to before.
  - Both runtimes honor it: pattern matching, destination preservation,
    anchor search, and scratch-alphabet collection in the browser
    (level-board cells are always collected as literals; unmasked wildcard
    occurrences in patterns are syntax and omitted), and pattern
    normalization/matching/writes/anchoring in the Emacs player, including
    `ua4k-play-region` forwarding.
- `CLASS <name> [NOT] <chars...>` declares a named character set for capture
  domains.
  - Names match `[a-z_]{2,}`; duplicates are parse errors. Character
    arguments use the BIND quoting convention, so quoted tokens may contain
    spaces.
  - `NOT` marks the class as a match-time complement: a cell is in the class
    when it is *not* one of the listed characters, including characters that
    appear nowhere else in the game.
- `ATOMIC <var> <domain> [<var> <domain> ...]` declares capture variables
  scoped to that block (plain `ATOMIC` is unchanged; `ATOMIC_VERTICAL` /
  `ATOMIC_HORIZONTAL` do not accept arguments).
  - A variable is one character; the effective wildcard is not a legal name.
    A domain token matching `[a-z_]{2,}` is always a declared-before-use
    class reference; any other token is a raw character set.
  - Inside the block (lexically, including nested control nodes, but never
    through `CALL` or side effects), occurrences of a declared character in
    patterns are variables: the first source occurrence binds the matched
    cell after a domain check, later source occurrences must equal the bound
    value, and destination occurrences write it — unconditionally, even when
    the bound value equals the wildcard character.
  - Binding is greedy and non-backtracking: the first candidate the rule's
    method selects is committed; if a later child fails under that binding
    the whole atomic fails and the board and bindings roll back. Bindings
    commit only when a complete simple rule, including mandatory side
    effects, succeeds; every failed nested evaluation (a `MATCH1` branch, a
    `TRY_ALL` or `RANDOM` child, a nested `ATOMIC`, a `REPEAT` iteration)
    restores the environment it entered with. `[random]`/`[lastmatch]` select a candidate together with
    its bindings.
  - Bindings persist across `REPEAT` iterations when the declaring `ATOMIC`
    encloses the `REPEAT` (later iterations become equality tests); nest the
    `ATOMIC` inside the `REPEAT` for a fresh binding per iteration. A
    successful child that only changes bindings is not `REPEAT` progress.
  - A destination occurrence with no lexically preceding source occurrence
    anywhere in the block is a parse error; a path-dependently unbound
    destination fails the rule at runtime without touching the board.
  - Nested parameterized atomics may declare further variables; redeclaring
    an enclosing one is a parse error, and locals vanish when their block
    exits. FOR/ZIP wildcards may not collide with capture variables in
    either nesting direction, and no applicable orbit may contain one.
    Compile-time expansion (FOR/ZIP values) may lawfully produce a literal
    equal to a variable character at an unmasked position; masks, not
    characters, decide what is a variable, and masks move positionally under
    `ROTATE`/`FLIP`.
  - Compiled output: the atomic carries `variables` (per character:
    resolved `domain` string and `negated` flag); simple rules carry sparse
    `fromVariables`/`toVariables` row-major offset arrays, omitted when
    empty. Unparameterized games emit none of these keys and compile
    byte-identically to before.
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
- `FLIP_HORIZONTAL`
- `FLIP_VERTICAL`

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
- Syntax: `LET_REPEAT <initial> <final> <step> [<wildcard> <seed> ...]`
- For each integer `i` in `range(initial, final, step)`, each wildcard is replaced with `seed * i`.
- With no wildcard/seed pairs, it simply emits the nested rules once per iteration.
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

`FLIP_HORIZONTAL` and `FLIP_VERTICAL`:
- Syntax: `FLIP_HORIZONTAL` or `FLIP_VERTICAL` inside a rule block.
- Emit the original enclosed subtree children, followed by reflected copies.
- `FLIP_HORIZONTAL` reverses every pattern row, exchanging left and right.
- `FLIP_VERTICAL` reverses pattern-row order, exchanging top and bottom.
- Both transforms apply identically to the `from` and `to` sides of simple
  rules. Command calls and side-effect names are unchanged.
- Nested flips expand in lexical order and can generate all four reflections.

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

- The effective wildcard (default `?`; see `WILDCARD`) in `from` matches any cell.
- The effective wildcard in `to` preserves the existing cell (no write at that location).
- Capture-masked cells are never interpreted as the wildcard: a resolved
  destination writes its bound value unconditionally, even when that value
  equals the wildcard character.
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
- `wildcardChar` (only when a `WILDCARD` directive is present)
- `gameTitle`, `gameDescription`, `gameAuthor` (game-level metadata; `null` when absent)

Levels may additionally carry `goals`/`voids` lists (per-level overrides).

Parameterized atomics carry `variables` (per declared character: resolved
`domain` string and `negated` flag); simple rules containing capture cells
carry sparse `fromVariables`/`toVariables` row-major offset arrays. All of
these keys are omitted when absent, so games using none of the new
directives compile byte-identically to earlier output.

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
