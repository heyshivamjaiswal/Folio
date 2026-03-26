import type { Request, Response } from 'express';
import { prisma } from '../db/prisma.js';
import { processBookmarks } from '../services/pipeline/processBookmark.js';
import { getAuth } from '@clerk/express';

export async function addBookmark(req: Request, res: Response) {
  try {
    const { userId } = getAuth(req);
    console.log('[addBookmark] userId:', userId);

    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const { title, url, type } = req.body;

    if (!url) {
      return res.status(400).json({ error: 'url is required' });
    }

    const bookmark = await prisma.bookmark.create({
      data: {
        userId,
        url,
        title: title ?? url,
        type: type ?? 'article',
      },
    });

    processBookmarks(bookmark.id, userId, url).catch((err) => {
      console.error(
        `[ingestion] Failed for bookmark ${bookmark.id} (${url}):`,
        err.message
      );
    });

    res.json({ success: true, bookmark });
  } catch (err) {
    console.error(
      '[addBookmark error]',
      err instanceof Error ? err.message : err
    );
    res.status(500).json({ error: 'Failed to create bookmark' });
  }
}

export async function listBookmark(req: Request, res: Response) {
  try {
    const { userId } = getAuth(req);
    console.log('[listBookmark] userId:', userId);

    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const bookmarks = await prisma.bookmark.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });

    res.json({ success: true, bookmarks });
  } catch (err) {
    console.error(
      '[listBookmark error]',
      err instanceof Error ? err.message : err
    );
    res.status(500).json({ error: 'Failed to fetch bookmarks' });
  }
}
