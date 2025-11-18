const CourseCertification = require('../models/CourseCertification');

// Get all courses and certifications
exports.getAllCourseCertifications = async (req, res) => {
  try {
    const courses = await CourseCertification.find().sort({ date: -1 });
    res.json(courses);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
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
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// Create a new course/certification
exports.createCourseCertification = async (req, res) => {
  try {
    const { title, provider, type, date, certificateLink, credentialId, description, skillsLearnt } = req.body;
    
    const newCourse = new CourseCertification({
      title,
      provider,
      type,
      date,
      certificateLink,
      credentialId,
      description,
      skillsLearnt: skillsLearnt ? skillsLearnt.split(',').map(item => item.trim()) : [],
      badgeImage: req.file ? `/uploads/${req.file.filename}` : '',
    });
    
    const course = await newCourse.save();
    res.json(course);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// Update a course/certification
exports.updateCourseCertification = async (req, res) => {
  try {
    const { title, provider, type, date, certificateLink, credentialId, description, skillsLearnt } = req.body;
    
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
      credentialId,
      description,
      skillsLearnt: skillsLearnt ? skillsLearnt.split(',').map(item => item.trim()) : [],
    };
    
    if (req.file) {
      courseFields.badgeImage = `/uploads/${req.file.filename}`;
    }
    
    course = await CourseCertification.findByIdAndUpdate(
      req.params.id,
      { $set: courseFields },
      { new: true }
    );
    
    res.json(course);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// Delete a course/certification
exports.deleteCourseCertification = async (req, res) => {
  try {
    const course = await CourseCertification.findById(req.params.id);
    
    if (!course) {
      return res.status(404).json({ msg: 'Course/Certification not found' });
    }
    
    await course.remove();
    
    res.json({ msg: 'Course/Certification removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};