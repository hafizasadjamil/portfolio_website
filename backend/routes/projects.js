const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const upload = require('../middleware/upload');
const {
  getAllProjects,
  getProjectById,
  createProject,
  updateProject,
  deleteProject
} = require('../controllers/projectController');

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
router.post('/', [auth, upload.array('images', 10)], createProject);

// @route   PUT api/projects/:id
// @desc    Update a project
// @access  Private
router.put('/:id', [auth, upload.array('images', 10)], updateProject);

// @route   DELETE api/projects/:id
// @desc    Delete a project
// @access  Private
router.delete('/:id', auth, deleteProject);

module.exports = router;