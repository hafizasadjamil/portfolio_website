const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');

require('dotenv').config();

const createAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    const adminPassword = 'admin123'; // Change this to a secure password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(adminPassword, salt);

    const adminUser = new User({
      username: 'admin',
      email: 'h.asad.jamil@gmail.com',
      password: hashedPassword,
      role: 'admin',
    });

    await adminUser.save();
    console.log('Admin user created successfully');
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

createAdmin();