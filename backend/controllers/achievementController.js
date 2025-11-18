const Achievement = require('../models/Achievement');

// Get all achievements
exports.getAllAchievements = async (req, res) => {
  try {
    const achievements = await Achievement.find().sort({ date: -1 });
    res.json(achievements);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
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
    console.error(err.message);
    res.status(500).send('Server Error');
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
      { new: true }
    );
    
    res.json(achievement);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// Delete an achievement
exports.deleteAchievement = async (req, res) => {
  try {
    const achievement = await Achievement.findById(req.params.id);
    
    if (!achievement) {
      return res.status(404).json({ msg: 'Achievement not found' });
    }
    
    await achievement.remove();
    
    res.json({ msg: 'Achievement removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};