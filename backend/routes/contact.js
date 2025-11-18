const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const {
  sendMessage,
  getAllMessages,
  markMessageAsRead,
  deleteMessage
} = require('../controllers/contactController');

// @route   POST api/contact
// @desc    Send a contact message
// @access  Public
router.post('/', sendMessage);

// @route   GET api/contact
// @desc    Get all contact messages
// @access  Private
router.get('/', auth, getAllMessages);

// @route   PUT api/contact/:id
// @desc    Mark a message as read
// @access  Private
router.put('/:id', auth, markMessageAsRead);

// @route   DELETE api/contact/:id
// @desc    Delete a message
// @access  Private
router.delete('/:id', auth, deleteMessage);

module.exports = router;