const Education = require('../models/Education');

// Get all education entries
exports.getAllEducation = async (req, res) => {
  try {
    const education = await Education.find().sort({ startDate: -1 });
    res.json(education);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// Create an education entry
exports.createEducation = async (req, res) => {
  try {
    const { institution, degree, field, startDate, endDate, description } = req.body;
    
    const newEducation = new Education({
      institution,
      degree,
      field,
      startDate,
      endDate,
      description
    });
    
    const education = await newEducation.save();
    res.json(education);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// Update an education entry
exports.updateEducation = async (req, res) => {
  try {
    const { institution, degree, field, startDate, endDate, description } = req.body;
    
    let education = await Education.findById(req.params.id);
    
    if (!education) {
      return res.status(404).json({ msg: 'Education entry not found' });
    }
    
    const educationFields = {
      institution,
      degree,
      field,
      startDate,
      endDate,
      description
    };
    
    education = await Education.findByIdAndUpdate(
      req.params.id,
      { $set: educationFields },
      { new: true }
    );
    
    res.json(education);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// Delete an education entry
exports.deleteEducation = async (req, res) => {
  try {
    const education = await Education.findById(req.params.id);
    
    if (!education) {
      return res.status(404).json({ msg: 'Education entry not found' });
    }
    
    await education.remove();
    
    res.json({ msg: 'Education entry removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};