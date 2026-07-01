#!/usr/bin/env python3
from __future__ import annotations

import argparse
import html
import json
import shutil
import sys
from dataclasses import dataclass
from pathlib import Path

from compiler_common import load_make_data_module, repo_root, resolve_game_file


SITE_CATEGORIES = (
    ("polished", "Polished Games", "games/polished"),
    ("toys", "Playable Toys", "games/toys"),
)

OPTIONAL_CATEGORIES = (
    ("wip", "Works In Progress", "games/wip"),
)

GAME_SUMMARIES = {
    "game": "The original UA4K puzzle set: small rewrite-rule levels about moving symbols into goals.",
    "crash-landing": "A resource-management puzzle about oxygen, mining, construction, and getting back to your ship.",
    "dockstep": "A lockstep movement puzzle where multiple agents move together and force fields shape the route.",
    "arithmetic": "A tiny arithmetic toy built out of board rewrites.",
    "basic-game": "A minimal movement example for understanding the format.",
    "bet": "A quick probability toy about wagering on which side has more dots.",
    "fight": "A compact turn-style combat toy.",
    "hanoi": "A Towers of Hanoi-flavored board rewrite demo.",
    "river-crossing": "The wolf, goat, and cabbage puzzle expressed as a UA4K game.",
    "snake": "A complete Snake implementation inside the puzzle engine.",
    "sokoban": "A small Sokoban-style box-pushing toy.",
    "synth": "A small symbol-manipulation puzzle with swap commands.",
    "tetris": "A Tetris-shaped toy that stress-tests how far the engine can be pushed.",
    "theseus-minotaur": "A pursuit puzzle inspired by Theseus and the Minotaur.",
    "towers": "A tower-moving toy puzzle.",
    "turing": "A compact Turing-machine joke/demo implemented as a board game.",
}

CATEGORY_NOTES = {
    "polished": "The clearest examples right now. Start here.",
    "toys": "Playable experiments and demos. Some are intentionally small or strange.",
    "wip": "Mechanic sketches that are not part of the default public build.",
}


@dataclass(frozen=True)
class SiteGame:
    category: str
    category_title: str
    source_path: Path
    compiled: dict

    @property
    def name(self) -> str:
        return self.source_path.stem

    @property
    def display_name(self) -> str:
        return self.name.replace("-", " ").title()


def parse_args(argv: list[str]) -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Build the static UA4K website.")
    parser.add_argument(
        "game_files",
        nargs="*",
        help="Optional game files or unique stems. Defaults to polished games and toys.",
    )
    parser.add_argument(
        "-o",
        "--output-dir",
        default="site",
        help="Output directory for the static site.",
    )
    parser.add_argument(
        "--include-wip",
        action="store_true",
        help="Also include buildable games from games/wip.",
    )
    return parser.parse_args(argv[1:])


def discover_category_games(category: tuple[str, str, str]) -> list[tuple[str, str, Path]]:
    key, title, relative_dir = category
    root = repo_root()
    game_dir = root / relative_dir
    if not game_dir.is_dir():
        return []
    return [(key, title, path) for path in sorted(game_dir.glob("*.txt"))]


def selected_game_paths(args: argparse.Namespace) -> list[tuple[str, str, Path]]:
    if args.game_files:
        return [
            ("selected", "Selected Games", resolve_game_file(game_file))
            for game_file in args.game_files
        ]

    categories = list(SITE_CATEGORIES)
    if args.include_wip:
        categories.extend(OPTIONAL_CATEGORIES)

    games: list[tuple[str, str, Path]] = []
    for category in categories:
        games.extend(discover_category_games(category))
    return games


def compile_site_games(args: argparse.Namespace) -> list[SiteGame]:
    module = load_make_data_module()
    games: list[SiteGame] = []
    for category, category_title, source_path in selected_game_paths(args):
        try:
            compiled = module.compile_game(str(source_path))
        except module.DSLParseError as exc:
            rel = source_path.relative_to(repo_root())
            print(f"{rel}:{exc.line_no}: error: {exc.message}", file=sys.stderr)
            raise SystemExit(2) from exc
        games.append(SiteGame(category, category_title, source_path, compiled))
    return games


