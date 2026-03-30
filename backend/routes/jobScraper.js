const express = require('express');
const router = express.Router();
const { spawn } = require('child_process');
const path = require('path');
const auth = require('../middleware/auth');

// @route   POST /api/job-scraper/scrape
// @desc    Run job scraper script
// @access  Private
router.post('/scrape', auth, (req, res) => {
    const { query, location, limit } = req.body;
    
    const scriptPath = path.join(__dirname, '../scraper/scraper.py');
    const pythonProcess = spawn('python', [scriptPath, JSON.stringify({ query, location, limit })]);

    let output = '';
    let errorOutput = '';

    pythonProcess.stdout.on('data', (data) => {
        output += data.toString();
    });

    pythonProcess.stderr.on('data', (data) => {
        errorOutput += data.toString();
        console.error(`Scraper error: ${data}`);
    });

    pythonProcess.on('close', (code) => {
        if (code !== 0) {
            return res.status(500).json({ 
                error: 'Scraper script failed', 
                details: errorOutput 
            });
        }
        
        try {
            const jobs = JSON.parse(output);
            res.json(jobs);
        } catch (err) {
            res.status(500).json({ 
                error: 'Failed to parse scraper output', 
                details: output 
            });
        }
    });
});

module.exports = router;
