#!/bin/bash

input_file="$1"

chapter_pattern="^# 第.{1,3}章 .+$"

chapter_number=1
current_chapter_content=""
current_chapter_file=""

while IFS= read -r line
do
  if [[ $line =~ $chapter_pattern ]]; then
    # If a new chapter starts and current chapter content is not empty
    if [[ -n "$current_chapter_content" ]]; then
        # Write the current chapter content to a file
        echo "$current_chapter_content" > "$current_chapter_file"
    fi
    # Set the new chapter file name
    current_chapter_file=$(printf "ch%02d.md" $chapter_number)
    # Increment the chapter number
    ((chapter_number++))
    # Reset the current chapter content
    current_chapter_content="$line"$'\n'
  else
    current_chapter_content+="$line"$'\n'
  fi
done < "$input_file"

# Write the last chapter content to a file if not empty
if [[ -n "$current_chapter_content" ]]; then
  echo "$current_chapter_content" > "$current_chapter_file"
fi

echo "Chapters have been split into individual files starting from ch01.md."
