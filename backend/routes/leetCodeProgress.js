const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const {
  getAllLeetCodeProgress,
  getLeetCodeProgressById,
  createLeetCodeProgress,
  updateLeetCodeProgress,
  deleteLeetCodeProgress,
  getLeetCodeStats
} = require('../controllers/leetCodeProgressController');

// @route   GET api/leetcode-progress
// @desc    Get all LeetCode progress entries
// @access  Public
router.get('/', getAllLeetCodeProgress);

// @route   GET api/leetcode-progress/stats
// @desc    Get LeetCode progress statistics
// @access  Public
router.get('/stats', getLeetCodeStats);

// @route   GET api/leetcode-progress/:id
// @desc    Get LeetCode progress by ID
// @access  Public
router.get('/:id', getLeetCodeProgressById);

// @route   POST api/leetcode-progress
// @desc    Create a LeetCode progress entry
// @access  Private
router.post('/', auth, createLeetCodeProgress);

// @route   PUT api/leetcode-progress/:id
// @desc    Update a LeetCode progress entry
// @access  Private
router.put('/:id', auth, updateLeetCodeProgress);

// @route   DELETE api/leetcode-progress/:id
// @desc    Delete a LeetCode progress entry
// @access  Private
router.delete('/:id', auth, deleteLeetCodeProgress);

module.exports = router;