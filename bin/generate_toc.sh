#!/bin/bash

# Generate a markdown TOC file from markdown files in a directory.

if [ -z "$1" ] || [ -z "$2" ]; then
  echo "Usage: $0 <input_directory> <output_filename>"
  exit 1
fi

INPUT_DIR="$1"
OUTPUT_FILE="$2"

# Derive prefix by stripping 'content/' from the input directory
LINK_PREFIX="${INPUT_DIR#content/}"

echo "" >> "$OUTPUT_FILE"

for FILE in "$INPUT_DIR"/*.md "$INPUT_DIR"/*.mdx; do
  # Skip if no files match the pattern
  [ -e "$FILE" ] || continue

  BASENAME=$(basename "$FILE")
  BASENAME_NO_EXT="${BASENAME%.*}"
  TITLE=$(grep -m 1 'title: ' "$FILE" | sed 's/^title: //; s/[[:space:]]*$//')

  echo "- [$TITLE](/$LINK_PREFIX/$BASENAME_NO_EXT)" >> "$OUTPUT_FILE"
done

echo "TOC generation completed. Check the $OUTPUT_FILE file."
