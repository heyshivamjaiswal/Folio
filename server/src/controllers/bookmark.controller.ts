import type { Request, Response } from 'express';
import { prisma } from '../db/prisma.js';
import { processBookmarks } from '../services/pipeline/processBookmark.js';
import { getAuth } from '@clerk/express';
import { index } from '../vector/pinecone.js';
import { deletePDFFromSupabase , getSignedUrl} from '../services/storage/supabaseStorage.js';

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
    if (!userId) return res.status(401).json({ error: 'Unauthorized' });

    const page = Math.max(1, Number(req.query.page) || 1);
    const limit = Math.min(50, Math.max(1, Number(req.query.limit) || 20));
    const skip = (page - 1) * limit;

    const [bookmarks, total] = await Promise.all([
      prisma.bookmark.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.bookmark.count({ where: { userId } }),
    ]);

    res.json({
      success: true,
      bookmarks,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (err) {
    console.error('[listBookmark error]', err);
    res.status(500).json({ error: 'Failed to fetch bookmarks' });
  }
}

// export async function listBookmark(req: Request, res: Response) {
//   try {
//     const { userId } = getAuth(req);

//     console.log("userId =", userId);

//     const rows = await prisma.$queryRaw`
//       SELECT * FROM "Bookmark";
//     `;

//     console.log(rows);

//     res.json(rows);
//   } catch (e) {
//     console.error(e);
//     res.status(500).json(e);
//   }
// }


export async function deleteBookmark(req: Request, res: Response) {
  try {
    const { userId } = getAuth(req);
    if (!userId) return res.status(401).json({ error: 'Unauthorized' });

    const id = Number(req.params.id);
    if (isNaN(id)) return res.status(400).json({ error: 'Invalid id' });

    const bookmark = await prisma.bookmark.findFirst({ where: { id, userId } });
    if (!bookmark) return res.status(404).json({ error: 'Not found' });

    // 1. Delete vectors from Pinecone (filter by bookmarkId, scoped to user namespace)
    await index.namespace(userId).deleteMany({
      filter: { bookmarkId: { $eq: id } },
    });

    // 2. Delete file from Supabase if it was a PDF
    if (bookmark.storagePath) {
      await deletePDFFromSupabase(bookmark.storagePath);
    }

    // 3. Delete the DB row last — if this fails, at least storage/vectors are already gone
    await prisma.bookmark.delete({ where: { id } });

    res.json({ success: true });
  } catch (err) {
    console.error('[deleteBookmark error]', err instanceof Error ? err.message : err);
    res.status(500).json({ error: 'Failed to delete bookmark' });
  }
}



export async function getBookmarkPdfUrl(req: Request, res: Response) {
  try {
    const { userId } = getAuth(req);
    if (!userId) return res.status(401).json({ error: 'Unauthorized' });

    const id = Number(req.params.id);
    if (isNaN(id)) return res.status(400).json({ error: 'Invalid id' });

    const bookmark = await prisma.bookmark.findFirst({ where: { id, userId } });

    if (!bookmark) {
      return res.status(404).json({ error: 'Not found' });
    }

    if (bookmark.type !== 'pdf' || !bookmark.storagePath) {
      return res.status(400).json({ error: 'This bookmark has no associated PDF file' });
    }

    if (bookmark.status !== 'ready') {
      return res.status(409).json({
        error: `PDF is not ready (status: ${bookmark.status})`,
      });
    }

    const signedUrl = await getSignedUrl(bookmark.storagePath, 3600);

    res.json({ success: true, url: signedUrl, expiresIn: 3600 });
  } catch (err) {
    console.error('[getBookmarkPdfUrl error]', err instanceof Error ? err.message : err);
    res.status(500).json({ error: 'Failed to generate PDF url' });
  }
}



export async function getBookmark(req: Request, res: Response) {
  try {
    const { userId } = getAuth(req);
    if (!userId) return res.status(401).json({ error: 'Unauthorized' });

    const id = Number(req.params.id);
    if (isNaN(id)) return res.status(400).json({ error: 'Invalid id' });

    const bookmark = await prisma.bookmark.findFirst({ where: { id, userId } });

    if (!bookmark) {
      return res.status(404).json({ error: 'Not found' });
    }

    res.json({ success: true, bookmark });
  } catch (err) {
    console.error('[getBookmark error]', err instanceof Error ? err.message : err);
    res.status(500).json({ error: 'Failed to fetch bookmark' });
  }
}


