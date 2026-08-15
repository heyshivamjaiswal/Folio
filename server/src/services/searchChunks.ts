
import { embedding } from '../embeddings/embed.js';
import { index } from '../vector/pinecone.js';

export async function searchChunks(
  question: string,
  bookmarkId: number,
  userId: string,
  topK: number = 5
) {
  const queryVector = await embedding.embedQuery(question);

  const result = await index.namespace(userId).query({
    vector: queryVector,
    topK,
    includeMetadata: true,
    filter: {
      bookmarkId: { $eq: bookmarkId },
    },
  });

  console.log(
    '[searchChunks] bookmarkId:',
    bookmarkId,
    'matches:',
    result.matches.length
  );

  return result.matches;
}

export async function searchAllChunks(question: string, userId: string, topK: number = 8) {
  const queryVector = await embedding.embedQuery(question);

  const result = await index.namespace(userId).query({
    vector: queryVector,
    topK,
    includeMetadata: true,
    // no bookmarkId filter — search across everything the user has saved
  });

  console.log('[searchAllChunks] userId:', userId, 'matches:', result.matches.length);

  return result.matches;
}