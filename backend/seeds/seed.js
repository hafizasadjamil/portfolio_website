const mongoose = require('mongoose');
const CourseCertification = require('../models/CourseCertification');
const LeetCodeProgress = require('../models/LeetCodeProgress');
const sampleData = require('./sampleData.json');

require('dotenv').config();

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    // Clear existing data
    await CourseCertification.deleteMany({});
    await LeetCodeProgress.deleteMany({});

    // Insert sample data
    await CourseCertification.insertMany(sampleData.courseCertifications);
    await LeetCodeProgress.insertMany(sampleData.leetCodeProgress);

    console.log('Database seeded successfully');
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

seedDatabase();