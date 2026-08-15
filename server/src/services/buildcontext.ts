
import { buildSourceLink } from './sourceLink.js';
import { prisma } from '../db/prisma.js';
import type { SourceRef } from '../types/source.js';

export async function buildContext(matches: any[]) {
  const contextBlocks: string[] = [];
  const rawSources: Omit<SourceRef, 'title' | 'label' | 'link'>[] = [];

  for (const match of matches) {
    const metadata = match.metadata;
    if (!metadata?.text) continue;

    const sourceType = metadata.sourceType ?? 'web';

    let label = '';
    if (sourceType === 'pdf' && metadata.page) {
      label = `[PDF, page ${metadata.page}]`;
    } else if (sourceType === 'youtube' && metadata.startSeconds !== undefined) {
      const mins = Math.floor(metadata.startSeconds / 60);
      const secs = metadata.startSeconds % 60;
      label = `[YouTube, ${mins}:${secs.toString().padStart(2, '0')}]`;
    } else if (sourceType === 'web') {
      label = `[Web article]`;
    }

    contextBlocks.push(`${label}\n${metadata.text}`);

    rawSources.push({
      type: sourceType,
      bookmarkId: metadata.bookmarkId,
      url: metadata.sourceUrl,
      page: metadata.page,
      startSeconds: metadata.startSeconds,
    });
  }

  const seen = new Set<string>();
  const deduped = rawSources.filter((s) => {
    const key = `${s.bookmarkId}-${s.page ?? ''}-${s.startSeconds ?? ''}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });

  const bookmarkIds = [...new Set(deduped.map((s) => s.bookmarkId).filter(Boolean))] as number[];
  
  console.log('bookmarkIds:', bookmarkIds, bookmarkIds.map(id => typeof id));

  type BookmarkTitleRow = { id: number; title: string | null };

  const bookmarks: BookmarkTitleRow[] = bookmarkIds.length
    ? await prisma.bookmark.findMany({
      where: { id: { in: bookmarkIds } },
      select: { id: true, title: true },
    })
    : [];

  const titleMap = new Map<number, string | null>(
    bookmarks.map((b): [number, string | null] => [b.id, b.title])
  );

  const sources: SourceRef[] = deduped.map((s) => {
    const title = s.bookmarkId ? titleMap.get(s.bookmarkId) ?? undefined : undefined;
    return {
      ...s,
      title: title ?? undefined,
      ...buildSourceLink(s as SourceRef),
    };
  });

  return {
    context: contextBlocks.join('\n\n---\n\n'),
    sources,
  };
}