const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const multer = require('multer');
const path = require('path');
const {
  getAllCourseCertifications,
  getCourseCertificationById,
  createCourseCertification,
  updateCourseCertification,
  deleteCourseCertification
} = require('../controllers/courseCertificationController');

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

// @route   GET api/course-certifications
// @desc    Get all courses and certifications
// @access  Public
router.get('/', getAllCourseCertifications);

// @route   GET api/course-certifications/:id
// @desc    Get course/certification by ID
// @access  Public
router.get('/:id', getCourseCertificationById);

// @route   POST api/course-certifications
// @desc    Create a course/certification
// @access  Private
router.post('/', [auth, upload.single('badgeImage')], createCourseCertification);

// @route   PUT api/course-certifications/:id
// @desc    Update a course/certification
// @access  Private
router.put('/:id', [auth, upload.single('badgeImage')], updateCourseCertification);

// @route   DELETE api/course-certifications/:id
// @desc    Delete a course/certification
// @access  Private
router.delete('/:id', auth, deleteCourseCertification);

module.exports = router;