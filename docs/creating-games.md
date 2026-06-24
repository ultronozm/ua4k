# Creating UA4K Games

UA4K games are text files. A game file contains boards, goals or voids, key
bindings, and rewrite rules. The compiler turns that text into the JSON data
used by the browser and Emacs runtimes.

Start by copying a small working file from `games/toys/`, then change one thing
at a time.

## Minimal Shape

```txt
GOAL
E

VOID
X

-----
-1-e-
-----

DESCRIPTION Reach the exit.

BIND a move_w "west" d move_e "east"

CMD move_e
 1- -1
 1e -E

CMD move_w
 -1 1-
 e1 E-
```

Important details:

- Blank lines matter. They end boards, `GOAL` blocks, `VOID` blocks, and
  accumulated multi-row rules.
- A board is just consecutive non-directive lines.
- `GOAL` patterns must occur for a level to be complete.
- `VOID` patterns must not occur.
- `BIND` maps keys to command names and optional display labels. Labels are
  used in the browser key list and in generated touch controls.
- `CMD` starts a command rule block.

Compile and play it:

```sh
python3 make-data.py path/to/my-game.txt
open ua4k.html
```

Or build a standalone browser page:

```sh
python3 build-web.py path/to/my-game.txt
open web-build/my-game.html
```

## Rule Lines

A simple rule has a source pattern and a destination pattern:

```txt
1- -1
```

That means: find `1-` and replace it with `-1`.

If the destination pattern is omitted, it is the same as the source pattern:

```txt
1
```

That is useful as a test rule: it succeeds when `1` is present and changes
nothing.

## Wildcards

`?` in the source pattern matches any cell.

`?` in the destination pattern preserves the current cell.

```txt
1? -?
```

This moves `1` right while preserving whatever was in the second cell.

## Multi-Row Rules

Consecutive rule lines before a blank line form one multi-row rule:

```txt
1-
xx

-1
xx
```

This matches a two-row pattern and rewrites the same area.

## Rule Order

Commands are `MATCH1` blocks at runtime: rules are tried in order until one
succeeds. Put specific cases before general cases.

```txt
CMD move_e
 1e -E

 1- -1
```

Here, stepping into the exit wins before ordinary movement gets a chance.

## Control Blocks

`MATCH1` tries children in order and stops at the first success.

```txt
CMD move_e
 MATCH1
  1e -E

  1- -1
```

`TRY_ALL` applies every child rule and always succeeds.

`ATOMIC` applies children as an all-or-nothing group; if any child fails, the
board rolls back.

Mandatory side effects use `!`:

```txt
1g -1 spend_key!
```

If `spend_key` fails, the parent rule also fails and the board rolls back.

## Directional Movement

Use `ROTATE_CMDS` to avoid writing four copies of the same movement rule.
The base orientation is east. The compiler generates `_e`, `_s`, `_w`, and
`_n` command variants.

```txt
BIND w move_n "north" s move_s "south" a move_w "west" d move_e "east"

ROTATE_CMDS move
 1- -1
```

See `games/wip/ice-slides.txt` and `games/wip/lantern-trail.txt` for larger
examples of `ROTATE_CMDS`.

## Good Example Files

- `games/polished/game.txt`: older but central example game.
- `games/polished/crash-landing.txt`: larger resource-management puzzle.
- `games/polished/dockstep.txt`: polished lockstep movement puzzle.
- `games/toys/snake.txt`: complete arcade-style toy.
- `games/toys/turing.txt`: compact computational joke/demo.
- `tests/fixtures/fixture-rotate.txt`: tiny focused rotation example.

## Current Metadata Quirk

`TITLE`, `DESCRIPTION`, `BY`, and `MINMOVES` currently attach to the most
recent level. If they appear before the first board, they do not become
game-level metadata. This should probably be improved later; for now, put
level-specific metadata after the board it describes.

## Full Reference

For exact current behavior, read `docs/dsl-spec-current.md`.
