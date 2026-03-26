import { pinecone } from './pinecone.js';

export async function initializeIndex() {
  const indexName = process.env.PINECONE_INDEX!;

  const indexes = await pinecone.listIndexes();

  const exists = indexes.indexes?.find((i) => i.name === indexName);

  if (!exists) {
    await pinecone.createIndex({
      name: indexName,
      dimension: 384,
      metric: 'cosine',
      spec: {
        serverless: {
          cloud: 'aws',
          region: 'us-east-1',
        },
      },
    });

    console.log('Pinecone index created');
  } else {
    console.log(' Pinecone index already exists');
  }
}
