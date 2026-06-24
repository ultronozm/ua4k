#!/bin/bash

set -euo pipefail

launch_html=.ua4k-launch.html

usage() {
    echo "usage: ./play-level.sh <game-name-or-file> [level]" >&2
    echo "examples:" >&2
    echo "  ./play-level.sh dockstep" >&2
    echo "  ./play-level.sh dockstep 3" >&2
    echo "  ./play-level.sh games/polished/dockstep.txt 3" >&2
}

if [ $# -lt 1 ] || [ $# -gt 2 ]; then
    usage
    exit 2
fi

game_arg=$1
level_arg=${2-}

if [ -f "$game_arg" ]; then
    game_file=$game_arg
else
    if [[ "$game_arg" == *.txt ]]; then
        target_name=$(basename "$game_arg")
    else
        target_name="$(basename "$game_arg").txt"
    fi
    matches=$(find games -type f -name "$target_name" | sort)
    match_count=$(printf '%s\n' "$matches" | sed '/^$/d' | wc -l | tr -d ' ')
    if [ "$match_count" -eq 0 ]; then
        echo "game file not found: $game_arg" >&2
        exit 1
    fi
    if [ "$match_count" -gt 1 ]; then
        echo "ambiguous game name: $game_arg" >&2
        printf '%s\n' "$matches" >&2
        exit 1
    fi
    game_file=$matches
fi
game_name=$(basename "$game_file" .txt)

if [ -n "$level_arg" ] && ! [[ "$level_arg" =~ ^[0-9]+$ ]]; then
    echo "level must be a non-negative integer" >&2
    exit 1
fi

python3 ./make-data.py "$game_file"

url=$(python3 - "$game_name" "$level_arg" <<'PY'
import json
import pathlib
import re
import sys

launch_path = pathlib.Path(".ua4k-launch.html").resolve()
template_path = pathlib.Path("ua4k.html")
game_name = sys.argv[1]
level_arg = sys.argv[2]
level = int(level_arg) if level_arg else None

selection = {"game": game_name, "level": level}
template = template_path.read_text(encoding="utf-8")
injected = f"""    <script>
      window.UA4K_STARTUP_SELECTION = {json.dumps(selection)};
    </script>
    <script src="gamesData.js"></script>"""
html, count = re.subn(r'\s*<script src="gamesData\.js"></script>', "\n" + injected, template, count=1)
if count != 1:
    raise SystemExit("could not find gamesData.js include in ua4k.html")

launch_path.write_text(html, encoding="utf-8")
print(launch_path.as_uri())
PY
)

if [ -n "${UA4K_OPEN_COMMAND-}" ]; then
    "$UA4K_OPEN_COMMAND" "$url"
elif command -v open >/dev/null 2>&1; then
    open "$url"
elif command -v xdg-open >/dev/null 2>&1; then
    xdg-open "$url" >/dev/null 2>&1 &
else
    echo "$url"
    echo "No supported browser opener found; open the URL above manually." >&2
fi
