const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const multer = require('multer');
const path = require('path');
const {
  getAllSkills,
  getSkillsByCategory,
  createSkill,
  updateSkill,
  deleteSkill
} = require('../controllers/skillController');

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

// @route   GET api/skills
// @desc    Get all skills
// @access  Public
router.get('/', getAllSkills);

// @route   GET api/skills/category/:category
// @desc    Get skills by category
// @access  Public
router.get('/category/:category', getSkillsByCategory);

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