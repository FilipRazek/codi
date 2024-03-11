output_dir="output"
output_file="$output_dir/main.js"
echo "const KNOWN_WORDS = [" > "$output_file"
for line in $(cat resources/words.txt); do
  echo "\"$line\"," >> "$output_file"
done
echo "];" >> "$output_file"

cat extensionCode.js >> "$output_file"

cd "$output_dir"
web-ext run
