const mongoose = require('mongoose');
const { requireEnv } = require('./env');

// Treat operators such as {"$gt": ""} coming from request data as plain values.
mongoose.set('sanitizeFilter', true);

module.exports = async function connectDB() {
  requireEnv('MONGODB_URI');
  await mongoose.connect(process.env.MONGODB_URI, { serverSelectionTimeoutMS: 15000 });
};