def first_level(game: SiteGame) -> dict:
    levels = game.compiled.get("levels", [])
    return levels[0] if levels else {"board": []}


def game_description(game: SiteGame) -> str:
    if game.name in GAME_SUMMARIES:
        return GAME_SUMMARIES[game.name]

    level = first_level(game)
    description = level.get("description")
    if isinstance(description, str) and description:
        return description
    return f"{game.display_name} ({len(game.compiled.get('levels', []))} level(s))"


def preview_board(game: SiteGame, max_rows: int = 10, max_cols: int = 40) -> str:
    hidden = set(game.compiled.get("hiddenLineChars") or [])
    rows = []
    for row in first_level(game).get("board", []):
        if any(char in hidden for char in row):
            continue
        rows.append(row[:max_cols])
        if len(rows) >= max_rows:
            break
    return "\n".join(rows)


def write_shared_assets(output_dir: Path) -> None:
    root = repo_root()
    shutil.copy2(root / "ua4k.js", output_dir / "ua4k.js")
    shutil.copy2(root / "ua4k.css", output_dir / "ua4k.css")
    shutil.copy2(root / "kitten.jpg", output_dir / "kitten.jpg")
    write_site_css(output_dir / "site.css")


def write_site_css(path: Path) -> None:
    path.write_text(
        """body {
  margin: 0;
  font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
  background: #f7f7f4;
  color: #171717;
}

a {
  color: inherit;
}

.site-header {
  padding: 24px 28px 12px;
  border-bottom: 1px solid #d8d8d2;
}

.site-header h1 {
  margin: 0;
  font-size: 28px;
  letter-spacing: 0;
}

.site-header p {
  max-width: 760px;
  margin: 8px 0 0;
  color: #555;
  line-height: 1.45;
}

.game-section {
  padding: 24px 28px 6px;
}

.game-section h2 {
  margin: 0;
  font-size: 18px;
}

.section-note {
  margin: 4px 0 14px;
  color: #666;
  line-height: 1.4;
}

.game-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 14px;
}

.game-card {
  display: grid;
  gap: 10px;
  min-height: 250px;
  padding: 14px;
  border: 1px solid #d8d8d2;
  border-radius: 6px;
  background: #fff;
  text-decoration: none;
}

.game-card:hover {
  border-color: #999;
}

.game-card h3 {
  margin: 0;
  font-size: 17px;
}

.game-meta {
  margin-top: 2px;
  color: #777;
  font-size: 13px;
}

.game-card p {
  margin: 0;
  color: #555;
  line-height: 1.4;
}

.board-preview {
  overflow: hidden;
  min-height: 120px;
  margin: 0;
  padding: 10px;
  border-radius: 4px;
  background: #161616;
  color: #f2f2e9;
  font: 15px/1.1 "SFMono-Regular", Consolas, "Liberation Mono", monospace;
  white-space: pre;
}

.game-page {
  padding: 0 24px 32px;
}

.game-nav {
  padding: 18px 0;
}

.game-shell {
  max-width: 980px;
}

.game-shell h1 {
  margin: 0 0 14px;
  font-size: 26px;
}

.scratch-panel {
  max-width: 760px;
  margin-top: 24px;
  padding-top: 18px;
  border-top: 1px solid #d8d8d2;
}

.scratch-panel button {
  margin: 0 8px 8px 0;
  padding: 7px 10px;
  border: 1px solid #aaa;
  border-radius: 4px;
  background: #fff;
  color: #171717;
  font: inherit;
  cursor: pointer;
}

.scratch-panel button:hover {
  border-color: #555;
}

.scratch-editor[hidden] {
  display: none;
}

.scratch-board {
  box-sizing: border-box;
  width: 100%;
  min-height: 220px;
  margin: 8px 0 10px;
  padding: 10px;
  border: 1px solid #bdbdb7;
  border-radius: 4px;
  background: #fff;
  color: #171717;
  font: 15px/1.15 "SFMono-Regular", Consolas, "Liberation Mono", monospace;
  white-space: pre;
}

.scratch-errors {
  min-height: 20px;
  margin: 4px 0 0;
  color: #a32626;
  font: 14px/1.35 "SFMono-Regular", Consolas, "Liberation Mono", monospace;
  white-space: pre-wrap;
}

@media (max-width: 700px) {
  .site-header,
  .game-section {
    padding-left: 16px;
    padding-right: 16px;
  }

  .game-page {
    padding-left: 16px;
    padding-right: 16px;
  }
}
""",
        encoding="utf-8",
    )


