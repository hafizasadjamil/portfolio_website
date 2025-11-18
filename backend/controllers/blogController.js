const Blog = require('../models/Blog');

// Get all published blog posts
exports.getAllBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find({ published: true }).sort({ createdAt: -1 });
    res.json(blogs);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// Get all blog posts (including unpublished)
exports.getAllBlogsAdmin = async (req, res) => {
  try {
    const blogs = await Blog.find().sort({ createdAt: -1 });
    res.json(blogs);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// Get blog post by slug
exports.getBlogBySlug = async (req, res) => {
  try {
    const blog = await Blog.findOne({ slug: req.params.slug });
    if (!blog) {
      return res.status(404).json({ msg: 'Blog post not found' });
    }
    res.json(blog);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
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
      tags: tags ? tags.split(',').map(item => item.trim()) : [],
      published: published === 'true'
    });
    
    const blog = await newBlog.save();
    res.json(blog);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
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
      tags: tags ? tags.split(',').map(item => item.trim()) : [],
      published: published === 'true',
      updatedAt: Date.now()
    };
    
    if (req.file) {
      blogFields.featuredImage = `/uploads/${req.file.filename}`;
    }
    
    blog = await Blog.findByIdAndUpdate(
      req.params.id,
      { $set: blogFields },
      { new: true }
    );
    
    res.json(blog);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// Delete a blog post
exports.deleteBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    
    if (!blog) {
      return res.status(404).json({ msg: 'Blog post not found' });
    }
    
    await blog.remove();
    
    res.json({ msg: 'Blog post removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};