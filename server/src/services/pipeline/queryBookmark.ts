import { searchChunks } from '../searchChunks.js';
import { buildContext } from '../buildcontext.js';
import { askLLM } from '../../llm/generateAnswer.js';

export async function queryBookmark(
  question: string,
  bookmarkId: number,
  userId: string
) {
  const matches = await searchChunks(question, bookmarkId, userId);

  const { context, sources } = buildContext(matches);

  const answer = await askLLM(context, question);

  return {
    answer,
    sources,
  };
}
