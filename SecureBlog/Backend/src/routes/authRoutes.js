// src/routes/authRoutes.js
const express = require("express");
const {
  register,
  login,
  validateRegister,
  validateLogin,
  registerAdminBootstrap,
  adminCreateUserWithRole,
} = require("../controllers/authController");
const { protect } = require("../middleware/authMiddleware");
const { requireAnyRole } = require("../middleware/roles");
const { registerLimiter, loginLimiter } = require("../middleware/rateLimiter");

const router = express.Router();

/** Public: register (rate-limited) */
router.post("/register", registerLimiter, validateRegister, register);

/** Public: login (per-IP + email rate-limited; successful logins skipped) */
router.post("/login", loginLimiter, validateLogin, login);

/** One-time bootstrap admin (rate-limited as well) */
router.post("/bootstrap-admin", registerLimiter, registerAdminBootstrap);

/** Admin-only: create users with any role */
router.post(
  "/admin/create-user",
  protect,
  requireAnyRole(["admin"]),
  registerLimiter, // optional but helps prevent bursts
  adminCreateUserWithRole
);

/** Authenticated: who am I (used by Splash to route to the correct dashboard) */
router.get("/whoami", protect, (req, res) => {
  res.json({ id: req.user.id, role: req.user.role, email: req.user.email });
});

module.exports = router;
