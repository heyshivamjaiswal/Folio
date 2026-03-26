import express from 'express';
import {
  addBookmark,
  listBookmark,
} from '../controllers/bookmark.controller.js';

const router = express.Router();

router.post('/bookmarks', addBookmark);
router.get('/bookmarks', listBookmark);

export default router;
