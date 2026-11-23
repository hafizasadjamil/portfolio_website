const Education = require('../models/Education');
const handleError = require('../middleware/handleError');

// Get all education entries
exports.getAllEducation = async (req, res) => {
  try {
    const education = await Education.find().sort({ startDate: -1 });
    res.json(education);
  } catch (err) {
    handleError(err, res);
  }
};

// Get education entry by ID
exports.getEducationById = async (req, res) => {
  try {
    const item = await Education.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ msg: 'Education entry not found' });
    }
    res.json(item);
  } catch (err) {
    handleError(err, res);
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
    handleError(err, res);
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
      { new: true, runValidators: true }
    );
    
    res.json(education);
  } catch (err) {
    handleError(err, res);
  }
};

// Delete an education entry
exports.deleteEducation = async (req, res) => {
  try {
    const education = await Education.findById(req.params.id);
    
    if (!education) {
      return res.status(404).json({ msg: 'Education entry not found' });
    }
    
    await Education.findByIdAndDelete(req.params.id);
    
    res.json({ msg: 'Education entry removed' });
  } catch (err) {
    handleError(err, res);
  }
};