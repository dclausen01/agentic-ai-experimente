#!/bin/sh

# List all .js files in the src directory
JS_FILES=($(ls src/*.js))

# Check if any .js files were found
if [ ${#JS_FILES[@]} -eq 0 ]; then
  echo "No .js files found in the src directory."
  exit 1
fi

# Display the menu and prompt for selection
echo "Select a file to run:"
for i in "${!JS_FILES[@]}"; do
  echo "$((i+1))) ${JS_FILES[i]}"
done
read -p "Enter your choice: " choice

# Validate the input
if ! [[ $choice =~ ^[0-9]+$ ]] || [ $choice -lt 1 ] || [ $choice -gt ${#JS_FILES[@]} ]; then
  echo "Invalid selection."
  exit 1
fi

# Start the selected .js file
node "${JS_FILES[$((choice-1))]}"
