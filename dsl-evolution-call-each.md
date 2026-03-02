# DSL Evolution: `CALL_EACH`

## Change Summary

New rule-block directive:
- `CALL_EACH <cmd1> <cmd2> ...`

Semantics:
- Expands to sequential `CALL` nodes in-place.
- Example:
  - `CALL_EACH a b c`
  - Equivalent to:
    - `CALL a`
    - `CALL b`
    - `CALL c`

This is syntactic sugar only. Runtime behavior is unchanged because emitted rules are normal `call` nodes.

## Why This Helps

It reduces repetitive boilerplate in command pipelines that currently repeat many `CALL` lines (for example inside `TRY_ALL` blocks).

## Compatibility

- Backward compatible: existing game files continue to compile unchanged.
- No migration is required.

## Migration Strategy

Adopt incrementally:
1. Identify consecutive `CALL` lines in the same block.
2. Replace them with one `CALL_EACH` line in the same order.
3. Re-run:
   - `python3 golden_snapshots.py check`
   - `python3 parser_diagnostics.py`

If you want to keep diffs minimal, migrate one command block at a time.
