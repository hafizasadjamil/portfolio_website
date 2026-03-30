const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { getAllDemos, createDemo, updateDemo, deleteDemo } = require('../controllers/demoController');
const auth = require('../middleware/auth');

// Multer storage for demo icons
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, `demo-${Date.now()}${path.extname(file.originalname)}`);
  },
});

const upload = multer({ storage: storage });

router.get('/', getAllDemos);
router.post('/', auth, upload.single('icon'), createDemo);
router.put('/:id', auth, upload.single('icon'), updateDemo);
router.delete('/:id', auth, deleteDemo);

module.exports = router;
