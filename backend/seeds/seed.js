const connectDB = require('../config/db');
const CourseCertification = require('../models/CourseCertification');
const LeetCodeProgress = require('../models/LeetCodeProgress');
const sampleData = require('./sampleData.json');
const confirmOverwrite = require('./confirmOverwrite');

// Fills the database with SAMPLE courses and LeetCode problems for local development.
const seedDatabase = async () => {
  try {
    await connectDB();
    await confirmOverwrite([CourseCertification, LeetCodeProgress]);

    await CourseCertification.deleteMany({});
    await LeetCodeProgress.deleteMany({});

    await CourseCertification.insertMany(sampleData.courseCertifications);
    await LeetCodeProgress.insertMany(sampleData.leetCodeProgress);

    console.log('Database seeded successfully');
    process.exit(0);
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }
};

seedDatabase();
