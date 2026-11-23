const mongoose = require('mongoose');

const CourseCertificationSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  provider: {
    type: String,
    default: '',
  },
  type: {
    type: String,
    enum: ['Course', 'Certification'],
    required: true,
  },
  date: {
    type: Date,
    default: null,
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
  // Public page where the certificate can be checked, such as Microsoft Learn or Credly.
  verifyUrl: {
    type: String,
    default: '',
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