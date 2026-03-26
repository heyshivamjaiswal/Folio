export function cleanText(text: string): string {
  return text
    .replace(/\r/g, '')
    .replace(/\n{2,}/g, '\n')
    .replace(/\s+/g, ' ')
    .trim();
}
