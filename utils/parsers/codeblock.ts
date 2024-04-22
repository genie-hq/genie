export function extractCodeContent(text: string): string | null {
  const pattern = /`{3}(?:(\w+)\n)?(.*?)`{3}/s;
  const match = text.match(pattern);

  if (match) {
    return match[2].trim(); // Access the second group (the code content)
  } else {
    return null; // Indicate no code block found
  }
}
