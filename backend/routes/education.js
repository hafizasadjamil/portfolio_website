const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const {
  getAllEducation,
  createEducation,
  updateEducation,
  deleteEducation
} = require('../controllers/educationController');

// @route   GET api/education
// @desc    Get all education entries
// @access  Public
router.get('/', getAllEducation);

// @route   POST api/education
// @desc    Create an education entry
// @access  Private
router.post('/', auth, createEducation);

// @route   PUT api/education/:id
// @desc    Update an education entry
// @access  Private
router.put('/:id', auth, updateEducation);

// @route   DELETE api/education/:id
// @desc    Delete an education entry
// @access  Private
router.delete('/:id', auth, deleteEducation);

module.exports = router;