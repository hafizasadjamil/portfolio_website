const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { loginLimiter } = require('../middleware/rateLimit');
const { login, getUser } = require('../controllers/authController');

// @route   POST api/auth/login
// @desc    Authenticate user & get token
// @access  Public
router.post('/login', loginLimiter, login);

// @route   GET api/auth/user
// @desc    Get logged in user
// @access  Private
router.get('/user', auth, getUser);

module.exports = router;