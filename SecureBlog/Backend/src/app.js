// src/app.js
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const dotenv = require("dotenv");

dotenv.config();

const app = express();
const isProd = process.env.NODE_ENV === "production";

/* ---------- Trust proxy (real client IP for rate limiting) ---------- */
app.set("trust proxy", 1); // ✅ important when behind a proxy/LB

/* ---------- Security ---------- */
app.use(helmet());

app.use(
  helmet.contentSecurityPolicy({
    useDefaults: true,
    reportOnly: !isProd,
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: [
        "'self'",
        "'unsafe-inline'",
        "cdn.jsdelivr.net",
        "https://www.googletagmanager.com",
        "https://www.google-analytics.com",
      ],
      styleSrc: ["'self'", "'unsafe-inline'", "fonts.googleapis.com"],
      imgSrc: ["'self'", "data:", "blob:", "cdn.jsdelivr.net"],
      fontSrc: ["'self'", "fonts.gstatic.com"],
      connectSrc: [
        "'self'",
        "https://localhost:5000", "http://localhost:5000",
        "https://127.0.0.1:5000", "http://127.0.0.1:5000",
        "https://localhost:5173", "http://localhost:5173",
        "https://127.0.0.1:5173", "http://127.0.0.1:5173",
      ],
      objectSrc: ["'none'"],
      upgradeInsecureRequests: [],
    },
  })
);

// Optional CSP reports
app.post(
  "/csp-report",
  express.json({ type: "application/csp-report" }),
  (req, res) => {
    console.warn("📣 CSP Report:", JSON.stringify(req.body, null, 2));
    res.sendStatus(204);
  }
);

/* ---------- CORS (Express 5-safe) ---------- */
const allowedOrigins = new Set([
  "https://localhost:5173",
  "http://localhost:5173",
  "https://127.0.0.1:5173",
  "http://127.0.0.1:5173",
]);

const corsOptions = {
  origin(origin, cb) {
    if (!origin) return cb(null, true); // Postman/curl or same-origin
    if (allowedOrigins.has(origin)) return cb(null, true);
    return cb(new Error(`CORS: origin not allowed -> ${origin}`), false);
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  maxAge: 600,
};

app.use(cors(corsOptions));
// Express 5: regex instead of '*'
app.options(/.*/, cors(corsOptions));

/* ---------- Parsers & Logging ---------- */
app.use(express.json()); // must be before route limiters that read req.body
app.use(isProd ? morgan("combined") : morgan("dev"));

/* ---------- Routes ---------- */
const authRoutes = require("./routes/authRoutes");
const postRoutes = require("./routes/postRoutes");
const commentRoutes = require("./routes/commentRoutes");
const { protect } = require("./middleware/authMiddleware");

// If you mounted rate limiters inside authRoutes (recommended), do NOT mount here.
// If you didn’t, you can mount here instead (uncomment one-time):
// const { registerLimiter, loginLimiter } = require("./middleware/rateLimiter");
// app.use("/api/auth/login", loginLimiter);
// app.use("/api/auth/register", registerLimiter);           // or /register-user
// app.use("/api/auth/bootstrap-admin", registerLimiter);    // optional

app.use("/api/auth", authRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/posts/:postId/comments", commentRoutes);

// Example protected route
app.get("/api/protected", protect, (req, res) => {
  res.json({ message: `Welcome, user ${req.user.id}!`, timestamp: new Date() });
});

// Health/root
app.get("/", (_req, res) => {
  res.send("✅ API Backend Server is running securely with HTTPS.");
});

module.exports = app;
