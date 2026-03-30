const express = require('express');
const router = express.Router();
const Journey = require('../models/Journey');
const auth = require('../middleware/auth');

// @route   GET api/journey
// @desc    Get all journey events
// @access  Public
router.get('/', async (req, res) => {
    try {
        const events = await Journey.find().sort({ order: 1, createdAt: -1 });
        res.json(events);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   POST api/journey
// @desc    Add a journey event
// @access  Private
router.post('/', auth, async (req, res) => {
    const { date, title, description, icon, color, order } = req.body;

    try {
        const newEvent = new Journey({
            date,
            title,
            description,
            icon,
            color,
            order
        });

        const event = await newEvent.save();
        res.json(event);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   PUT api/journey/:id
// @desc    Update a journey event
// @access  Private
router.put('/:id', auth, async (req, res) => {
    const { date, title, description, icon, color, order } = req.body;

    // Build event object
    const eventFields = {};
    if (date) eventFields.date = date;
    if (title) eventFields.title = title;
    if (description) eventFields.description = description;
    if (icon) eventFields.icon = icon;
    if (color) eventFields.color = color;
    if (order !== undefined) eventFields.order = order;

    try {
        let event = await Journey.findById(req.params.id);

        if (!event) return res.status(404).json({ msg: 'Event not found' });

        event = await Journey.findByIdAndUpdate(
            req.params.id,
            { $set: eventFields },
            { new: true }
        );

        res.json(event);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   DELETE api/journey/:id
// @desc    Delete a journey event
// @access  Private
router.delete('/:id', auth, async (req, res) => {
    try {
        let event = await Journey.findById(req.params.id);

        if (!event) return res.status(404).json({ msg: 'Event not found' });

        await Journey.findByIdAndDelete(req.params.id);

        res.json({ msg: 'Event removed' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
