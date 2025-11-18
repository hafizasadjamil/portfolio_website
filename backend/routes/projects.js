const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const multer = require('multer');
const path = require('path');
const {
  getAllProjects,
  getProjectById,
  createProject,
  updateProject,
  deleteProject
} = require('../controllers/projectController');

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

// @route   GET api/projects
// @desc    Get all projects
// @access  Public
router.get('/', getAllProjects);

// @route   GET api/projects/:id
// @desc    Get project by ID
// @access  Public
router.get('/:id', getProjectById);

// @route   POST api/projects
// @desc    Create a project
// @access  Private
router.post('/', [auth, upload.single('image')], createProject);

// @route   PUT api/projects/:id
// @desc    Update a project
// @access  Private
router.put('/:id', [auth, upload.single('image')], updateProject);

// @route   DELETE api/projects/:id
// @desc    Delete a project
// @access  Private
router.delete('/:id', auth, deleteProject);

module.exports = router;