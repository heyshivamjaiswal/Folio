export function buildContext(matches: any[]) {
  const texts: string[] = [];
  const sources = new Set<string>();

  for (const match of matches) {
    const metadata = match.metadata;

    if (!metadata) continue;

    if (metadata.text) {
      texts.push(metadata.text);
    }

    if (metadata.url) {
      sources.add(metadata.url);
    }
  }

  return {
    context: texts.join('\n\n'),
    sources: Array.from(sources),
  };
}
