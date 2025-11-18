const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Database connection
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.log('MongoDB connection error:', err));

// Routes
const authRoutes = require('./routes/auth');
const projectRoutes = require('./routes/projects');
const skillRoutes = require('./routes/skills');
const achievementRoutes = require('./routes/achievements');
const educationRoutes = require('./routes/education');
const blogRoutes = require('./routes/blog');
const contactRoutes = require('./routes/contact');
const profileRoutes = require('./routes/profile');
const courseCertificationRoutes = require('./routes/courseCertifications');
const leetCodeProgressRoutes = require('./routes/leetCodeProgress');

app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/skills', skillRoutes);
app.use('/api/achievements', achievementRoutes);
app.use('/api/education', educationRoutes);
app.use('/api/blog', blogRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/course-certifications', courseCertificationRoutes);
app.use('/api/leetcode-progress', leetCodeProgressRoutes);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));