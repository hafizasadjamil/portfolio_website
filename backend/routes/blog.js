const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const upload = require('../middleware/upload');
const {
  getAllBlogs,
  getAllBlogsAdmin,
  getBlogByIdAdmin,
  getBlogBySlug,
  createBlog,
  updateBlog,
  deleteBlog
} = require('../controllers/blogController');

// @route   GET api/blog
// @desc    Get all blog posts
// @access  Public
router.get('/', getAllBlogs);

// @route   GET api/blog/admin
// @desc    Get all blog posts (including unpublished)
// @access  Private
router.get('/admin', auth, getAllBlogsAdmin);

// @route   GET api/blog/admin/:id
// @desc    Get one blog post (including unpublished)
// @access  Private
router.get('/admin/:id', auth, getBlogByIdAdmin);

// @route   GET api/blog/:slug
// @desc    Get blog post by slug
// @access  Public
router.get('/:slug', getBlogBySlug);

// @route   POST api/blog
// @desc    Create a blog post
// @access  Private
router.post('/', [auth, upload.single('featuredImage')], createBlog);

// @route   PUT api/blog/:id
// @desc    Update a blog post
// @access  Private
router.put('/:id', [auth, upload.single('featuredImage')], updateBlog);

// @route   DELETE api/blog/:id
// @desc    Delete a blog post
// @access  Private
router.delete('/:id', auth, deleteBlog);

module.exports = router;