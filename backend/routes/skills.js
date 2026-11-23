const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const upload = require('../middleware/upload');
const {
  getAllSkills,
  getSkillsByCategory,
  getSkillById,
  createSkill,
  updateSkill,
  deleteSkill
} = require('../controllers/skillController');

// @route   GET api/skills
// @desc    Get all skills
// @access  Public
router.get('/', getAllSkills);

// @route   GET api/skills/category/:category
// @desc    Get skills by category
// @access  Public
router.get('/category/:category', getSkillsByCategory);

// @route   GET api/skills/:id
// @desc    Get one entry by ID
// @access  Public
router.get('/:id', getSkillById);

// @route   POST api/skills
// @desc    Create a skill
// @access  Private
router.post('/', [auth, upload.single('icon')], createSkill);

// @route   PUT api/skills/:id
// @desc    Update a skill
// @access  Private
router.put('/:id', [auth, upload.single('icon')], updateSkill);

// @route   DELETE api/skills/:id
// @desc    Delete a skill
// @access  Private
router.delete('/:id', auth, deleteSkill);

module.exports = router;