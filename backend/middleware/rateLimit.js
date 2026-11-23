const { rateLimit } = require('express-rate-limit');

const limiter = (windowMinutes, limit, msg, options = {}) => rateLimit({
  windowMs: windowMinutes * 60 * 1000,
  limit,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  message: { msg },
  ...options,
});

module.exports = {
  // Successful logins don't count, so only wrong guesses use up the limit.
  loginLimiter: limiter(15, 10, 'Too many login attempts. Please try again in 15 minutes.', {
    skipSuccessfulRequests: true,
  }),
  contactLimiter: limiter(60, 5, 'Too many messages. Please try again later.'),
  scraperLimiter: limiter(15, 20, 'Too many searches. Please try again later.'),
};
