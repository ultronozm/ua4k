# DSL Evolution: `ROTATE` and `ROTATE_CMDS`

## Motivation

Most games duplicate their core logic 4 times for N/S/E/W directions. The duplication is error-prone and obscures the actual game logic. `ROTATE` and `ROTATE_CMDS` are compile-time expansion constructs (like `FOR`/`ZIP`) that generate rotated copies of rule sub-trees, handling both geometric pattern transformation and character substitution.

## Core convention

These constructs are fundamentally about **cardinal-direction rotation**. They always produce 4 steps: east (0°), south (90° CW), west (180°), north (270° CW). The base orientation is **east** (horizontal, left-to-right).

Two independent mechanisms apply at each rotation step:

1. **Geometric rotation** of simple-rule pattern grids (always, unless `[norotate]`).
2. **Character substitution** via explicitly listed orbits (e.g., `>v<^`, `/\`). Only the orbits you list are substituted. The characters `e`, `s`, `w`, `n` are not special in patterns — they are only special in **command name suffixes** (see `ROTATE_CMDS`).

`ROTATE_CMDS <base_name>` generates commands `<base_name>_e`, `<base_name>_s`, `<base_name>_w`, `<base_name>_n`. Any `CALL`/`CALL_EACH` or side-effect reference within the block whose name ends in `_e` has that suffix permuted to `_s`, `_w`, `_n` in the corresponding rotation steps. This is a suffix-level operation on command names, not a general character substitution.

## New constructs

### `ROTATE [<orbit1> <orbit2> ...]`

Compile-time expansion within a rule block. Wraps an arbitrary sub-tree of rules.

- Always produces 4 rotation steps (east, south, west, north).
- Explicit orbits are optional. Each must be exactly 4 characters long.
- For each rotation step i (0 to 3), the entire sub-tree is deep-copied, and:
  1. **Character substitution**: for each explicit orbit, the character at position j is replaced by the character at position (j+i) % 4 in all patterns, side-effect names, and `CALL`/`CALL_EACH` command name strings.
  2. **Geometric rotation**: every simple-rule pattern (from and to grids) is rotated by i*90 degrees clockwise.

### `ROTATE_CMDS <base_name> [<orbit1> <orbit2> ...]`

Top-level construct that declares 4 commands named `<base_name>_e`, `<base_name>_s`, `<base_name>_w`, `<base_name>_n` and populates each with a successive rotation of the enclosed rules.

- Takes a single base name. The four command names are generated automatically by appending `_e`, `_s`, `_w`, `_n`.
- Explicit orbits follow the same rules as `ROTATE`.
- **Command name suffix permutation**: any `CALL`, `CALL_EACH`, or side-effect reference within the block whose name ends in `_e` has that suffix replaced with `_s`, `_w`, `_n` in the corresponding rotation steps. References that don't end in `_e` are unchanged (fine for direction-independent helpers like `unlock`).
- Explicit orbit character substitution also applies (to patterns, side-effect names, and command name strings), same as `ROTATE`.

### `[norotate]` annotation

Bracket annotation on a simple-rule pattern line, same syntax as `[firstmatch]`/`[lastmatch]`/`[random]`.

- When present on any line of a multi-line simple rule, that rule receives **character substitution only** — its pattern geometry is not rotated.
- This is needed when a pattern interacts with a fixed-layout element (e.g., a status bar row) where the grid position is constant across directions.

## Rotation geometry

Given an M-row by N-column pattern grid:

| Step | Transformation | Result dimensions |
|------|----------------|-------------------|
| 0 (east) | Identity | M x N |
| 1 (south) | Transpose, then reverse each row | N x M |
| 2 (west) | Reverse row order, then reverse each row | M x N |
| 3 (north) | Transpose, then reverse row order | N x M |

Character substitution is applied after geometric transformation.

Both the `from` and `to` patterns of a simple rule are rotated identically.

## Interaction with other constructs

- `ROTATE` nests inside and outside `FOR`, `ZIP`, `LET_REPEAT`, `ATOMIC`, `MATCH1`, `TRY_ALL`, `RANDOM` — it is a compile-time expansion like `FOR`.
- `ROTATE` applies to the full sub-tree: compound rules (`ATOMIC`, `MATCH1`, etc.) are preserved structurally; only their leaf simple-rule patterns are geometrically rotated and character-substituted.
- `CALL` and `CALL_EACH` nodes within a `ROTATE` block: explicit orbit character substitution is applied to the command name string. Command names that don't contain orbit characters are unchanged.
- `CALL` and `CALL_EACH` nodes within a `ROTATE_CMDS` block: both explicit orbit character substitution and `_e`-suffix permutation are applied. `CALL breach_e` becomes `CALL breach_s`, `CALL breach_w`, `CALL breach_n`. Command names that don't end in `_e` and don't contain orbit characters are unchanged (fine for direction-independent helpers like `unlock`).
- Side-effect names on simple rules receive the same treatment (explicit orbit substitution, plus `_e`-suffix permutation inside `ROTATE_CMDS`). The `!` suffix is preserved.

## Examples

### Basic movement (sokoban-style)

```
ROTATE_CMDS move
 *- -*

 *x- -*x
```

Generates commands `move_e`, `move_s`, `move_w`, `move_n`. `move_e` gets the base (horizontal, move right). `move_s` gets 90 CW rotation (vertical, move down). Etc.

The game's `BIND` line maps keys to the generated names:

```
BIND w move_n s move_s a move_w d move_e
```

### Drone-swarm (full directional commands)

The original drone-swarm has ~310 lines of directional command definitions. With `ROTATE_CMDS`:

```
ROTATE_CMDS use_key1
 MATCH1
  1k 1-

ROTATE_CMDS use_key2
 MATCH1
  2k 2-

ROTATE_CMDS breach
 TRY_ALL
  1g -1 use_key2_e! unlock

  2g -2 use_key1_e! unlock

ROTATE_CMDS bounce_back
 TRY_ALL
  -A 1a

  -B 2b

ROTATE_CMDS sync_locks
 MATCH1
  CALL both_locked
  CALL bounce_back_e
  ? ?

ROTATE_CMDS move1
 MATCH1
  A A

  FOR s xgh2BbA
   1s 1s

  1a -A

  1k -1 unlock

  1- -1

ROTATE_CMDS move2
 MATCH1
  B B

  FOR s xgh1AaB
   2s 2s

  2b -B

  2k -2 unlock

  2- -2

ROTATE_CMDS move
 ATOMIC
  CALL_EACH breach_e move1_e move2_e sync_locks_e
```

Direction-independent commands (`release_locked`, `both_locked`, `release_if_any_locked`, `unlock`, `park_unlock`) remain unchanged. The `BIND` line becomes:

```
BIND w move_n s move_s a move_w d move_e z release_locked
```

This reduces ~310 lines of directional commands to ~80 lines.

### Snake drag_tail

```
CMD drag_tail
 ZIP d ^v<> D NSWE
  ROTATE ESWN
   Ed -D
```

`ZIP` iterates over head directions. `ROTATE` expands each into 4 tail-relative positions. Produces 16 rules total. (Here `ESWN` is an additional orbit beyond the implicit `eswn`.)

### Snake forward_head (partial)

```
CMD forward_head
 ATOMIC
  MATCH1
   ROTATE >v<^
    e- >e

  TRY_ALL
   MATCH1
    ATOMIC
     %n %_ [norotate]

     CALL up

    ATOMIC
     %s %_ [norotate]

     CALL down

    ATOMIC
     %w %_ [norotate]

     CALL left

    ATOMIC
     %e %_ [norotate]

     CALL right
```

The first `MATCH1` uses `ROTATE` to generate all 4 head-advance patterns. The `TRY_ALL` block handles direction-change commands and references fixed hidden-row indicators, so it stays explicit.

### Status bar interaction (crash-landing destroy)

```
ROTATE >v<^
 FOR s ~A8or
  ATOMIC
   MATCH1
    ATOMIC
     >?% [norotate]

     *s *-

   TRY_ALL
    CALL zombie_march
```

The `>?%` pattern checks the direction indicator on a fixed status row — `[norotate]` prevents geometric transformation while still substituting `>` to `v`, `<`, `^` via the explicit orbit. The `*s *-` pattern is geometrically rotated to handle destroying resources in each direction.

## Implementation notes

### Compiler changes (`make-data.py`)

- Add `ROTATE` and `ROTATE_CMDS` as new compile-time expansion block types, similar to `FOR`/`ZIP`.
- Both always expand to exactly 4 steps.
- When processing the rule stack (`process_rule_stack_to_level`), a `rotate` block expands its children 4 times, applying `rotate_rule(rule, step, orbits)` to each deep copy.
- `rotate_rule` recursively walks the rule tree:
  - For `simple` rules: apply explicit orbit character substitution to `from`/`to` rows and side-effect names. If the rule is not marked `norotate`, also apply geometric rotation to the from/to grids.
  - For compound rules (`atomic`, `match1`, etc.): recurse into children.
  - For `call` rules: apply explicit orbit character substitution to the command name string.
- `ROTATE_CMDS <base>` additionally applies `_e`-suffix permutation to all `CALL`/`CALL_EACH` command name strings and side-effect names within the block, after orbit substitution.
- `ROTATE_CMDS <base>` creates 4 `CMD` entries (`<base>_e`, `<base>_s`, `<base>_w`, `<base>_n`) and fills each with the corresponding rotation step.

### Pattern annotation

- `[norotate]` is parsed like existing bracket annotations (`[firstmatch]`, etc.) but stored on the rule buffer and transferred to the emitted simple rule as a compile-time-only flag. It is stripped before emission (the runtime never sees it).

### Validation

- All explicit orbit strings must be exactly 4 characters long.
- `ROTATE_CMDS` takes exactly one base name token (remaining tokens are orbits).
- `ROTATE` must appear inside a rule block context (same as `FOR`).
- `[norotate]` outside a `ROTATE` block should warn or be silently ignored.

## Compatibility

- Fully backward compatible: no existing syntax is changed.
- Existing game files continue to compile unchanged.
- Migration is optional and incremental: replace directional command groups with `ROTATE_CMDS` one at a time, verifying snapshot parity after each.
- Migration requires renaming directional commands to the `_e/_s/_w/_n` suffix convention and updating `BIND` lines accordingly.

## Testing strategy

1. Add a tiny fixture file `fixture-rotate.txt` exercising:
   - `ROTATE` with explicit orbit inside a `CMD`
   - `ROTATE` with no explicit orbits (geometry + implicit `eswn` only)
   - `ROTATE_CMDS` generating 4 commands from a base name
   - `[norotate]` annotation preserving geometry while substituting characters
   - `ROTATE` nested inside `FOR`/`ZIP`
   - `ROTATE` containing `CALL` where command names include `e`/`s`/`w`/`n`
   - `ROTATE` containing side-effect names with `e`/`s`/`w`/`n`
2. Add its golden snapshot.
3. Migrate `sokoban.txt` (simplest candidate) and verify snapshot parity.
4. Migrate `drone-swarm.txt` and verify snapshot parity.
