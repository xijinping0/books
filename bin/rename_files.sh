#!/bin/bash

# Directory containing the files
directory="pages/private-life-of-mao"

# Prefix to be added
prefix="ch"

# Loop through all .md files in the directory
for file in "$directory"/*.md;
do
  # Get the base name of the file (e.g., 1.md)
  base_name=$(basename "$file")

  # Check if the base name follows the <number>.md pattern
  if [[ "$base_name" =~ ^([0-9]+)\.md$ ]]; then
    # Extract the number part from the base name
    number="${BASH_REMATCH[1]}"

    # Add a leading zero if the number has a single digit
    if [ ${#number} -eq 1 ]; then
      number="0$number"
    fi

    # Construct the new file name with the prefix
    new_name="${prefix}${number}.md"

    # Rename the file
    mv "$file" "$directory/$new_name"
  fi
done

echo "Files have been renamed successfully."
