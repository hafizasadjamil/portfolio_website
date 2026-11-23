const Skill = require('../models/Skill');
const handleError = require('../middleware/handleError');

// Get all skills
exports.getAllSkills = async (req, res) => {
  try {
    const skills = await Skill.find().sort({ createdAt: -1 });
    res.json(skills);
  } catch (err) {
    handleError(err, res);
  }
};

// Get skills by category
exports.getSkillsByCategory = async (req, res) => {
  try {
    const skills = await Skill.find({ category: req.params.category }).sort({ createdAt: -1 });
    res.json(skills);
  } catch (err) {
    handleError(err, res);
  }
};

// Get skill by ID
exports.getSkillById = async (req, res) => {
  try {
    const item = await Skill.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ msg: 'Skill not found' });
    }
    res.json(item);
  } catch (err) {
    handleError(err, res);
  }
};

// Create a skill
exports.createSkill = async (req, res) => {
  try {
    const { name, category, level, description, highlight, iconUrl } = req.body;

    let icon = '';
    if (req.file) {
      icon = `/uploads/${req.file.filename}`;
    } else if (iconUrl) {
      icon = iconUrl;
    }

    const newSkill = new Skill({
      name,
      category,
      icon,
      level,
      description,
      highlight: highlight === 'true' || highlight === true
    });

    const skill = await newSkill.save();
    res.json(skill);
  } catch (err) {
    handleError(err, res);
  }
};

// Update a skill
exports.updateSkill = async (req, res) => {
  try {
    const { name, category, level, description, highlight, iconUrl } = req.body;

    let skill = await Skill.findById(req.params.id);

    if (!skill) {
      return res.status(404).json({ msg: 'Skill not found' });
    }

    const skillFields = {
      name,
      category,
      level,
      description,
      highlight: highlight === 'true' || highlight === true
    };

    if (req.file) {
      skillFields.icon = `/uploads/${req.file.filename}`;
    } else if (iconUrl) {
      skillFields.icon = iconUrl;
    }

    skill = await Skill.findByIdAndUpdate(
      req.params.id,
      { $set: skillFields },
      { new: true, runValidators: true }
    );

    res.json(skill);
  } catch (err) {
    handleError(err, res);
  }
};

// Delete a skill
exports.deleteSkill = async (req, res) => {
  try {
    const skill = await Skill.findById(req.params.id);

    if (!skill) {
      return res.status(404).json({ msg: 'Skill not found' });
    }

    await Skill.findByIdAndDelete(req.params.id);

    res.json({ msg: 'Skill removed' });
  } catch (err) {
    handleError(err, res);
  }
};