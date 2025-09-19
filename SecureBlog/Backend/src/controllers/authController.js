// src/controllers/authController.js
const jwt = require("jsonwebtoken");
const { validationResult, body } = require("express-validator");
const User = require("../models/User");

// 👇 debug loggers
const createDebug = require("debug");
const log = {
  auth:  createDebug("secureblog:auth"),
  error: createDebug("secureblog:error"),
};

const expiresIn = process.env.TOKEN_EXPIRES_IN || "1h";

const generateToken = (user) => {
  const token = jwt.sign(
    { id: user._id, role: user.role, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn }
  );
  log.auth("JWT issued uid=%s role=%s exp=%s", user._id, user.role, expiresIn);
  return token;
};

// Field validators (used in routes)
exports.validateRegister = [
  body("email").isEmail().withMessage("valid email required"),
  body("password").isLength({ min: 6 }).withMessage("min 6 chars"),
];

exports.validateLogin = [
  body("email").isEmail(),
  body("password").notEmpty(),
];

// Public: register as READER by default
exports.register = async (req, res) => {
  const t0 = Date.now();
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    log.auth("register validation failed: %o", errors.array());
    return res.status(400).json({ message: "invalid input", errors: errors.array() });
  }

  const { email, password } = req.body;
  log.auth("register attempt email=%s", email);

  try {
    const existing = await User.findOne({ email });
    if (existing) {
      log.auth("register blocked: email already exists (%s)", email);
      return res.status(400).json({ message: "Email already exists" });
    }

    const user = await User.create({ email, password, role: "reader" });
    log.auth("register success uid=%s role=%s (+%dms)", user._id, user.role, Date.now() - t0);

    const token = generateToken(user);
    res.status(201).json({ token, role: user.role });
  } catch (err) {
    log.error("register error: %O", err);
    res.status(500).json({ error: "Server error" });
  }
};

// Public: login
exports.login = async (req, res) => {
  const t0 = Date.now();
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    log.auth("login validation failed: %o", errors.array());
    return res.status(400).json({ message: "invalid input", errors: errors.array() });
  }

  const { email, password } = req.body;
  log.auth("login attempt email=%s", email);

  try {
    // If your User model has password { select: false }, use:
    // const user = await User.findOne({ email }).select("+password");
    const user = await User.findOne({ email });
    if (!user) {
      log.auth("login failed: user not found (%s)", email);
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const ok = await user.comparePassword(password);
    if (!ok) {
      log.auth("login failed: bad password (%s)", email);
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = generateToken(user);
    log.auth("login success uid=%s role=%s (+%dms)", user._id, user.role, Date.now() - t0);
    res.json({ token, role: user.role });
  } catch (err) {
    log.error("login error: %O", err);
    res.status(500).json({ error: "Server error" });
  }
};

// Bootstrap: allow FIRST admin to self-create if no admin exists
exports.registerAdminBootstrap = async (req, res) => {
  const t0 = Date.now();
  try {
    const adminExists = await User.exists({ role: "admin" });
    log.auth("bootstrap-admin check: exists=%s", !!adminExists);

    if (adminExists) {
      log.auth("bootstrap-admin blocked: admin already exists");
      return res.status(403).json({ message: "Admin already exists" });
    }

    const { email, password } = req.body;
    log.auth("bootstrap-admin attempt email=%s", email);

    const existing = await User.findOne({ email });
    if (existing) {
      log.auth("bootstrap-admin blocked: email exists (%s)", email);
      return res.status(400).json({ message: "Email already exists" });
    }

    const admin = await User.create({ email, password, role: "admin" });
    const token = generateToken(admin);
    log.auth("bootstrap-admin success uid=%s (+%dms)", admin._id, Date.now() - t0);

    res.status(201).json({ message: "bootstrap admin created", token, role: admin.role });
  } catch (err) {
    log.error("bootstrap-admin error: %O", err);
    res.status(500).json({ error: "Server error" });
  }
};

// Admin-only: create a user with a specific role
exports.adminCreateUserWithRole = async (req, res) => {
  const t0 = Date.now();
  try {
    const { email, password, role } = req.body;
    log.auth("adminCreateUserWithRole by uid=%s -> email=%s role=%s",
      req.user?.id, email, role);

    if (!["admin", "editor", "author", "reader"].includes(role)) {
      log.auth("adminCreateUserWithRole blocked: invalid role=%s", role);
      return res.status(400).json({ message: "invalid role" });
    }

    const exists = await User.findOne({ email });
    if (exists) {
      log.auth("adminCreateUserWithRole blocked: email exists (%s)", email);
      return res.status(400).json({ message: "email exists" });
    }

    const user = await User.create({ email, password, role });
    log.auth("adminCreateUserWithRole success newUid=%s role=%s (+%dms)",
      user._id, user.role, Date.now() - t0);

    res.status(201).json({ message: "user created", id: user._id, role: user.role });
  } catch (err) {
    log.error("adminCreateUserWithRole error: %O", err);
    res.status(500).json({ error: "Server error" });
  }
};