def game_card(game: SiteGame) -> str:
    level_count = len(game.compiled.get("levels", []))
    return f"""<a class="game-card" href="games/{html.escape(game.name)}.html">
  <div>
    <h3>{html.escape(game.display_name)}</h3>
    <p class="game-meta">{level_count} level{'s' if level_count != 1 else ''}</p>
  </div>
  <pre class="board-preview">{html.escape(preview_board(game))}</pre>
  <p>{html.escape(game_description(game))}</p>
</a>"""


def index_html(games: list[SiteGame]) -> str:
    sections = []
    seen_categories = []
    for game in games:
        if game.category not in seen_categories:
            seen_categories.append(game.category)

    for category in seen_categories:
        category_games = [game for game in games if game.category == category]
        title = category_games[0].category_title
        note = CATEGORY_NOTES.get(category, "")
        cards = "\n".join(game_card(game) for game in category_games)
        sections.append(
            f"""<section class="game-section">
  <h2>{html.escape(title)}</h2>
  <p class="section-note">{html.escape(note)}</p>
  <div class="game-grid">
{cards}
  </div>
</section>"""
        )

    return f"""<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>ULTRONO ARENA 4000</title>
    <link rel="stylesheet" href="site.css">
  </head>
  <body>
    <header class="site-header">
      <h1>ULTRONO ARENA 4000</h1>
      <p>A small rule-rewriting puzzle engine. Pick a game below; each page is static, works without a backend, and includes a scratch board editor for trying custom levels.</p>
    </header>
{''.join(sections)}
  </body>
</html>
"""


