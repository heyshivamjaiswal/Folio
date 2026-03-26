import { chunkTexts } from '../../chunk/chunkText.js';
import { cleanText } from '../../utils/cleanText.js';
import { storeChunk } from '../../vector/storeChunk.js';
import { loadContent } from '../contentLoader.js';

export async function processBookmarks(
  bookmarkId: number,
  userId: string,
  url: string
) {
  const content = await loadContent(url);

  if (!content.text || content.text.trim().length === 0) {
    throw new Error(`No text extracted from article: ${url}`);
  }

  const cleaned = cleanText(content.text);

  if (cleaned.trim().length === 0) {
    throw new Error(`Text was empty after cleaning: ${url}`);
  }

  const chunkInput = await chunkTexts(cleaned);

  await storeChunk(bookmarkId, userId, chunkInput);

  return {
    title: content.title,
    chunkCount: chunkInput.length,
  };
}
