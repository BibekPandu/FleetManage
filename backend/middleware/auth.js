const jwt = require("jsonwebtoken");
const { pool } = require("../database/config");

// Use a consistent JWT secret
const JWT_SECRET = process.env.JWT_SECRET || "fleetfox-super-secret-jwt-key-2024";

// Middleware to verify JWT token
const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(" ")[1]; // Bearer TOKEN

    if (!token) {
      return res.status(401).json({ message: "Access token required" });
    }

    // Verify token with consistent secret
    const decoded = jwt.verify(token, JWT_SECRET);

    // Get user from database
    const [users] = await pool.execute(
      "SELECT id, username, email, role FROM users WHERE id = ?",
      [decoded.userId]
    );

    if (users.length === 0) {
      return res.status(401).json({ message: "User not found" });
    }

    // Add user info to request object
    req.user = users[0];
    next();
  } catch (error) {
    console.error("Authentication error:", error);
    if (error.name === 'JsonWebTokenError') {
      return res.status(403).json({ message: "Invalid token signature" });
    } else if (error.name === 'TokenExpiredError') {
      return res.status(403).json({ message: "Token has expired" });
    }
    return res.status(403).json({ message: "Invalid or expired token" });
  }
};

// Middleware to check if user has admin role
const requireAdmin = (req, res, next) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Admin access required" });
  }
  next();
};

// Middleware to check if user has manager or admin role
const requireManager = (req, res, next) => {
  if (req.user.role !== "admin" && req.user.role !== "manager") {
    return res
      .status(403)
      .json({ message: "Manager or admin access required" });
  }
  next();
};

// Middleware to check if user can access their own data or is admin/manager
const requireOwnershipOrManager = (req, res, next) => {
  const userId = parseInt(req.params.userId || req.params.id);

  if (
    req.user.role === "admin" ||
    req.user.role === "manager" ||
    req.user.id === userId
  ) {
    return next();
  }

  return res.status(403).json({ message: "Access denied" });
};

module.exports = {
  authenticateToken,
  requireAdmin,
  requireManager,
  requireOwnershipOrManager,
};
