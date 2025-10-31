const express = require('express');
const { body, validationResult } = require('express-validator');
const { pool } = require('../database/config');
const { authenticateToken, requireManager } = require('../middleware/auth');

const router = express.Router();

// GET /api/vehicles - Get all vehicles
router.get('/', authenticateToken, async (req, res) => {
  try {
    const [vehicles] = await pool.execute(`
      SELECT * FROM vehicles 
      ORDER BY created_at DESC
    `);
    
    res.json({ vehicles });
  } catch (error) {
    console.error('Error fetching vehicles:', error);
    res.status(500).json({ message: 'Error fetching vehicles' });
  }
});

// GET /api/vehicles/:id - Get single vehicle
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    
    const [vehicles] = await pool.execute(
      'SELECT * FROM vehicles WHERE id = ?',
      [id]
    );
    
    if (vehicles.length === 0) {
      return res.status(404).json({ message: 'Vehicle not found' });
    }
    
    res.json({ vehicle: vehicles[0] });
  } catch (error) {
    console.error('Error fetching vehicle:', error);
    res.status(500).json({ message: 'Error fetching vehicle' });
  }
});

// POST /api/vehicles - Create new vehicle
router.post('/', [
  authenticateToken,
  requireManager,
  body('vehicle_number').notEmpty().withMessage('Vehicle number is required'),
  body('make').notEmpty().withMessage('Make is required'),
  body('model').notEmpty().withMessage('Model is required'),
  body('year').isInt({ min: 1900, max: new Date().getFullYear() + 1 }).withMessage('Valid year is required'),
  body('license_plate').notEmpty().withMessage('License plate is required'),
  body('fuel_type').isIn(['petrol', 'diesel', 'electric', 'hybrid']).withMessage('Valid fuel type is required'),
  body('status').isIn(['active', 'maintenance', 'inactive']).withMessage('Valid status is required')
], async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { vehicle_number, make, model, year, license_plate, fuel_type, status, driver } = req.body;

    // Check if vehicle number or license plate already exists
    const [existingVehicles] = await pool.execute(
      'SELECT id FROM vehicles WHERE vehicle_number = ? OR license_plate = ?',
      [vehicle_number, license_plate]
    );

    if (existingVehicles.length > 0) {
      return res.status(400).json({ message: 'Vehicle number or license plate already exists' });
    }

    // Insert new vehicle
    const [result] = await pool.execute(
      'INSERT INTO vehicles (vehicle_number, make, model, year, license_plate, fuel_type, status) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [vehicle_number, make, model, year, license_plate, fuel_type, status]
    );

    // Optionally set driver if column exists
    if (driver && typeof driver === 'string') {
      try {
        await pool.execute(
          'UPDATE vehicles SET driver = ? WHERE id = ?',
          [driver, result.insertId]
        );
      } catch (e) {
        console.warn('Driver field not persisted on create (column may be missing):', e.message);
      }
    }

    // Get the created vehicle
    const [newVehicle] = await pool.execute(
      'SELECT * FROM vehicles WHERE id = ?',
      [result.insertId]
    );

    res.status(201).json({
      message: 'Vehicle created successfully',
      vehicle: newVehicle[0]
    });

  } catch (error) {
    console.error('Error creating vehicle:', error);
    res.status(500).json({ message: 'Error creating vehicle' });
  }
});

// PUT /api/vehicles/:id - Update vehicle
router.put('/:id', [
  authenticateToken,
  requireManager,
  body('vehicle_number').notEmpty().withMessage('Vehicle number is required'),
  body('make').notEmpty().withMessage('Make is required'),
  body('model').notEmpty().withMessage('Model is required'),
  body('year').isInt({ min: 1900, max: new Date().getFullYear() + 1 }).withMessage('Valid year is required'),
  body('license_plate').notEmpty().withMessage('License plate is required'),
  body('fuel_type').isIn(['petrol', 'diesel', 'electric', 'hybrid']).withMessage('Valid fuel type is required'),
  body('status').isIn(['active', 'maintenance', 'inactive']).withMessage('Valid status is required')
], async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { id } = req.params;
    const { vehicle_number, make, model, year, license_plate, fuel_type, status, driver } = req.body;

    // Check if vehicle exists
    const [existingVehicle] = await pool.execute(
      'SELECT id FROM vehicles WHERE id = ?',
      [id]
    );

    if (existingVehicle.length === 0) {
      return res.status(404).json({ message: 'Vehicle not found' });
    }

    // Check if vehicle number or license plate already exists (excluding current vehicle)
    const [duplicateVehicles] = await pool.execute(
      'SELECT id FROM vehicles WHERE (vehicle_number = ? OR license_plate = ?) AND id != ?',
      [vehicle_number, license_plate, id]
    );

    if (duplicateVehicles.length > 0) {
      return res.status(400).json({ message: 'Vehicle number or license plate already exists' });
    }

    // Update vehicle
    await pool.execute(
      'UPDATE vehicles SET vehicle_number = ?, make = ?, model = ?, year = ?, license_plate = ?, fuel_type = ?, status = ? WHERE id = ?',
      [vehicle_number, make, model, year, license_plate, fuel_type, status, id]
    );

    // Optionally update driver if provided
    if (typeof driver === 'string') {
      try {
        await pool.execute(
          'UPDATE vehicles SET driver = ? WHERE id = ?',
          [driver, id]
        );
      } catch (e) {
        console.warn('Driver field not persisted on update (column may be missing):', e.message);
      }
    }

    // Get the updated vehicle
    const [updatedVehicle] = await pool.execute(
      'SELECT * FROM vehicles WHERE id = ?',
      [id]
    );

    res.json({
      message: 'Vehicle updated successfully',
      vehicle: updatedVehicle[0]
    });

  } catch (error) {
    console.error('Error updating vehicle:', error);
    res.status(500).json({ message: 'Error updating vehicle' });
  }
});

// DELETE /api/vehicles/:id - Delete vehicle
router.delete('/:id', [authenticateToken, requireManager], async (req, res) => {
  try {
    const { id } = req.params;

    // Check if vehicle exists
    const [existingVehicle] = await pool.execute(
      'SELECT id FROM vehicles WHERE id = ?',
      [id]
    );

    if (existingVehicle.length === 0) {
      return res.status(404).json({ message: 'Vehicle not found' });
    }

    // Delete vehicle
    await pool.execute('DELETE FROM vehicles WHERE id = ?', [id]);

    res.json({ message: 'Vehicle deleted successfully' });

  } catch (error) {
    console.error('Error deleting vehicle:', error);
    res.status(500).json({ message: 'Error deleting vehicle' });
  }
});

// GET /api/vehicles/stats - Get vehicle statistics
router.get('/stats/overview', authenticateToken, async (req, res) => {
  try {
    // Get total vehicles
    const [totalResult] = await pool.execute('SELECT COUNT(*) as total FROM vehicles');
    const total = totalResult[0].total;

    // Get vehicles by status
    const [statusResult] = await pool.execute(`
      SELECT status, COUNT(*) as count 
      FROM vehicles 
      GROUP BY status
    `);

    // Get vehicles by fuel type
    const [fuelResult] = await pool.execute(`
      SELECT fuel_type, COUNT(*) as count 
      FROM vehicles 
      GROUP BY fuel_type
    `);

    res.json({
      total,
      byStatus: statusResult,
      byFuelType: fuelResult
    });

  } catch (error) {
    console.error('Error fetching vehicle stats:', error);
    res.status(500).json({ message: 'Error fetching vehicle statistics' });
  }
});

module.exports = router; 