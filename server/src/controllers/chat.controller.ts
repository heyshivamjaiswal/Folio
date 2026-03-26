import type { Request, Response } from 'express';
import { searchChunks } from '../services/searchChunks.js';
import { buildContext } from '../services/buildcontext.js';
import { askLLM } from '../llm/generateAnswer.js';
import { getAuth } from '@clerk/express';

export async function chatWithBookmark(req: Request, res: Response) {
  try {
    const { userId } = getAuth(req);

    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const { question, bookmarkId } = req.body;

    if (!question || !bookmarkId) {
      return res.status(400).json({
        error: 'question and bookmarkId are required',
      });
    }

    const bookmarkIdNum = Number(bookmarkId);
    if (isNaN(bookmarkIdNum)) {
      return res.status(400).json({ error: 'Invalid bookmarkId' });
    }

    const matches = await searchChunks(question, bookmarkIdNum, userId);
    const { context, sources } = buildContext(matches);
    const answer = await askLLM(context, question);

    res.json({ success: true, answer, sources });
  } catch (err) {
    console.error('[chat error]', err instanceof Error ? err.message : err);
    res.status(500).json({ error: 'chat failed' });
  }
}
