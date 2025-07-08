const express = require("express");
const { body, validationResult } = require("express-validator");
const { pool } = require("../database/config");
const { authenticateToken } = require("../middleware/auth");

const router = express.Router();

// GET /api/logbook - Get all logbook entries
router.get("/", authenticateToken, async (req, res) => {
  try {
    const [entries] = await pool.execute(`
      SELECT * FROM logbook 
      ORDER BY created_at DESC
    `);

    res.json({ entries });
  } catch (error) {
    console.error("Error fetching logbook entries:", error);
    res.status(500).json({ message: "Error fetching logbook entries" });
  }
});

// GET /api/logbook/:id - Get single logbook entry
router.get("/:id", authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    const [entries] = await pool.execute("SELECT * FROM logbook WHERE id = ?", [
      id,
    ]);

    if (entries.length === 0) {
      return res.status(404).json({ message: "Logbook entry not found" });
    }

    res.json({ entry: entries[0] });
  } catch (error) {
    console.error("Error fetching logbook entry:", error);
    res.status(500).json({ message: "Error fetching logbook entry" });
  }
});

// POST /api/logbook - Create new logbook entry
router.post(
  "/",
  [
    authenticateToken,
    body("date").notEmpty().withMessage("Date is required"),
    body("vehicle").notEmpty().withMessage("Vehicle is required"),
    body("driver").notEmpty().withMessage("Driver is required"),
    body("description")
      .optional()
      .isString()
      .withMessage("Description must be a string"),
  ],
  async (req, res) => {
    try {
      // Check for validation errors
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { date, vehicle, driver, description } = req.body;

      // Insert new logbook entry
      const [result] = await pool.execute(
        "INSERT INTO logbook (date, vehicle, driver, description) VALUES (?, ?, ?, ?)",
        [date, vehicle, driver, description || null]
      );

      // Get the created entry
      const [newEntry] = await pool.execute(
        "SELECT * FROM logbook WHERE id = ?",
        [result.insertId]
      );

      res.status(201).json({
        message: "Logbook entry created successfully",
        entry: newEntry[0],
      });
    } catch (error) {
      console.error("Error creating logbook entry:", error);
      res.status(500).json({ message: "Error creating logbook entry" });
    }
  }
);

// PUT /api/logbook/:id - Update logbook entry
router.put(
  "/:id",
  [
    authenticateToken,
    body("date").notEmpty().withMessage("Date is required"),
    body("vehicle").notEmpty().withMessage("Vehicle is required"),
    body("driver").notEmpty().withMessage("Driver is required"),
    body("description")
      .optional()
      .isString()
      .withMessage("Description must be a string"),
  ],
  async (req, res) => {
    try {
      // Check for validation errors
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { id } = req.params;
      const { date, vehicle, driver, description } = req.body;

      // Check if entry exists
      const [existingEntry] = await pool.execute(
        "SELECT id FROM logbook WHERE id = ?",
        [id]
      );

      if (existingEntry.length === 0) {
        return res.status(404).json({ message: "Logbook entry not found" });
      }

      // Update logbook entry
      await pool.execute(
        "UPDATE logbook SET date = ?, vehicle = ?, driver = ?, description = ? WHERE id = ?",
        [date, vehicle, driver, description || null, id]
      );

      // Get the updated entry
      const [updatedEntry] = await pool.execute(
        "SELECT * FROM logbook WHERE id = ?",
        [id]
      );

      res.json({
        message: "Logbook entry updated successfully",
        entry: updatedEntry[0],
      });
    } catch (error) {
      console.error("Error updating logbook entry:", error);
      res.status(500).json({ message: "Error updating logbook entry" });
    }
  }
);

// DELETE /api/logbook/:id - Delete logbook entry
router.delete("/:id", [authenticateToken], async (req, res) => {
  try {
    const { id } = req.params;

    // Check if entry exists
    const [existingEntry] = await pool.execute(
      "SELECT id FROM logbook WHERE id = ?",
      [id]
    );

    if (existingEntry.length === 0) {
      return res.status(404).json({ message: "Logbook entry not found" });
    }

    // Delete logbook entry
    await pool.execute("DELETE FROM logbook WHERE id = ?", [id]);

    res.json({ message: "Logbook entry deleted successfully" });
  } catch (error) {
    console.error("Error deleting logbook entry:", error);
    res.status(500).json({ message: "Error deleting logbook entry" });
  }
});

// GET /api/logbook/stats/overview - Get logbook statistics
router.get("/stats/overview", authenticateToken, async (req, res) => {
  try {
    // Get total entries
    const [totalResult] = await pool.execute(
      "SELECT COUNT(*) as total FROM logbook"
    );
    const total = totalResult[0].total;

    // Get entries by vehicle
    const [vehicleResult] = await pool.execute(`
      SELECT vehicle, COUNT(*) as count 
      FROM logbook 
      GROUP BY vehicle
    `);

    // Get entries by driver
    const [driverResult] = await pool.execute(`
      SELECT driver, COUNT(*) as count 
      FROM logbook 
      GROUP BY driver
    `);

    res.json({
      total,
      byVehicle: vehicleResult,
      byDriver: driverResult,
    });
  } catch (error) {
    console.error("Error fetching logbook stats:", error);
    res.status(500).json({ message: "Error fetching logbook statistics" });
  }
});

module.exports = router;
