#!/bin/bash

set -euo pipefail

launch_html=.ua4k-launch.html

usage() {
    echo "usage: ./play-level.sh <game-name-or-file> [level]" >&2
    echo "examples:" >&2
    echo "  ./play-level.sh drone-swarm" >&2
    echo "  ./play-level.sh drone-swarm 3" >&2
    echo "  ./play-level.sh drone-swarm.txt 3" >&2
}

if [ $# -lt 1 ] || [ $# -gt 2 ]; then
    usage
    exit 2
fi

game_arg=$1
level_arg=${2-}

if [[ "$game_arg" == *.txt ]]; then
    game_file=$game_arg
    game_name=${game_arg%.txt}
else
    game_file="${game_arg}.txt"
    game_name=$game_arg
fi

if [ ! -f "$game_file" ]; then
    echo "game file not found: $game_file" >&2
    exit 1
fi

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
