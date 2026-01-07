#!/bin/bash

if [ $# -lt 2 ]; then
  echo "Usage: $0 input_filename output_directory"
  exit 1
fi

input_file="$1"
output_dir="$2"

if [ ! -f "$input_file" ]; then
  echo "File not found: $input_file"
  exit 1
fi

mkdir -p "$output_dir"

current_file=""
file_count=0

while IFS= read -r line; do
  if [[ "$line" =~ ^第.{1,3}[章|节].+$ ]]; then
    if [ -n "$current_file" ]; then
      echo -e "$buffer" > "$current_file"
    fi
    file_count=$((file_count + 1))
    current_file="${output_dir}/ch$(printf "%02d" $file_count).md"
    buffer="---\ntitle: $line\n---\n\n"
  else
    buffer="${buffer}\n${line}"
  fi
done < "$input_file"

if [ -n "$current_file" ]; then
  echo -e "$buffer" > "$current_file"
fi

echo "Files created in directory: $output_dir"
