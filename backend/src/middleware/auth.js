const jwt = require("jsonwebtoken");

exports.auth = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ success: false, message: "Unauthorized: No token" });

  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch {
    res.status(401).json({ success: false, message: "Unauthorized: Invalid token" });
  }
};

exports.adminOnly = (req, res, next) => {
  if (req.user.role !== "ADMIN")
    return res.status(403).json({ success: false, message: "Admin access required" });
  next();
};

exports.facultyOnly = (req, res, next) => {
  if (req.user.role !== "FACULTY")
    return res.status(403).json({ success: false, message: "Faculty access required" });
  next();
};