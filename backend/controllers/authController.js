const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const handleError = require('../middleware/handleError');

// Accounts are created with `npm run admin`, never over HTTP.

// Compared against when the email is unknown, so both cases take equally long.
const DUMMY_HASH = bcrypt.hashSync('not-a-real-password', 10);

// Login user
exports.login = async (req, res) => {
  const { email, password } = req.body;

  if (typeof email !== 'string' || typeof password !== 'string' || !email || !password) {
    return res.status(400).json({ msg: 'Email and password are required' });
  }

  try {
    const user = await User.findOne({ email: email.trim() });
    const isMatch = await bcrypt.compare(password, user ? user.password : DUMMY_HASH);

    if (!user || !isMatch) {
      return res.status(400).json({ msg: 'Invalid Credentials' });
    }

    const token = jwt.sign(
      { user: { id: user.id, role: user.role } },
      process.env.JWT_SECRET,
      { expiresIn: '5d' }
    );
    res.json({ token });
  } catch (err) {
    handleError(err, res);
  }
};

// Get logged in user
exports.getUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) return res.status(404).json({ msg: 'User not found' });
    res.json(user);
  } catch (err) {
    handleError(err, res);
  }
};
