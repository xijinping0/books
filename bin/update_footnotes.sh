#!/bin/bash

# This script updates footnote superscripts:
# - Before separator (---): [(\d)] -> [^(\d)]
# - After separator (---): [(\d)] -> [^(\d)]:

if [ -z "$1" ]; then
  echo "Usage: $0 directory"
  exit 1
fi

input_dir="$1"

if [ ! -d "$input_dir" ]; then
  echo "Directory not found: $input_dir"
  exit 1
fi

process_file() {
  local file="$1"
  local temp_file="${file}.tmp"
  local before_separator=true

  while IFS= read -r line; do
    if [[ "$line" =~ ^-{3,}$ ]]; then
      before_separator=false
    fi

    if $before_separator; then
      echo "$line" | sed -E 's/\[([0-9]+)\]/\[\^\1\]/g' >> "$temp_file"
    else
      echo "$line" | sed -E 's/\[([0-9]+)\]/\[\^\1\]: /g' >> "$temp_file"
    fi

  done < "$file"

  mv "$temp_file" "$file"
}

export -f process_file

find "$input_dir" -type f -name "*.md" -exec bash -c 'process_file "$0"' {} \;

echo "Processing complete."
