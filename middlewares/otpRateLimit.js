const rateLimit = require("express-rate-limit");

const verifyOtpRateLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 5,
  message: {
    message: "Too many attempts. Try again later",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

module.exports = { verifyOtpRateLimiter };
