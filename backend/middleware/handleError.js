const mongoose = require('mongoose');
const multer = require('multer');

// Turns known errors into a useful status instead of a blanket 500.
module.exports = function handleError(err, res) {
  if (err instanceof mongoose.Error.CastError && err.path === '_id') {
    return res.status(404).json({ msg: 'Not found' });
  }
  if (err instanceof mongoose.Error.ValidationError) {
    const errors = Object.values(err.errors);
    const missing = errors.filter(item => item.kind === 'required').map(item => item.path);
    const msg = missing.length > 0
      ? `Please fill in: ${missing.join(', ')}`
      : errors.map(item => item.message).join(' ') || err.message;
    return res.status(400).json({ msg });
  }
  if (err instanceof mongoose.Error.CastError) {
    return res.status(400).json({ msg: `${err.path} is not valid` });
  }
  if (err instanceof multer.MulterError) {
    const msg = err.code === 'LIMIT_FILE_SIZE' ? 'Images must be 5 MB or smaller' : err.message;
    return res.status(400).json({ msg });
  }
  if (err.code === 11000) {
    const field = Object.keys(err.keyPattern || {})[0] || 'value';
    return res.status(409).json({ msg: `That ${field} is already in use` });
  }
  if (err.status >= 400 && err.status < 500) {
    return res.status(err.status).json({ msg: err.message });
  }
  console.error(err);
  return res.status(500).json({ msg: 'Server Error' });
};
