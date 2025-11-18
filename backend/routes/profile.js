const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const multer = require('multer');
const path = require('path');
const {
  getProfile,
  updateProfile
} = require('../controllers/profileController');

// Set up multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

// @route   GET api/profile
// @desc    Get profile data
// @access  Public
router.get('/', getProfile);

// @route   PUT api/profile
// @desc    Update profile data
// @access  Private
router.put('/', [auth, upload.single('profileImage')], updateProfile);

module.exports = router;