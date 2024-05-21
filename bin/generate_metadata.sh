#!/bin/bash

# Create _meta.json file in the given directory.

if [ -z "$1" ]; then
  echo "Usage: $0 <directory>"
  exit 1
fi

DIR="$1"
OUTPUT="$1/_meta.json"

echo "{" > $OUTPUT

for FILE in "$DIR"/*.md; do
  BASENAME=$(basename "$FILE" .md)
  TITLE=$(grep -m 1 '^# ' "$FILE" | sed 's/^# //')
  echo "  \"$BASENAME\": \"$TITLE\"," >> $OUTPUT
done

sed -i '' '$ s/,$//' $OUTPUT
echo "}" >> $OUTPUT

echo "Metadata extraction completed. Check the $OUTPUT file."
