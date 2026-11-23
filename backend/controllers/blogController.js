const Blog = require('../models/Blog');
const handleError = require('../middleware/handleError');
const toList = require('../utils/toList');

// Get all published blog posts
exports.getAllBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find({ published: true }).sort({ createdAt: -1 });
    res.json(blogs);
  } catch (err) {
    handleError(err, res);
  }
};

// Get all blog posts (including unpublished)
exports.getAllBlogsAdmin = async (req, res) => {
  try {
    const blogs = await Blog.find().sort({ createdAt: -1 });
    res.json(blogs);
  } catch (err) {
    handleError(err, res);
  }
};

// Get one blog post by ID (including unpublished)
exports.getBlogByIdAdmin = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) {
      return res.status(404).json({ msg: 'Blog post not found' });
    }
    res.json(blog);
  } catch (err) {
    handleError(err, res);
  }
};

// Get published blog post by slug
exports.getBlogBySlug = async (req, res) => {
  try {
    const blog = await Blog.findOne({ slug: req.params.slug, published: true });
    if (!blog) {
      return res.status(404).json({ msg: 'Blog post not found' });
    }
    res.json(blog);
  } catch (err) {
    handleError(err, res);
  }
};

// Create a blog post
exports.createBlog = async (req, res) => {
  try {
    const { title, slug, content, excerpt, tags, published } = req.body;
    
    const newBlog = new Blog({
      title,
      slug,
      content,
      excerpt,
      featuredImage: req.file ? `/uploads/${req.file.filename}` : '',
      tags: toList(tags),
      published: published === 'true'
    });
    
    const blog = await newBlog.save();
    res.json(blog);
  } catch (err) {
    handleError(err, res);
  }
};

// Update a blog post
exports.updateBlog = async (req, res) => {
  try {
    const { title, slug, content, excerpt, tags, published } = req.body;
    
    let blog = await Blog.findById(req.params.id);
    
    if (!blog) {
      return res.status(404).json({ msg: 'Blog post not found' });
    }
    
    const blogFields = {
      title,
      slug,
      content,
      excerpt,
      tags: toList(tags),
      published: published === 'true',
      updatedAt: Date.now()
    };
    
    if (req.file) {
      blogFields.featuredImage = `/uploads/${req.file.filename}`;
    }
    
    blog = await Blog.findByIdAndUpdate(
      req.params.id,
      { $set: blogFields },
      { new: true, runValidators: true }
    );
    
    res.json(blog);
  } catch (err) {
    handleError(err, res);
  }
};

// Delete a blog post
exports.deleteBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    
    if (!blog) {
      return res.status(404).json({ msg: 'Blog post not found' });
    }
    
    await Blog.findByIdAndDelete(req.params.id);
    
    res.json({ msg: 'Blog post removed' });
  } catch (err) {
    handleError(err, res);
  }
};