def game_page_html(game: SiteGame) -> str:
    name_json = json.dumps(game.name)
    return f"""<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>{html.escape(game.display_name)} - ULTRONO ARENA 4000</title>
    <link rel="stylesheet" href="../ua4k.css">
    <link rel="stylesheet" href="../site.css">
  </head>
  <body class="game-page">
    <nav class="game-nav"><a href="../index.html">All games</a></nav>
    <main class="game-shell">
      <h1>{html.escape(game.display_name)}</h1>
      <div id="level"></div>
      <div id="moves"></div>
      <div id="description"></div>
      <div id="status"></div>
      <div id="display"></div>
      <div id="title"></div>
      <div id="author"></div>
      <p class="key-help">u: undo. U: restart level.</p>
      <div id="docs"></div>
      <div id="goals"></div>
      <div id="voids"></div>

      <section class="scratch-panel" aria-label="Scratch level editor">
        <button id="scratchToggle" type="button">Edit Scratch Level</button>
        <div id="scratchEditor" class="scratch-editor" hidden>
          <textarea id="scratchBoard" class="scratch-board" spellcheck="false"></textarea>
          <div>
            <button id="scratchRun" type="button">Run Scratch</button>
            <button id="scratchUseCurrent" type="button">Use Current Board</button>
            <button id="scratchReset" type="button">Reset To Original</button>
          </div>
          <pre id="scratchErrors" class="scratch-errors" aria-live="polite"></pre>
        </div>
      </section>
    </main>

    <div id="touchControls"></div>

    <script src="../ua4k.js"></script>
    <script src="{html.escape(game.name)}.data.js"></script>
    <script>
      window.UA4K.startStandalone(window.UA4K_GAME_DATA, {{ gameName: {name_json} }});
      (function initScratchPanel() {{
        const toggle = document.getElementById("scratchToggle");
        const editor = document.getElementById("scratchEditor");
        const boardInput = document.getElementById("scratchBoard");
        const runButton = document.getElementById("scratchRun");
        const useCurrentButton = document.getElementById("scratchUseCurrent");
        const resetButton = document.getElementById("scratchReset");
        const errors = document.getElementById("scratchErrors");
        let dirty = false;
        let editorLevel = null;

        function currentLevel() {{
          return window.UA4K.currentLevelNumber();
        }}

        function storageKey() {{
          return "ua4k:scratch:" + {name_json} + ":level:" + currentLevel();
        }}

        function storedBoard() {{
          try {{
            return window.localStorage.getItem(storageKey());
          }} catch (_) {{
            return null;
          }}
        }}

        function saveBoard(text) {{
          try {{
            window.localStorage.setItem(storageKey(), text);
          }} catch (_) {{}}
        }}

        function clearSavedBoard() {{
          try {{
            window.localStorage.removeItem(storageKey());
          }} catch (_) {{}}
        }}

        function setErrors(messages) {{
          errors.textContent = messages.join("\\n");
        }}

        function validateOnly() {{
          const result = window.UA4K.parseAndValidateBoardText(boardInput.value);
          setErrors(result.ok ? [] : result.errors);
          return result;
        }}

        function loadEditorForCurrentLevel(force) {{
          const level = currentLevel();
          if (!force && dirty && editorLevel === level) {{
            return;
          }}
          boardInput.value = storedBoard() || window.UA4K.originalLevelText();
          editorLevel = level;
          dirty = false;
          validateOnly();
        }}

        loadEditorForCurrentLevel(true);
        boardInput.addEventListener("input", function() {{
          dirty = true;
          validateOnly();
        }});

        toggle.addEventListener("click", function() {{
          const opening = editor.hidden;
          editor.hidden = !editor.hidden;
          if (!editor.hidden) {{
            loadEditorForCurrentLevel(opening && editorLevel !== currentLevel());
            validateOnly();
            boardInput.focus();
          }}
        }});

        runButton.addEventListener("click", function() {{
          const result = window.UA4K.startScratchLevelFromText(boardInput.value);
          if (result.ok) {{
            saveBoard(boardInput.value);
            editorLevel = currentLevel();
            dirty = false;
            setErrors([]);
          }} else {{
            setErrors(result.errors);
          }}
        }});

        useCurrentButton.addEventListener("click", function() {{
          boardInput.value = window.UA4K.currentBoardText();
          editorLevel = currentLevel();
          dirty = true;
          validateOnly();
        }});

        resetButton.addEventListener("click", function() {{
          clearSavedBoard();
          boardInput.value = window.UA4K.originalLevelText();
          editorLevel = currentLevel();
          dirty = false;
          setErrors([]);
          window.UA4K.restoreOriginalLevel();
        }});

        window.addEventListener("ua4k:levelchange", function() {{
          loadEditorForCurrentLevel(true);
        }});
      }})();
    </script>
  </body>
</html>
"""


def write_game_page(output_dir: Path, game: SiteGame) -> None:
    games_dir = output_dir / "games"
    games_dir.mkdir(parents=True, exist_ok=True)
    data_path = games_dir / f"{game.name}.data.js"
    page_path = games_dir / f"{game.name}.html"
    data_path.write_text(
        "window.UA4K_GAME_DATA = " + json.dumps(game.compiled, indent=2) + ";\n",
        encoding="utf-8",
    )
    page_path.write_text(game_page_html(game), encoding="utf-8")


def build_site(args: argparse.Namespace) -> None:
    output_dir = (repo_root() / args.output_dir).resolve()
    if output_dir.exists():
        shutil.rmtree(output_dir)
    output_dir.mkdir(parents=True)

    games = compile_site_games(args)
    if not games:
        raise SystemExit("no games selected")

    write_shared_assets(output_dir)
    games_dir = output_dir / "games"
    games_dir.mkdir(parents=True, exist_ok=True)
    shutil.copy2(repo_root() / "kitten.jpg", games_dir / "kitten.jpg")
    for game in games:
        write_game_page(output_dir, game)
    (output_dir / "index.html").write_text(index_html(games), encoding="utf-8")
    print(f"wrote static site with {len(games)} games to {output_dir}")


def main(argv: list[str]) -> int:
    args = parse_args(argv)
    build_site(args)
    return 0


if __name__ == "__main__":
    raise SystemExit(main(sys.argv))
