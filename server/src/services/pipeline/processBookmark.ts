import { chunkTexts } from '../../chunk/chunkText.js';
import { cleanText } from '../../utils/cleanText.js';
import { storeChunk } from '../../vector/storeChunk.js';
import { loadContent } from '../contentLoader.js';
import { detectSource } from '../detectSource.js';
import { prisma } from '../../db/prisma.js';

export async function processBookmarks(
  bookmarkId: number,
  userId: string,
  url: string
) {
  try {
    const type = detectSource(url);
    const content = await loadContent(url);

    await prisma.bookmark.update({
      where: { id: bookmarkId },
      data: { type, title: content.title, status: 'processing' },
    });

    // --- YouTube branch ---
    if ('segments' in content) {
      const chunksWithTimestamps: { text: string; startSeconds: number }[] = [];

      for (const seg of content.segments) {
        const cleaned = cleanText(seg.text);
        if (!cleaned) continue;
        chunksWithTimestamps.push({ text: cleaned, startSeconds: seg.startSeconds });
      }

      if (!chunksWithTimestamps.length) {
        throw new Error('No usable transcript content after cleaning');
      }

      await storeChunk(bookmarkId, userId, chunksWithTimestamps, {
        sourceType: 'youtube',
        sourceUrl: url,
      });

      await prisma.bookmark.update({ where: { id: bookmarkId }, data: { status: 'ready' } });
      return { title: content.title, chunkCount: chunksWithTimestamps.length };
    }

    // --- Web / plain text branch (only remaining shape) ---
    if (!content.text || !content.text.trim()) {
      throw new Error(`No text extracted from: ${url}`);
    }

    const cleaned = cleanText(content.text);
    if (!cleaned.trim()) {
      throw new Error(`Text was empty after cleaning: ${url}`);
    }

    const rawChunks = await chunkTexts(cleaned);
    const chunkInput = rawChunks.map((text) => ({ text }));

    await storeChunk(bookmarkId, userId, chunkInput, {
      sourceType: 'web',
      sourceUrl: url,
    });

    await prisma.bookmark.update({ where: { id: bookmarkId }, data: { status: 'ready' } });
    return { title: content.title, chunkCount: chunkInput.length };
  } catch (err) {
    await prisma.bookmark.update({
      where: { id: bookmarkId },
      data: {
        status: 'failed',
        errorMessage: err instanceof Error ? err.message : 'Unknown error',
      },
    });
    throw err;
  }
}