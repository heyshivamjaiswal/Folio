import type { Request, Response } from 'express';
import { processPDF } from '../services/pipeline/pdfProcess.js';
import { getAuth } from '@clerk/express';

export async function uploadPDF(req: Request, res: Response) {
  try {
    const { userId } = getAuth(req);
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const file = req.file;

    if (!file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    console.log('[uploadPDF] file:', file.path, 'userId:', userId);

    const result = await processPDF(file.path, userId);

    res.json({ success: true, result });
  } catch (err) {
    console.error(
      '[uploadPDF error]',
      err instanceof Error ? err.message : err
    );
    res.status(500).json({ error: 'PDF processing failed' });
  }
}
