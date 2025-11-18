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
    
    const newProject = new Project({
      title,
      description,
      image: req.file ? `/uploads/${req.file.filename}` : '',
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
    const { title, description, techStack, githubUrl, demoUrl, featured } = req.body;
    
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
    
    if (req.file) {
      projectFields.image = `/uploads/${req.file.filename}`;
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
    
    await project.remove();
    
    res.json({ msg: 'Project removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};