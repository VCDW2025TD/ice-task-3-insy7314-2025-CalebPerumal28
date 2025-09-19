// src/middleware/rateLimiter.js
const { rateLimit } = require("express-rate-limit");

// Helper: normalize client IP (proxy-aware if app.set('trust proxy', 1) is enabled)
const clientIpKey = (req) => {
  // With trust proxy set, req.ip is already the real client IP
  return req.ip || req.headers["x-forwarded-for"]?.split(",")[0]?.trim() || req.connection?.remoteAddress || "unknown";
};

// Register: tight limit (e.g., 5 / 15 min)
const registerLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 5,
  standardHeaders: true, // RateLimit-Limit, RateLimit-Remaining, RateLimit-Reset
  legacyHeaders: false,
  keyGenerator: clientIpKey,
  handler: (req, res) => {
    return res.status(429).json({
      message: "Too many registration attempts. Please try again later.",
    });
  },
});

// Login: per-IP + email, skip successful logins (so normal users aren't punished)
const loginLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  limit: 5,
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: true, // counts only non-2xx/3xx
  keyGenerator: (req) => {
    const email = (req.body?.email || "").toLowerCase().trim();
    return `${clientIpKey(req)}:${email}`;
  },
  handler: (req, res) => {
    return res.status(429).json({
      message: "Too many login attempts. Please try again later.",
    });
  },
});

module.exports = { registerLimiter, loginLimiter };
