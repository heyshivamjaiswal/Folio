import { Router } from 'express';
import { chatWithBookmark } from '../controllers/chat.controller.js';

const router = Router();

router.post('/chat', chatWithBookmark);

export default router;
