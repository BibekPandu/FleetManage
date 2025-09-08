const express = require('express');
const { body, validationResult } = require('express-validator');
const { pool } = require('../database/config');
const { authenticateToken, requireManager } = require('../middleware/auth');

const router = express.Router();

// GET /api/staff - Get all staff
router.get('/', authenticateToken, async (req, res) => {
  try {
    const [staff] = await pool.execute(`
      SELECT * FROM staff 
      ORDER BY created_at DESC
    `);
    
    res.json({ staff });
  } catch (error) {
    console.error('Error fetching staff:', error);
    res.status(500).json({ message: 'Error fetching staff' });
  }
});

// GET /api/staff/:id - Get single staff member
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    
    const [staff] = await pool.execute(
      'SELECT * FROM staff WHERE id = ?',
      [id]
    );
    
    if (staff.length === 0) {
      return res.status(404).json({ message: 'Staff member not found' });
    }
    
    res.json({ staff: staff[0] });
  } catch (error) {
    console.error('Error fetching staff member:', error);
    res.status(500).json({ message: 'Error fetching staff member' });
  }
});

// POST /api/staff - Create new staff member
router.post('/', [
  authenticateToken,
  body('username').notEmpty().withMessage('Username is required'),
  body('role').isIn(['driver', 'mechanic', 'manager', 'admin']).withMessage('Valid role is required')
], async (req, res) => {
  try {
    if (process.env.NODE_ENV !== 'production') {
      console.log('🔍 POST /api/staff - Request body:', req.body);
      console.log('👤 Current user:', req.user);
    }
    
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      if (process.env.NODE_ENV !== 'production') {
        console.log('❌ Validation errors:', errors.array());
      }
      return res.status(400).json({ errors: errors.array() });
    }

    const { username, role, status = 'active' } = req.body;
    if (process.env.NODE_ENV !== 'production') {
      console.log('📝 Creating staff with:', { username, role, status });
    }

    // Check if username already exists
    const [existingStaff] = await pool.execute(
      'SELECT id FROM staff WHERE username = ?',
      [username]
    );

    if (existingStaff.length > 0) {
      if (process.env.NODE_ENV !== 'production') {
        console.log('❌ Username already exists:', username);
      }
      return res.status(400).json({ message: 'Username already exists' });
    }

    // Insert new staff member
    const [result] = await pool.execute(
      'INSERT INTO staff (username, role, status) VALUES (?, ?, ?)',
      [username, role, status]
    );

    // Get the created staff member
    const [newStaff] = await pool.execute(
      'SELECT * FROM staff WHERE id = ?',
      [result.insertId]
    );

    if (process.env.NODE_ENV !== 'production') {
      console.log('✅ Staff created successfully:', newStaff[0]);
    }

    res.status(201).json({
      message: 'Staff member created successfully',
      staff: newStaff[0]
    });

  } catch (error) {
    console.error('❌ Error creating staff member:', error);
    res.status(500).json({ message: 'Error creating staff member' });
  }
});

// PUT /api/staff/:id - Update staff member
router.put('/:id', [
  authenticateToken,
  requireManager,
  body('username').notEmpty().withMessage('Username is required'),
  body('role').isIn(['driver', 'mechanic', 'manager', 'admin']).withMessage('Valid role is required'),
  body('status').isIn(['active', 'inactive']).withMessage('Valid status is required')
], async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { id } = req.params;
    const { username, role, status } = req.body;

    // Check if staff member exists
    const [existingStaff] = await pool.execute(
      'SELECT id FROM staff WHERE id = ?',
      [id]
    );

    if (existingStaff.length === 0) {
      return res.status(404).json({ message: 'Staff member not found' });
    }

    // Check if username already exists (excluding current staff member)
    const [duplicateUsername] = await pool.execute(
      'SELECT id FROM staff WHERE username = ? AND id != ?',
      [username, id]
    );

    if (duplicateUsername.length > 0) {
      return res.status(400).json({ message: 'Username already exists' });
    }

    // Update staff member
    await pool.execute(
      'UPDATE staff SET username = ?, role = ?, status = ? WHERE id = ?',
      [username, role, status, id]
    );

    // Get the updated staff member
    const [updatedStaff] = await pool.execute(
      'SELECT * FROM staff WHERE id = ?',
      [id]
    );

    res.json({
      message: 'Staff member updated successfully',
      staff: updatedStaff[0]
    });

  } catch (error) {
    console.error('Error updating staff member:', error);
    res.status(500).json({ message: 'Error updating staff member' });
  }
});

// DELETE /api/staff/:id - Delete staff member
router.delete('/:id', [authenticateToken, requireManager], async (req, res) => {
  try {
    const { id } = req.params;

    // Check if staff member exists
    const [existingStaff] = await pool.execute(
      'SELECT id FROM staff WHERE id = ?',
      [id]
    );

    if (existingStaff.length === 0) {
      return res.status(404).json({ message: 'Staff member not found' });
    }

    // Delete staff member
    await pool.execute('DELETE FROM staff WHERE id = ?', [id]);

    res.json({ message: 'Staff member deleted successfully' });

  } catch (error) {
    console.error('Error deleting staff member:', error);
    res.status(500).json({ message: 'Error deleting staff member' });
  }
});

// GET /api/staff/stats/overview - Get staff statistics
router.get('/stats/overview', authenticateToken, async (req, res) => {
  try {
    // Get total staff
    const [totalResult] = await pool.execute('SELECT COUNT(*) as total FROM staff');
    const total = totalResult[0].total;

    // Get staff by role
    const [roleResult] = await pool.execute(`
      SELECT role, COUNT(*) as count 
      FROM staff 
      GROUP BY role
    `);

    // Get staff by status
    const [statusResult] = await pool.execute(`
      SELECT status, COUNT(*) as count 
      FROM staff 
      GROUP BY status
    `);

    res.json({
      total,
      byRole: roleResult,
      byStatus: statusResult
    });

  } catch (error) {
    console.error('Error fetching staff stats:', error);
    res.status(500).json({ message: 'Error fetching staff statistics' });
  }
});

module.exports = router; 