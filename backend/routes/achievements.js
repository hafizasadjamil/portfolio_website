const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const upload = require('../middleware/upload');
const {
  getAllAchievements,
  getAchievementById,
  createAchievement,
  updateAchievement,
  deleteAchievement
} = require('../controllers/achievementController');

// @route   GET api/achievements
// @desc    Get all achievements
// @access  Public
router.get('/', getAllAchievements);

// @route   GET api/achievements/:id
// @desc    Get one entry by ID
// @access  Public
router.get('/:id', getAchievementById);

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