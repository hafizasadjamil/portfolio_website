const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const upload = require('../middleware/upload');
const {
  getProfile,
  updateProfile
} = require('../controllers/profileController');

// @route   GET api/profile
// @desc    Get profile data
// @access  Public
router.get('/', getProfile);

// @route   PUT api/profile
// @desc    Update profile data
// @access  Private
router.put('/', [auth, upload.single('profileImage')], updateProfile);

module.exports = router;