import { embedding } from '../embeddings/embed.js';
import { index } from './pinecone.js';

type ChunkInput = {
  text: string;
  page?: number;
  startSeconds?: number;
};

type StoreChunkOptions = {
  sourceType: 'pdf' | 'web' | 'youtube';
  sourceUrl?: string;
};

export async function storeChunk( 
  bookmarkId: number,
  userId: string,
  chunks: ChunkInput[],
  options: StoreChunkOptions
) {
  const texts = chunks.map((c) => c.text);
  const vectors = await embedding.embedDocuments(texts);

  const timestamp = Date.now();

  const records = chunks.map((chunk, i) => {
    const metadata: Record<string, string | number | boolean> = {
      bookmarkId,
      userId,
      text: chunk.text,
      sourceType: options.sourceType,
      chunkIndex: i,
    };

    if (options.sourceUrl) metadata.sourceUrl = options.sourceUrl;
    if (chunk.page !== undefined) metadata.page = chunk.page;
    if (chunk.startSeconds !== undefined)
      metadata.startSeconds = chunk.startSeconds;

    return {
      id: `${bookmarkId}-${timestamp}-${i}`,
      values: vectors[i],
      metadata,
    };
  });

  console.log('chunks:', chunks.length);
  console.log('Vectors:', records.length);

  await index.namespace(userId).upsert({ records });

  console.log('vector stored in pinecone');
}