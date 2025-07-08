const express = require('express');
const { body, validationResult } = require('express-validator');
const { pool } = require('../database/config');
const { authenticateToken, requireManager } = require('../middleware/auth');

const router = express.Router();

// GET /api/schedules - Get all schedules
router.get('/', authenticateToken, async (req, res) => {
  try {
    const [schedules] = await pool.execute('SELECT * FROM schedules ORDER BY date DESC, id DESC');
    res.json({ schedules });
  } catch (error) {
    console.error('Error fetching schedules:', error);
    res.status(500).json({ message: 'Error fetching schedules' });
  }
});

// GET /api/schedules/:id - Get single schedule
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const [schedules] = await pool.execute('SELECT * FROM schedules WHERE id = ?', [id]);
    if (schedules.length === 0) {
      return res.status(404).json({ message: 'Schedule not found' });
    }
    res.json({ schedule: schedules[0] });
  } catch (error) {
    console.error('Error fetching schedule:', error);
    res.status(500).json({ message: 'Error fetching schedule' });
  }
});

// POST /api/schedules - Create new schedule
router.post(
  '/',
  [
    authenticateToken,
    requireManager,
    body('date').notEmpty().withMessage('Date is required'),
    body('vehicle').notEmpty().withMessage('Vehicle is required'),
    body('driver').notEmpty().withMessage('Driver is required'),
    body('task').notEmpty().withMessage('Task is required'),
    body('status').isIn(['scheduled', 'in_progress', 'completed', 'cancelled']).withMessage('Valid status is required'),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      const { date, vehicle, driver, task, status } = req.body;
      const [result] = await pool.execute(
        'INSERT INTO schedules (date, vehicle, driver, task, status) VALUES (?, ?, ?, ?, ?)',
        [date, vehicle, driver, task, status]
      );
      const [newSchedule] = await pool.execute('SELECT * FROM schedules WHERE id = ?', [result.insertId]);
      res.status(201).json({ message: 'Schedule created successfully', schedule: newSchedule[0] });
    } catch (error) {
      console.error('Error creating schedule:', error);
      res.status(500).json({ message: 'Error creating schedule' });
    }
  }
);

// PUT /api/schedules/:id - Update schedule
router.put(
  '/:id',
  [
    authenticateToken,
    requireManager,
    body('date').notEmpty().withMessage('Date is required'),
    body('vehicle').notEmpty().withMessage('Vehicle is required'),
    body('driver').notEmpty().withMessage('Driver is required'),
    body('task').notEmpty().withMessage('Task is required'),
    body('status').isIn(['scheduled', 'in_progress', 'completed', 'cancelled']).withMessage('Valid status is required'),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      const { id } = req.params;
      const { date, vehicle, driver, task, status } = req.body;
      const [existing] = await pool.execute('SELECT id FROM schedules WHERE id = ?', [id]);
      if (existing.length === 0) {
        return res.status(404).json({ message: 'Schedule not found' });
      }
      await pool.execute(
        'UPDATE schedules SET date = ?, vehicle = ?, driver = ?, task = ?, status = ? WHERE id = ?',
        [date, vehicle, driver, task, status, id]
      );
      const [updatedSchedule] = await pool.execute('SELECT * FROM schedules WHERE id = ?', [id]);
      res.json({ message: 'Schedule updated successfully', schedule: updatedSchedule[0] });
    } catch (error) {
      console.error('Error updating schedule:', error);
      res.status(500).json({ message: 'Error updating schedule' });
    }
  }
);

// DELETE /api/schedules/:id - Delete schedule
router.delete('/:id', [authenticateToken, requireManager], async (req, res) => {
  try {
    const { id } = req.params;
    const [existing] = await pool.execute('SELECT id FROM schedules WHERE id = ?', [id]);
    if (existing.length === 0) {
      return res.status(404).json({ message: 'Schedule not found' });
    }
    await pool.execute('DELETE FROM schedules WHERE id = ?', [id]);
    res.json({ message: 'Schedule deleted successfully' });
  } catch (error) {
    console.error('Error deleting schedule:', error);
    res.status(500).json({ message: 'Error deleting schedule' });
  }
});

module.exports = router; 