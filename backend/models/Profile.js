const mongoose = require('mongoose');

const text = { type: String, default: '' };

const ProfileSchema = new mongoose.Schema({
  name: { type: String, required: true, default: 'Muhammad Asad Jamil' },
  tagline: {
    type: String,
    required: true,
    default: 'AI & Software Engineer | Building Intelligent and Scalable Systems',
  },
  bio: {
    type: String,
    required: true,
    default: 'I am a Computer Science graduate passionate about Artificial Intelligence and intelligent systems. I specialize in Python, machine learning frameworks, and full-stack development. I love solving real-world problems with code, from building AI-powered applications to deploying production-ready systems.',
  },
  profileImage: text,
  cvUrl: text,
  socialLinks: {
    linkedin: text,
    github: text,
    twitter: text,
    email: text,
    phone: text,
  },
  bookingUrl: text,
  // Points for the "Security and GRC work" section, each starting with •.
  securityWork: text,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Profile', ProfileSchema);
