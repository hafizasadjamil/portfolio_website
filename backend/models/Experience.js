const mongoose = require('mongoose');

const ExperienceSchema = new mongoose.Schema({
  company: { type: String, required: true },
  role: { type: String, required: true },
  location: { type: String, default: '' },
  startDate: { type: Date, default: null },
  // Jobs without a start date are shown by this alone.
  current: { type: Boolean, default: false },
  endDate: { type: Date, default: null },
  description: { type: String, default: '' },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Experience', ExperienceSchema);
