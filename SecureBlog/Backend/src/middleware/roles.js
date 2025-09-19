// require one of allowed roles (admin > editor > author > reader)
const requireAnyRole = (roles = []) => {
    return (req, res, next) => {
      const userRole = req.user?.role;
      if (!userRole) return res.status(401).json({ message: "Unauthorized" });
  
      // admins are allowed everywhere
      if (userRole === "admin") return next();
  
      const allowed = roles.includes(userRole);
      if (!allowed) return res.status(403).json({ message: "Forbidden" });
      next();
    };
  };
  
  module.exports = { requireAnyRole };
  