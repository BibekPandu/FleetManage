const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { body, validationResult } = require("express-validator");
const { pool } = require("../database/config");

const router = express.Router();

// Use a consistent JWT secret
const JWT_SECRET =
  process.env.JWT_SECRET || "fleetfox-super-secret-jwt-key-2024";

// Register new user
router.post(
  "/register",
  [
    body("username")
      .isLength({ min: 3 })
      .withMessage("Username must be at least 3 characters"),
    body("email").isEmail().withMessage("Please enter a valid email"),
    body("password")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters"),
    body("role")
      .isIn(["manager", "driver"])
      .withMessage("Role must be manager or driver"),
  ],
  async (req, res) => {
    try {
      // Check for validation errors
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { username, email, password, role } = req.body;

      // Check if user already exists
      const [existingUsers] = await pool.execute(
        "SELECT id FROM users WHERE username = ? OR email = ?",
        [username, email]
      );

      if (existingUsers.length > 0) {
        return res
          .status(400)
          .json({ message: "Username or email already exists" });
      }

      // Hash password
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(password, saltRounds);

      // Insert new user
      const [result] = await pool.execute(
        "INSERT INTO users (username, email, password, role) VALUES (?, ?, ?, ?)",
        [username, email, hashedPassword, role]
      );

      if (role === "driver" || role === "manager") {
        try {
          const [existingStaff] = await pool.execute(
            "SELECT id FROM staff WHERE username = ?",
            [username]
          );
          if (existingStaff.length === 0) {
            await pool.execute(
              "INSERT INTO staff (username, role, status) VALUES (?, ?, ?)",
              [username, role, "active"]
            );
          }
        } catch (e) {
          console.error("Staff sync (register) error:", e);
        }
      }

      res.status(201).json({
        message: "User registered successfully",
        user: {
          id: result.insertId,
          username,
          email,
          role,
        },
      });
    } catch (error) {
      console.error("Registration error:", error);
      res.status(500).json({ message: "Server error during registration" });
    }
  }
);

// Login user (accepts username OR email in the "username" field)
router.post(
  "/login",
  [
    body("username").notEmpty().withMessage("Username or email is required"),
    body("password").notEmpty().withMessage("Password is required"),
  ],
  async (req, res) => {
    try {
      // Check for validation errors
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { username, password } = req.body;
      const identifier = username?.trim();

      if (process.env.NODE_ENV !== "production") {
        console.log("Login attempt for username:", username);
      }

      // Find user by username OR email
      const [users] = await pool.execute(
        "SELECT * FROM users WHERE username = ? OR email = ?",
        [identifier, identifier]
      );

      if (process.env.NODE_ENV !== "production") {
        console.log("Found users:", users.length);
      }

      if (users.length === 0) {
        if (process.env.NODE_ENV !== "production") {
          console.log("No user found with identifier:", identifier);
        }
        return res.status(401).json({ message: "Invalid credentials" });
      }

      const user = users[0];
      if (process.env.NODE_ENV !== "production") {
        console.log("User found:", {
          id: user.id,
          username: user.username,
          role: user.role,
        });
      }

      // Check password
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (process.env.NODE_ENV !== "production") {
        console.log(" Password valid:", isPasswordValid);
      }

      if (!isPasswordValid) {
        if (process.env.NODE_ENV !== "production") {
          console.log(" Invalid password for user:", username);
        }
        return res.status(401).json({ message: "Invalid credentials" });
      }

      // Generate JWT token
      const token = jwt.sign(
        {
          userId: user.id,
          username: user.username,
          role: user.role,
        },
        JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN || "24d" }
      );

      if (process.env.NODE_ENV !== "production") {
        console.log("Login successful for user:", identifier);
      }

      if (user.role === "driver" || user.role === "manager") {
        try {
          const [existingStaff] = await pool.execute(
            "SELECT id FROM staff WHERE username = ?",
            [user.username]
          );
          if (existingStaff.length === 0) {
            await pool.execute(
              "INSERT INTO staff (username, role, status) VALUES (?, ?, ?)",
              [user.username, user.role, "active"]
            );
          }
        } catch (e) {
          console.error("Staff sync error:", e);
        }
      }

      res.json({
        message: "Login successful",
        token,
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          role: user.role,
        },
      });
    } catch (error) {
      console.error("Login error:", error);
      res.status(500).json({ message: "Server error during login" });
    }
  }
);

// Get current user profile
router.get("/profile", async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({ message: "No token provided" });
    }

    const decoded = jwt.verify(token, JWT_SECRET);

    const [users] = await pool.execute(
      "SELECT id, username, email, role, created_at FROM users WHERE id = ?",
      [decoded.userId]
    );

    if (users.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ user: users[0] });
  } catch (error) {
    console.error("Profile error:", error);
    res.status(401).json({ message: "Invalid token" });
  }
});

// Get all users (for driver selection in schedules)
router.get("/users", async (req, res) => {
  try {
    const [users] = await pool.execute(
      'SELECT id, username, email, role FROM users WHERE role = "driver" ORDER BY username'
    );

    res.json({ users });
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ message: "Error fetching users" });
  }
});

module.exports = router;
