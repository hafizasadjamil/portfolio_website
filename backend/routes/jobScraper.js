const express = require('express');
const router = express.Router();
const { spawn } = require('child_process');
const path = require('path');
const auth = require('../middleware/auth');
const { scraperLimiter } = require('../middleware/rateLimit');

const SCRIPT = path.join(__dirname, '../scraper/scraper.py');
const TIMEOUT_MS = 90 * 1000;
const MAX_AGE_HOURS = { '24h': 24, '48h': 48, '72h': 72 };

const pythonCommand = () => process.env.PYTHON_BIN || (process.platform === 'win32' ? 'python' : 'python3');

// @route   POST /api/job-scraper/scrape
// @desc    Run job scraper script
// @access  Private
router.post('/scrape', auth, scraperLimiter, (req, res) => {
  const { query, location, limit, datePosted } = req.body;

  if (typeof query !== 'string' || !query.trim() || query.length > 100) {
    return res.status(400).json({ error: 'Enter a job title (up to 100 characters)' });
  }

  const args = {
    query: query.trim(),
    location: typeof location === 'string' && location.trim() ? location.trim().slice(0, 100) : 'Remote',
    limit: Math.min(Math.max(parseInt(limit, 10) || 100, 1), 100),
    maxAgeHours: MAX_AGE_HOURS[datePosted] || null,
  };

  const child = spawn(pythonCommand(), [SCRIPT, JSON.stringify(args)], {
    env: { ...process.env, PYTHONIOENCODING: 'utf-8' },
  });

  const timer = setTimeout(() => child.kill(), TIMEOUT_MS);

  let output = '';
  let errorOutput = '';
  child.stdout.setEncoding('utf8').on('data', data => { output += data; });
  child.stderr.setEncoding('utf8').on('data', data => { errorOutput += data; });

  // Without this listener a missing Python install would take the whole server down.
  child.on('error', err => {
    clearTimeout(timer);
    console.error('Could not start the job scraper:', err.message);
    if (!res.headersSent) {
      res.status(503).json({ error: 'The job scraper is not available: Python is not installed on the server' });
    }
  });

  child.on('close', code => {
    clearTimeout(timer);
    if (res.headersSent) return;
    if (errorOutput) console.error(`Scraper: ${errorOutput}`);

    if (code !== 0) {
      const error = child.killed ? 'The job search took too long' : 'The job search failed';
      return res.status(502).json({ error });
    }

    try {
      const jobs = JSON.parse(output);
      if (!Array.isArray(jobs)) throw new Error(jobs.error);
      res.json(jobs);
    } catch (err) {
      console.error('Bad scraper output:', err.message);
      res.status(502).json({ error: 'The job search failed' });
    }
  });
});

module.exports = router;
