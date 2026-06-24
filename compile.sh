#!/bin/bash

# Check if any argument is given
if [ $# -eq 0 ]; then
    echo "No arguments provided"
    exit 1
fi

for file in "$@"; do
    python3 ./make-data.py "$file"
done
