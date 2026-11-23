const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const handleError = require('../middleware/handleError');
const Experience = require('../models/Experience');

const FIELDS = ['company', 'role', 'location', 'startDate', 'endDate', 'current', 'description'];
const pick = body => Object.fromEntries(FIELDS.filter(key => body[key] !== undefined).map(key => [key, body[key]]));

// @route   GET api/experience
// @desc    Get all jobs, newest first
// @access  Public
router.get('/', async (req, res) => {
  try {
    res.json(await Experience.find().sort({ current: -1, startDate: -1 }));
  } catch (err) {
    handleError(err, res);
  }
});

// @route   GET api/experience/:id
// @desc    Get one job
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const job = await Experience.findById(req.params.id);
    if (!job) return res.status(404).json({ msg: 'Experience not found' });
    res.json(job);
  } catch (err) {
    handleError(err, res);
  }
});

// @route   POST api/experience
// @desc    Add a job
// @access  Private
router.post('/', auth, async (req, res) => {
  try {
    res.json(await new Experience(pick(req.body)).save());
  } catch (err) {
    handleError(err, res);
  }
});

// @route   PUT api/experience/:id
// @desc    Update a job
// @access  Private
router.put('/:id', auth, async (req, res) => {
  try {
    const job = await Experience.findByIdAndUpdate(
      req.params.id,
      { $set: pick(req.body) },
      { new: true, runValidators: true }
    );
    if (!job) return res.status(404).json({ msg: 'Experience not found' });
    res.json(job);
  } catch (err) {
    handleError(err, res);
  }
});

// @route   DELETE api/experience/:id
// @desc    Delete a job
// @access  Private
router.delete('/:id', auth, async (req, res) => {
  try {
    const job = await Experience.findByIdAndDelete(req.params.id);
    if (!job) return res.status(404).json({ msg: 'Experience not found' });
    res.json({ msg: 'Experience removed' });
  } catch (err) {
    handleError(err, res);
  }
});

module.exports = router;
