const jwt = require("jsonwebtoken");

// Verifies JWT and attaches { id, role, email } to req.user
const protect = (req, res, next) => {
  const header = req.headers.authorization || "";
  if (!header.startsWith("Bearer "))
    return res.status(401).json({ message: "Unauthorized" });

  const token = header.split(" ")[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // { id, role, email }
    next();
  } catch (err) {
    return res.status(403).json({ message: "Token invalid or expired" });
  }
};

module.exports = { protect };
