# DSL Evolution MVP: `ROTATE` and `ROTATE_CMDS`

## Motivation

Most games duplicate directional logic four times (E/S/W/N). That duplication is noisy and error-prone.

`ROTATE` and `ROTATE_CMDS` are compile-time expansion constructs (like `FOR`/`ZIP`) that remove directional duplication while preserving runtime behavior.

## v1 decisions (authoritative)

1. Base orientation is **east** (0°).
2. Expansion order is always: **east, south, west, north**.
3. Character substitution is done only through **explicitly provided 4-char orbits**.
4. There is **no implicit `eswn` substitution** in patterns or names.
5. Command-name rewriting is **suffix-only** (`_e` -> `_s/_w/_n`), not full-string character substitution.
6. `[norotate]` is a compile-time flag on simple rules and can coexist with `[firstmatch]`/`[lastmatch]`/`[random]`.

## New constructs

### `ROTATE [<orbit1> <orbit2> ...]`

Compile-time block expansion inside a rule context.

- Produces 4 rotated copies of the enclosed rule subtree.
- Each orbit is exactly 4 characters, interpreted as positions for east/south/west/north.
- Applies to simple-rule patterns (`from`/`to` rows).
- Rewrites command references and side-effect names ending in `_e` to step suffixes (`_e/_s/_w/_n`), preserving mandatory `!`.
- Names not ending in `_e` are unchanged.

### `ROTATE_CMDS <base_name> [<orbit1> <orbit2> ...]`

Top-level command generator.

- Creates commands: `<base_name>_e`, `<base_name>_s`, `<base_name>_w`, `<base_name>_n`.
- Each command body is one rotated expansion step of the enclosed subtree.
- Pattern rotation/substitution rules are the same as `ROTATE`.
- Additionally, for command references and side-effect references:
  - names ending in `_e` are rewritten to step suffix (`_e/_s/_w/_n`)
  - names not ending in `_e` are left unchanged
- No full-string character substitution on command names or side-effect names.

## `[norotate]` annotation

`[norotate]` is a compile-time flag on a simple rule.

- Effect: skip geometric rotation for that simple rule; still apply explicit orbit character substitution to pattern cells.
- It may appear on any line of a multi-line simple rule.
- It may coexist with method annotation (`[firstmatch]`, `[lastmatch]`, `[random]`).
- If present outside `ROTATE`/`ROTATE_CMDS` context, emit a **compile error**.

## Rotation geometry

For an `M x N` pattern:

| Step | Direction | Transform | Result |
|---|---|---|---|
| 0 | east | identity | `M x N` |
| 1 | south | transpose + reverse each row | `N x M` |
| 2 | west | reverse rows + reverse each row | `M x N` |
| 3 | north | transpose + reverse row order | `N x M` |

Both `from` and `to` are transformed identically.

## Transformation order

For each expansion step `i`:

1. Deep-copy subtree.
2. For each simple rule:
   - if not `[norotate]`, rotate `from` and `to` geometry by `i * 90° CW`
   - apply orbit substitutions to pattern cells for step `i`
3. Rewrite command/side-effect references by directional suffix:
   - `_e -> _e/_s/_w/_n` for step `i`

This order is fixed and deterministic.

## Rule ordering guarantees

- `ROTATE` expansion is **step-major**:
  - emit all east-expanded children in original order
  - then south, west, north in original order
- Within each step, existing subtree order is preserved.
- `ROTATE_CMDS` assigns one step to one generated command; within each command body, original order is preserved.

## Interaction with existing constructs

- `ROTATE` can wrap/appear within: `ATOMIC`, `ATOMIC_VERTICAL`, `ATOMIC_HORIZONTAL`, `MATCH1`, `TRY_ALL`, `RANDOM`, `FOR`, `ZIP`, `LET_REPEAT`.
- `ROTATE` is compile-time only; runtime rule types remain unchanged.
- `CALL` and side-effect references are suffix-rewritten by both `ROTATE` and `ROTATE_CMDS` when they end with `_e`.
- `CALL_EACH` is out of scope for this v1 unless added explicitly as a separate feature.

## Examples

### Minimal movement command family

```txt
ROTATE_CMDS move
 *- -*

 *x- -*x
```

Generates `move_e`, `move_s`, `move_w`, `move_n`.

```txt
BIND w move_n s move_s a move_w d move_e
```

### Suffix rewrite in `ROTATE_CMDS`

```txt
ROTATE_CMDS breach
 TRY_ALL
  1g -1 use_key2_e! unlock
  2g -2 use_key1_e! unlock
```

Step behavior:
- east: `use_key2_e!`, `use_key1_e!`
- south: `use_key2_s!`, `use_key1_s!`
- west: `use_key2_w!`, `use_key1_w!`
- north: `use_key2_n!`, `use_key1_n!`

`unlock` remains unchanged.
If a side-effect is mandatory (e.g. `use_key2_e!`), the suffix is rewritten and `!` is preserved (`use_key2_s!`, etc.).

### Fixed status-row lookup

```txt
ROTATE >v<^
 FOR s ~A8or
  ATOMIC
   MATCH1
    ATOMIC
     >?% [norotate]

     *s *-
```

`>?%` stays fixed in geometry but substitutes `>` -> `v/< /^` by step.

## Compiler implementation notes (`make-data.py`)

1. Add new block nodes: `rotate`, `rotate_cmds`.
2. Parse orbit args; validate length 4 for each orbit.
3. Parse annotation flags separately from method (`simple_rule.flags`, `simple_rule.method`).
4. Expansion in `process_rule_stack_to_level`:
   - `rotate`: emit four expanded child copies into parent node.
   - `rotate_cmds`: materialize four named commands and emit one step into each.
5. Add dedicated helpers:
   - `rotate_grid(grid, step)`
   - `apply_orbits_to_pattern_rows(rows, orbits, step)`
   - `rewrite_directional_suffix(name, step)`
   - `expand_rotate_subtree(node, step, orbits, in_rotate_context=True)`
6. Strip compile-time-only flags before runtime JSON emission.

## Validation rules

- Every orbit must be length 4.
- `ROTATE_CMDS` requires exactly one base name before orbit list.
- `ROTATE` must be inside a rule block context.
- `[norotate]` outside rotation context is an error.
- Unknown annotation tokens should error (do not silently ignore).

## Compatibility and migration

- Backward compatible by default; existing syntax unchanged.
- Migration is opt-in and incremental.
- Recommended migration sequence:
  1. introduce `ROTATE`/`ROTATE_CMDS`
  2. add fixtures + snapshots
  3. migrate one command group at a time
  4. confirm snapshot parity after each migration

## Testing strategy

1. Add `fixture-rotate.txt` covering:
   - `ROTATE` with and without orbits
   - `ROTATE_CMDS` command generation
   - suffix rewrite for `CALL` and side effects
   - `[norotate]` semantics
   - nesting with `FOR`/`ZIP`/`LET_REPEAT`
2. Add golden snapshot for that fixture.
3. Migrate `sokoban.txt` first and compare snapshots.
4. Migrate larger directional game(s) after parity confidence.
