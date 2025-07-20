const express = require("express");
const { body, validationResult } = require("express-validator");
const { pool } = require("../database/config");
const { authenticateToken } = require("../middleware/auth");

const router = express.Router();

// GET /api/expences - Get all expenses
router.get("/", authenticateToken, async (req, res) => {
  try {
    const [expenses] = await pool.execute(`
      SELECT e.*, v.make, v.model, v.license_plate FROM expenses e
      LEFT JOIN vehicles v ON e.vehicle_id = v.id
      ORDER BY e.date DESC, e.created_at DESC
    `);
    res.json({ expenses });
  } catch (error) {
    console.error("Error fetching expenses:", error);
    res.status(500).json({ message: "Error fetching expenses" });
  }
});

// GET /api/expences/:id - Get single expense
router.get("/:id", authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const [expenses] = await pool.execute("SELECT * FROM expenses WHERE id = ?", [id]);
    if (expenses.length === 0) {
      return res.status(404).json({ message: "Expense not found" });
    }
    res.json({ expense: expenses[0] });
  } catch (error) {
    console.error("Error fetching expense:", error);
    res.status(500).json({ message: "Error fetching expense" });
  }
});

// POST /api/expences - Create new expense
router.post(
  "/",
  [
    authenticateToken,
    body("date").notEmpty().withMessage("Date is required"),
    body("amount").isDecimal({ min: 0.01 }).withMessage("Amount is required"),
    body("category").notEmpty().withMessage("Category is required"),
    body("description").optional().isString().withMessage("Description must be a string"),
    body("vehicle_id").optional().custom((value) => {
      if (value === null || value === undefined || value === "") return true;
      if (isNaN(Number(value))) throw new Error("Vehicle ID must be a number or blank");
      return true;
    }),
  ],
  async (req, res) => {
    try {
      // Check for validation errors
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      let { date, amount, category, description, vehicle_id } = req.body;
      vehicle_id = vehicle_id === "" || vehicle_id === undefined ? null : vehicle_id;
      // If vehicle_id is provided, check if it exists
      if (vehicle_id) {
        const [vehicles] = await pool.execute("SELECT id FROM vehicles WHERE id = ?", [vehicle_id]);
        if (vehicles.length === 0) {
          return res.status(400).json({ message: "Vehicle ID does not exist" });
        }
      }
      // Insert new expense
      const [result] = await pool.execute(
        "INSERT INTO expenses (date, amount, category, description, vehicle_id) VALUES (?, ?, ?, ?, ?)",
        [date, amount, category, description || null, vehicle_id]
      );
      // Get the created expense
      const [newExpense] = await pool.execute("SELECT * FROM expenses WHERE id = ?", [result.insertId]);
      res.status(201).json({
        message: "Expense created successfully",
        expense: newExpense[0],
      });
    } catch (error) {
      console.error("Error creating expense:", error);
      res.status(500).json({ message: "Error creating expense" });
    }
  }
);

// PUT /api/expences/:id - Update expense
router.put(
  "/:id",
  [
    authenticateToken,
    body("date").notEmpty().withMessage("Date is required"),
    body("amount").isDecimal({ min: 0.01 }).withMessage("Amount is required"),
    body("category").notEmpty().withMessage("Category is required"),
    body("description").optional().isString().withMessage("Description must be a string"),
    body("vehicle_id").optional().custom((value) => {
      if (value === null || value === undefined || value === "") return true;
      if (isNaN(Number(value))) throw new Error("Vehicle ID must be a number or blank");
      return true;
    }),
  ],
  async (req, res) => {
    try {
      // Check for validation errors
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      const { id } = req.params;
      let { date, amount, category, description, vehicle_id } = req.body;
      vehicle_id = vehicle_id === "" || vehicle_id === undefined ? null : vehicle_id;
      // Check if expense exists
      const [existingExpense] = await pool.execute("SELECT id FROM expenses WHERE id = ?", [id]);
      if (existingExpense.length === 0) {
        return res.status(404).json({ message: "Expense not found" });
      }
      // If vehicle_id is provided, check if it exists
      if (vehicle_id) {
        const [vehicles] = await pool.execute("SELECT id FROM vehicles WHERE id = ?", [vehicle_id]);
        if (vehicles.length === 0) {
          return res.status(400).json({ message: "Vehicle ID does not exist" });
        }
      }
      // Update expense
      await pool.execute(
        "UPDATE expenses SET date = ?, amount = ?, category = ?, description = ?, vehicle_id = ? WHERE id = ?",
        [date, amount, category, description || null, vehicle_id, id]
      );
      // Get the updated expense
      const [updatedExpense] = await pool.execute("SELECT * FROM expenses WHERE id = ?", [id]);
      res.json({
        message: "Expense updated successfully",
        expense: updatedExpense[0],
      });
    } catch (error) {
      console.error("Error updating expense:", error);
      res.status(500).json({ message: "Error updating expense" });
    }
  }
);

// DELETE /api/expences/:id - Delete expense
router.delete("/:id", [authenticateToken], async (req, res) => {
  try {
    const { id } = req.params;
    // Check if expense exists
    const [existingExpense] = await pool.execute("SELECT id FROM expenses WHERE id = ?", [id]);
    if (existingExpense.length === 0) {
      return res.status(404).json({ message: "Expense not found" });
    }
    // Delete expense
    await pool.execute("DELETE FROM expenses WHERE id = ?", [id]);
    res.json({ message: "Expense deleted successfully" });
  } catch (error) {
    console.error("Error deleting expense:", error);
    res.status(500).json({ message: "Error deleting expense" });
  }
});

// GET /api/expences/stats/overview - Get expenses statistics
router.get("/stats/overview", authenticateToken, async (req, res) => {
  try {
    // Get total expenses
    const [totalResult] = await pool.execute("SELECT COUNT(*) as total FROM expenses");
    const total = totalResult[0].total;
    // Get expenses by category
    const [categoryResult] = await pool.execute(`
      SELECT category, COUNT(*) as count 
      FROM expenses 
      GROUP BY category
    `);
    // Get expenses by month
    const [monthResult] = await pool.execute(`
      SELECT DATE_FORMAT(date, '%Y-%m') as month, SUM(amount) as total_amount
      FROM expenses
      GROUP BY month
    `);
    res.json({
      total,
      byCategory: categoryResult,
      byMonth: monthResult,
    });
  } catch (error) {
    console.error("Error fetching expenses stats:", error);
    res.status(500).json({ message: "Error fetching expenses statistics" });
  }
});

module.exports = router;
