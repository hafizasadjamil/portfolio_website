const mongoose = require('mongoose');

const JourneySchema = new mongoose.Schema({
    date: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    icon: {
        type: String, // Icon name from react-icons (e.g., 'FaCode')
        default: 'FaRocket'
    },
    color: {
        type: String, // Tailwind gradient classes (e.g., 'from-blue-500 to-cyan-400')
        default: 'from-blue-500 to-cyan-400'
    },
    order: {
        type: Number,
        default: 0
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Journey', JourneySchema);
