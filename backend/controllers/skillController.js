const Skill = require('../models/Skill');

// Get all skills
exports.getAllSkills = async (req, res) => {
  try {
    const skills = await Skill.find().sort({ createdAt: -1 });
    res.json(skills);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// Get skills by category
exports.getSkillsByCategory = async (req, res) => {
  try {
    const skills = await Skill.find({ category: req.params.category }).sort({ createdAt: -1 });
    res.json(skills);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// Create a skill
exports.createSkill = async (req, res) => {
  try {
    const { name, category, level, description } = req.body;
    
    const newSkill = new Skill({
      name,
      category,
      icon: req.file ? `/uploads/${req.file.filename}` : '',
      level,
      description
    });
    
    const skill = await newSkill.save();
    res.json(skill);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// Update a skill
exports.updateSkill = async (req, res) => {
  try {
    const { name, category, level, description } = req.body;
    
    let skill = await Skill.findById(req.params.id);
    
    if (!skill) {
      return res.status(404).json({ msg: 'Skill not found' });
    }
    
    const skillFields = {
      name,
      category,
      level,
      description
    };
    
    if (req.file) {
      skillFields.icon = `/uploads/${req.file.filename}`;
    }
    
    skill = await Skill.findByIdAndUpdate(
      req.params.id,
      { $set: skillFields },
      { new: true }
    );
    
    res.json(skill);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// Delete a skill
exports.deleteSkill = async (req, res) => {
  try {
    const skill = await Skill.findById(req.params.id);
    
    if (!skill) {
      return res.status(404).json({ msg: 'Skill not found' });
    }
    
    await skill.remove();
    
    res.json({ msg: 'Skill removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};