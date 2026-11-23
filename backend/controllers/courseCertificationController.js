const CourseCertification = require('../models/CourseCertification');
const handleError = require('../middleware/handleError');
const toList = require('../utils/toList');

// Get all courses and certifications
exports.getAllCourseCertifications = async (req, res) => {
  try {
    const courses = await CourseCertification.find().sort({ date: -1 });
    res.json(courses);
  } catch (err) {
    handleError(err, res);
  }
};

// Get course/certification by ID
exports.getCourseCertificationById = async (req, res) => {
  try {
    const course = await CourseCertification.findById(req.params.id);
    if (!course) {
      return res.status(404).json({ msg: 'Course/Certification not found' });
    }
    res.json(course);
  } catch (err) {
    handleError(err, res);
  }
};

// Create a new course/certification
exports.createCourseCertification = async (req, res) => {
  try {
    const { title, provider, type, date, certificateLink, verifyUrl, credentialId, description, skillsLearnt } = req.body;
    
    const newCourse = new CourseCertification({
      title,
      provider,
      type,
      date,
      certificateLink,
      verifyUrl,
      credentialId,
      description,
      skillsLearnt: toList(skillsLearnt),
      badgeImage: req.file ? `/uploads/${req.file.filename}` : '',
    });
    
    const course = await newCourse.save();
    res.json(course);
  } catch (err) {
    handleError(err, res);
  }
};

// Update a course/certification
exports.updateCourseCertification = async (req, res) => {
  try {
    const { title, provider, type, date, certificateLink, verifyUrl, credentialId, description, skillsLearnt } = req.body;
    
    let course = await CourseCertification.findById(req.params.id);
    
    if (!course) {
      return res.status(404).json({ msg: 'Course/Certification not found' });
    }
    
    const courseFields = {
      title,
      provider,
      type,
      date,
      certificateLink,
      verifyUrl,
      credentialId,
      description,
      skillsLearnt: toList(skillsLearnt),
    };
    
    if (req.file) {
      courseFields.badgeImage = `/uploads/${req.file.filename}`;
    }
    
    course = await CourseCertification.findByIdAndUpdate(
      req.params.id,
      { $set: courseFields },
      { new: true, runValidators: true }
    );
    
    res.json(course);
  } catch (err) {
    handleError(err, res);
  }
};

// Delete a course/certification
exports.deleteCourseCertification = async (req, res) => {
  try {
    const course = await CourseCertification.findById(req.params.id);
    
    if (!course) {
      return res.status(404).json({ msg: 'Course/Certification not found' });
    }
    
    await CourseCertification.findByIdAndDelete(req.params.id);
    
    res.json({ msg: 'Course/Certification removed' });
  } catch (err) {
    handleError(err, res);
  }
};