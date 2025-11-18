const mongoose = require('mongoose');

const LeetCodeProgressSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  difficulty: {
    type: String,
    enum: ['Easy', 'Medium', 'Hard'],
    required: true,
  },
  tags: {
    type: [String],
    default: [],
  },
  status: {
    type: String,
    enum: ['Solved', 'In Progress', 'Attempted'],
    required: true,
  },
  solutionLink: {
    type: String,
    default: '',
  },
  dateSolved: {
    type: Date,
    default: Date.now,
  },
  notes: {
    type: String,
    default: '',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('LeetCodeProgress', LeetCodeProgressSchema);