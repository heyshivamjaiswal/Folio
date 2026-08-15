
import type { Request, Response } from 'express';
import { answerQuestion } from '../services/agent/answerQuestion.js';
import { getAuth } from '@clerk/express';

export async function chatWithBookmark(req: Request, res: Response) {
  try {
    const { userId } = getAuth(req);
    if (!userId) return res.status(401).json({ error: 'Unauthorized' });

    const { question, bookmarkId, mode } = req.body;

    if (!question) {
      return res.status(400).json({ error: 'question is required' });
    }

    const chatMode = mode === 'ask-anything' ? 'ask-anything' : 'narrow';

    if (chatMode === 'narrow' && !bookmarkId) {
      return res.status(400).json({ error: 'bookmarkId is required in narrow mode' });
    }

    let bookmarkIdNum: number | undefined;
    if (chatMode === 'narrow') {
      bookmarkIdNum = Number(bookmarkId);
      if (isNaN(bookmarkIdNum)) {
        return res.status(400).json({ error: 'Invalid bookmarkId' });
      }
    }

    const result = await answerQuestion({
      question,
      userId,
      mode: chatMode,
      bookmarkId: bookmarkIdNum,
    });

    res.json({ success: true, ...result });
  } catch (err) {
    console.error('[chat error]', err instanceof Error ? err.message : err);
    res.status(500).json({ error: 'chat failed' });
  }
}