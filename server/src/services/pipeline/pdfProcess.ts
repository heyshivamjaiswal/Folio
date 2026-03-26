import { chunkTexts } from '../../chunk/chunkText.js';
import { cleanText } from '../../utils/cleanText.js';
import { storeChunk } from '../../vector/storeChunk.js';
import { loadPDF } from '../pdf.services.js';
import { prisma } from '../../db/prisma.js';

export async function processPDF(filePath: string, userId: string) {
  const text = await loadPDF(filePath);

  const cleaned = await cleanText(text.text);

  const chunks = await chunkTexts(cleaned);

  // Create bookmark record in DB
  const bookmark = await prisma.bookmark.create({
    data: {
      userId,
      title: text.title || 'PDF Document',
      type: 'pdf',
    },
  });

  await storeChunk(bookmark.id, userId, chunks);

  return {
    bookmark,
    chunkCount: chunks.length,
  };
}
