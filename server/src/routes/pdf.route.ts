import { Router } from 'express';
import { upload } from '../utils/upload.js';
import { uploadPDF } from '../controllers/pdf.controller.js';

const router = Router();

router.post('/upload-pdf', upload.single('file'), uploadPDF);

export default router;
