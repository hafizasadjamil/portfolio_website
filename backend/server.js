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
const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:3001',
  process.env.FRONTEND_URL,
  process.env.ADMIN_URL
].filter(Boolean);

app.use(cors({
  origin: [
    "http://localhost:3000",
    "https://asadjamil.tech"
  ],
  credentials: true
}));

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
const demoRoutes = require('./routes/demoRoutes');
const journeyRoutes = require('./routes/journey');
const jobScraperRoutes = require('./routes/jobScraper');

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
app.use('/api/demos', demoRoutes);
app.use('/api/journey', journeyRoutes);
app.use('/api/job-scraper', jobScraperRoutes);

// Start server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));