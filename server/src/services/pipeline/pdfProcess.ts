import { chunkTexts } from '../../chunk/chunkText.js';
import { cleanText } from '../../utils/cleanText.js';
import { storeChunk } from '../../vector/storeChunk.js';
import { loadPDF } from '../pdf.services.js';
import { uploadPDFToSupabase } from '../storage/supabaseStorage.js';
import { prisma } from '../../db/prisma.js';

export async function processPDF(
  buffer: Buffer,
  filename: string,
  userId: string
) {
  // 1. Extract text per-page BEFORE uploading, so we fail fast if the PDF is unreadable
  const { title, pages } = await loadPDF(buffer, filename);

  // 2. Upload the original file to Supabase for storage/reference
  const storagePath = await uploadPDFToSupabase(buffer, userId, filename);

  // 3. Create bookmark record with pending status
  const bookmark = await prisma.bookmark.create({
    data: {
      userId,
      title,
      type: 'pdf',
      status: 'processing',
      storagePath,
    },
  });

  try {
    // 4. Chunk per page, keeping page number as metadata
    const chunksWithPages: { text: string; page: number }[] = [];

    for (let i = 0; i < pages.length; i++) {
      const cleaned = cleanText(pages[i]);
      if (!cleaned) continue;

      const pageChunks = await chunkTexts(cleaned);
      for (const chunk of pageChunks) {
        chunksWithPages.push({ text: chunk, page: i + 1 });
      }
    }

    if (chunksWithPages.length === 0) {
      throw new Error('No extractable text found in PDF');
    }

    await storeChunk(bookmark.id, userId, chunksWithPages, {
      sourceType: 'pdf',
    });

    await prisma.bookmark.update({
      where: { id: bookmark.id },
      data: { status: 'ready' },
    });

    return {
      bookmark,
      chunkCount: chunksWithPages.length,
    };
  } catch (err) {
    await prisma.bookmark.update({
      where: { id: bookmark.id },
      data: {
        status: 'failed',
        errorMessage: err instanceof Error ? err.message : 'Unknown error',
      },
    });
    throw err;
  }
}