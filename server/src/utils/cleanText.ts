
export function cleanText(text: string): string {
  return text
    .replace(/\r/g, '')
    .replace(/[ \t]+/g, ' ')        // collapse horizontal whitespace only
    .replace(/\n{3,}/g, '\n\n')     // cap excessive blank lines, keep paragraph breaks
    .trim();
}