const crypto = require('crypto');
const fs = require('fs');
const multer = require('multer');
const { UPLOADS_DIR } = require('../config/uploads');

// SVG is left out on purpose: an SVG opened directly can run scripts.
const EXTENSIONS = {
  'image/jpeg': '.jpg',
  'image/png': '.png',
  'image/webp': '.webp',
  'image/gif': '.gif',
  'image/avif': '.avif',
};

fs.mkdirSync(UPLOADS_DIR, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, UPLOADS_DIR),
  filename: (req, file, cb) => cb(null, `${Date.now()}-${crypto.randomUUID()}${EXTENSIONS[file.mimetype]}`),
});

module.exports = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024, files: 10 },
  fileFilter: (req, file, cb) => {
    if (EXTENSIONS[file.mimetype]) return cb(null, true);
    const err = new Error('Only JPEG, PNG, WebP, GIF or AVIF images are allowed');
    err.status = 400;
    cb(err);
  },
});
