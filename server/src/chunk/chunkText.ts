import { RecursiveCharacterTextSplitter } from '@langchain/textsplitters';

export async function chunkTexts(text: string) {
  const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: 800,
    chunkOverlap: 120,
  });

  const chunks = await splitter.splitText(text);

  return chunks;
}
