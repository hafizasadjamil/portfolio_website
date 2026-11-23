require('./config/env');
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const mongoose = require('mongoose');
const { BUNDLED_UPLOADS, UPLOADS_DIR } = require('./config/uploads');
const handleError = require('./middleware/handleError');

const app = express();

// The host's proxy sits in front of the app; rate limiting needs the real client IP.
app.set('trust proxy', 1);

const envOrigins = [process.env.FRONTEND_URL, process.env.ADMIN_URL]
  .filter(Boolean)
  .flatMap(value => value.split(','))
  .map(origin => origin.trim().replace(/\/$/, ''));

const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:3001',
  'https://asadjamil.tech',
  'https://www.asadjamil.tech',
  ...envOrigins,
];

// Images are loaded by the frontend and admin panel from other origins.
app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }));
app.use(cors({ origin: allowedOrigins }));
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));

const staticOptions = {
  maxAge: '7d',
  setHeaders: (res, file) => {
    if (/\.jfif$/i.test(file)) res.setHeader('Content-Type', 'image/jpeg');
  },
};
app.use('/uploads', express.static(UPLOADS_DIR, staticOptions));
if (UPLOADS_DIR !== BUNDLED_UPLOADS) {
  app.use('/uploads', express.static(BUNDLED_UPLOADS, staticOptions));
}

app.get('/api/health', (req, res) => {
  const dbConnected = mongoose.connection.readyState === 1;
  res.status(dbConnected ? 200 : 503).json({ status: dbConnected ? 'ok' : 'database unavailable' });
});

app.use('/api/auth', require('./routes/auth'));
app.use('/api/projects', require('./routes/projects'));
app.use('/api/skills', require('./routes/skills'));
app.use('/api/achievements', require('./routes/achievements'));
app.use('/api/education', require('./routes/education'));
app.use('/api/experience', require('./routes/experience'));
app.use('/api/blog', require('./routes/blog'));
app.use('/api/contact', require('./routes/contact'));
app.use('/api/profile', require('./routes/profile'));
app.use('/api/course-certifications', require('./routes/courseCertifications'));
app.use('/api/leetcode-progress', require('./routes/leetCodeProgress'));
app.use('/api/demos', require('./routes/demoRoutes'));
app.use('/api/journey', require('./routes/journey'));
app.use('/api/job-scraper', require('./routes/jobScraper'));

app.use((req, res) => res.status(404).json({ msg: 'Not found' }));

// Express only treats a handler with four arguments as an error handler.
app.use((err, req, res, next) => handleError(err, res));

module.exports = app;
