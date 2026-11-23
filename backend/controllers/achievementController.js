const Achievement = require('../models/Achievement');
const handleError = require('../middleware/handleError');

// Get all achievements
exports.getAllAchievements = async (req, res) => {
  try {
    const achievements = await Achievement.find().sort({ date: -1 });
    res.json(achievements);
  } catch (err) {
    handleError(err, res);
  }
};

// Get achievement by ID
exports.getAchievementById = async (req, res) => {
  try {
    const item = await Achievement.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ msg: 'Achievement not found' });
    }
    res.json(item);
  } catch (err) {
    handleError(err, res);
  }
};

// Create an achievement
exports.createAchievement = async (req, res) => {
  try {
    const { title, description, date } = req.body;
    
    const newAchievement = new Achievement({
      title,
      description,
      icon: req.file ? `/uploads/${req.file.filename}` : '',
      date
    });
    
    const achievement = await newAchievement.save();
    res.json(achievement);
  } catch (err) {
    handleError(err, res);
  }
};

// Update an achievement
exports.updateAchievement = async (req, res) => {
  try {
    const { title, description, date } = req.body;
    
    let achievement = await Achievement.findById(req.params.id);
    
    if (!achievement) {
      return res.status(404).json({ msg: 'Achievement not found' });
    }
    
    const achievementFields = {
      title,
      description,
      date
    };
    
    if (req.file) {
      achievementFields.icon = `/uploads/${req.file.filename}`;
    }
    
    achievement = await Achievement.findByIdAndUpdate(
      req.params.id,
      { $set: achievementFields },
      { new: true, runValidators: true }
    );
    
    res.json(achievement);
  } catch (err) {
    handleError(err, res);
  }
};

// Delete an achievement
exports.deleteAchievement = async (req, res) => {
  try {
    const achievement = await Achievement.findById(req.params.id);
    
    if (!achievement) {
      return res.status(404).json({ msg: 'Achievement not found' });
    }
    
    await Achievement.findByIdAndDelete(req.params.id);
    
    res.json({ msg: 'Achievement removed' });
  } catch (err) {
    handleError(err, res);
  }
};