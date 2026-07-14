const { rateLimit, ipKeyGenerator } = require("express-rate-limit");

const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 300,
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => req.auth?.payload?.sub || ipKeyGenerator(req.ip),
  message: { error: "Too many requests, please try again later." },
});

const authSensitiveLimiter = rateLimit({
  windowMs: 5 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => req.auth?.payload?.sub || ipKeyGenerator(req.ip),
  message: { error: "Too many attempts, please try again shortly." },
});

module.exports = { generalLimiter, authSensitiveLimiter };