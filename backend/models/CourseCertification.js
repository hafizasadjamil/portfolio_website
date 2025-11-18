const mongoose = require('mongoose');

const CourseCertificationSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  provider: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    enum: ['Course', 'Certification'],
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  certificateLink: {
    type: String,
    default: '',
  },
  credentialId: {
    type: String,
    default: '',
  },
  description: {
    type: String,
    default: '',
  },
  skillsLearnt: {
    type: [String],
    default: [],
  },
  badgeImage: {
    type: String,
    default: '',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('CourseCertification', CourseCertificationSchema);