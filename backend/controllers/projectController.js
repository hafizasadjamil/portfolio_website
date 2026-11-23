const Project = require('../models/Project');
const handleError = require('../middleware/handleError');
const toList = require('../utils/toList');

// Get all projects
exports.getAllProjects = async (req, res) => {
  try {
    const projects = await Project.find().sort({ createdAt: -1 });
    res.json(projects);
  } catch (err) {
    handleError(err, res);
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
    handleError(err, res);
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
      techStack: toList(techStack),
      githubUrl,
      demoUrl,
      featured: featured === 'true'
    });

    const project = await newProject.save();
    res.json(project);
  } catch (err) {
    handleError(err, res);
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
      techStack: toList(techStack),
      githubUrl,
      demoUrl,
      featured: featured === 'true'
    };

    // The admin form always sends the images to keep, so an empty list means "remove them all".
    let images = project.images.length > 0 ? project.images : [project.image].filter(Boolean);
    if (existingImages !== undefined) {
      try {
        images = JSON.parse(existingImages);
      } catch (err) {
        images = null;
      }
      if (!Array.isArray(images) || !images.every(img => typeof img === 'string')) {
        return res.status(400).json({ msg: 'existingImages must be a JSON list of paths' });
      }
    }

    const uploaded = (req.files || []).map(file => `/uploads/${file.filename}`);
    projectFields.images = [...images, ...uploaded];
    projectFields.image = projectFields.images[0] || '';

    project = await Project.findByIdAndUpdate(
      req.params.id,
      { $set: projectFields },
      { new: true, runValidators: true }
    );

    res.json(project);
  } catch (err) {
    handleError(err, res);
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
    handleError(err, res);
  }
};