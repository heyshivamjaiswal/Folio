import { HuggingFaceInferenceEmbeddings } from '@langchain/community/embeddings/hf';

export const embedding = new HuggingFaceInferenceEmbeddings({
  apiKey: process.env.HF_API_KEY,
  model: 'sentence-transformers/all-MiniLM-L6-v2',
});

export async function embedChunks(chunks: string[]) {
  const vectors = await embedding.embedDocuments(chunks);
  return vectors;
}
