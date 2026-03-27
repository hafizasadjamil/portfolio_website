const Project = require('../models/Project');

// Get all projects
exports.getAllProjects = async (req, res) => {
  try {
    const projects = await Project.find().sort({ createdAt: -1 });
    res.json(projects);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// Get project by ID
exports.getProjectById = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ msg: 'Project not found' });
    }
    res.json(project);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// Create a project
exports.createProject = async (req, res) => {
  try {
    const { title, description, techStack, githubUrl, demoUrl, featured } = req.body;

    let images = [];
    if (req.files && req.files.length > 0) {
      images = req.files.map(file => `/uploads/${file.filename}`);
    }

    const newProject = new Project({
      title,
      description,
      image: images.length > 0 ? images[0] : '',
      images: images,
      techStack: techStack.split(',').map(item => item.trim()),
      githubUrl,
      demoUrl,
      featured: featured === 'true'
    });

    const project = await newProject.save();
    res.json(project);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// Update a project
exports.updateProject = async (req, res) => {
  try {
    const { title, description, techStack, githubUrl, demoUrl, featured, existingImages } = req.body;

    let project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ msg: 'Project not found' });
    }

    const projectFields = {
      title,
      description,
      techStack: techStack.split(',').map(item => item.trim()),
      githubUrl,
      demoUrl,
      featured: featured === 'true'
    };

    let updatedImages = [];

    // Parse existing images if any
    if (existingImages) {
      try {
        updatedImages = JSON.parse(existingImages);
      } catch (e) {
        console.error('Error parsing existingImages:', e);
      }
    }

    // Add newly uploaded images
    if (req.files && req.files.length > 0) {
      const newImages = req.files.map(file => `/uploads/${file.filename}`);
      updatedImages = [...updatedImages, ...newImages];
    }

    if (updatedImages.length > 0) {
      projectFields.images = updatedImages;
      projectFields.image = updatedImages[0];
    }

    project = await Project.findByIdAndUpdate(
      req.params.id,
      { $set: projectFields },
      { new: true }
    );

    res.json(project);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// Delete a project
exports.deleteProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ msg: 'Project not found' });
    }

    await Project.findByIdAndDelete(req.params.id);

    res.json({ msg: 'Project removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};