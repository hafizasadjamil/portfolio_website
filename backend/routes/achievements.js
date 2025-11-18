const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const multer = require('multer');
const path = require('path');
const {
  getAllAchievements,
  createAchievement,
  updateAchievement,
  deleteAchievement
} = require('../controllers/achievementController');

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

// @route   GET api/achievements
// @desc    Get all achievements
// @access  Public
router.get('/', getAllAchievements);

// @route   POST api/achievements
// @desc    Create an achievement
// @access  Private
router.post('/', [auth, upload.single('icon')], createAchievement);

// @route   PUT api/achievements/:id
// @desc    Update an achievement
// @access  Private
router.put('/:id', [auth, upload.single('icon')], updateAchievement);

// @route   DELETE api/achievements/:id
// @desc    Delete an achievement
// @access  Private
router.delete('/:id', auth, deleteAchievement);

module.exports = router;