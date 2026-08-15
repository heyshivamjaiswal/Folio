
import express from 'express';
import {
  addBookmark,
  listBookmark,
  getBookmark,
  deleteBookmark,
  getBookmarkPdfUrl,
} from '../controllers/bookmark.controller.js';

const router = express.Router();

router.post('/bookmarks', addBookmark);
router.get('/bookmarks', listBookmark);
router.get('/bookmarks/:id', getBookmark);
router.delete('/bookmarks/:id', deleteBookmark);
router.get('/bookmarks/:id/pdf-url', getBookmarkPdfUrl);

export default router;