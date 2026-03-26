import { embedding } from '../embeddings/embed.js';
import { index } from './pinecone.js';

export async function storeChunk(
  bookmarkId: number,
  userId: string,
  chunks: string[]
) {
  const vectors = await embedding.embedDocuments(chunks);

  const timestamp = Date.now();

  const records = chunks.map((chunk, i) => ({
    id: `${bookmarkId}-${timestamp}-${i}`,
    values: vectors[i],
    metadata: {
      bookmarkId,
      userId,
      text: chunk,
    },
  }));

  console.log('chunks:', chunks.length);
  console.log('Vectors:', records.length);

  await index.namespace(userId).upsert({ records });

  console.log('vector stored in pinecone');
}
