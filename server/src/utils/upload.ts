import multer from 'multer';

const storage = multer.memoryStorage();

const ALLOWED_MIME_TYPES = ['application/pdf'];
const MAX_FILE_SIZE = 20 * 1024 * 1024; // 20MB

export const upload = multer({
  storage,
  limits: { fileSize: MAX_FILE_SIZE },
  fileFilter: (req, file, cb) => {
    if (!ALLOWED_MIME_TYPES.includes(file.mimetype)) {
      return cb(new Error('Only PDF files are allowed'));
    }
    cb(null, true);
  },
});