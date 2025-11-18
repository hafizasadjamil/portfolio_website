const mongoose = require('mongoose');

const ProjectSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    default: '',
  },
  techStack: {
    type: [String],
    required: true,
  },
  githubUrl: {
    type: String,
    default: '',
  },
  demoUrl: {
    type: String,
    default: '',
  },
  featured: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Project', ProjectSchema);