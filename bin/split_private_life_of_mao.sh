#!/bin/bash

if [ $# -ne 1 ]; then
  echo "Usage: $0 <input_file>"
  exit 1
fi

input_file="$1"
output_prefix=$(basename "$input_file" .txt)
output_dir="."

# Initialize variables
current_file=""
counter=0

# Read the input file line by line
while IFS= read -r line; do
  if [[ $line =~ ^#\ ([0-9]+)$ ]]; then
    # If we find a title line, start a new file
    counter="${BASH_REMATCH[1]}"
    current_file="$output_dir/${counter}.md"
    echo "Creating file $current_file"
    > "$current_file" # Truncate the new file
  fi
  # Append the line to the current file
  echo "$line" >> "$current_file"
done < "$input_file"

echo "Splitting completed. Files are saved in $output_dir."
