export function detectSource(input: string) {
  if (input.includes('youtube.com') || input.includes('youtu.be')) {
    return 'youtube';
  }

  if (input.includes('.pdf')) {
    return 'pdf';
  }

  if (input.startsWith('http')) {
    return 'web';
  }

  return 'text';
}
