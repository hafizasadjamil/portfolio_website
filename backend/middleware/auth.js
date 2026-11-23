const jwt = require('jsonwebtoken');

// Every protected route in this app is an admin route.
module.exports = function (req, res, next) {
  const token = req.header('x-auth-token');

  if (!token) {
    return res.status(401).json({ msg: 'No token, authorization denied' });
  }

  let decoded;
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET, { algorithms: ['HS256'] });
  } catch (err) {
    return res.status(401).json({ msg: 'Token is not valid' });
  }

  if (decoded.user?.role !== 'admin') {
    return res.status(403).json({ msg: 'Admin access required' });
  }

  req.user = decoded.user;
  next();
};
