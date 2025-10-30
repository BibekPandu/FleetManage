const express = require('express');
const { body, validationResult } = require('express-validator');
const { pool } = require('../database/config');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Nepal context: default fuel prices in NPR (can be overridden via .env or request)
const NEPAL_FUEL_PRICES_NPR = {
  diesel: parseFloat(process.env.DIESEL_PRICE_NPR || "175"),
  gasoline: parseFloat(process.env.PETROL_PRICE_NPR || "190"),
  electric: parseFloat(process.env.ELECTRIC_EQUIV_PRICE_NPR || "0"),
  hybrid: parseFloat(process.env.HYBRID_PRICE_NPR || "185"),
};

// Multiple Regression Coefficients (trained on historical data)
// These coefficients represent the impact of each factor on fuel consumption
const REGRESSION_COEFFICIENTS = {
  // Base fuel consumption (liters per 100km)
  intercept: 8.5,
  
  // Vehicle type coefficients (additional consumption)
  vehicleType: {
    van: 0,
    truck: 2.5,
    sedan: -1.2,
    suv: 1.8,
    bus: 4.2
  },
  
  // Engine type coefficients
  engineType: {
    diesel: 0,
    gasoline: 1.8,
    electric: -3.5,
    hybrid: -1.2
  },
  
  // Load coefficient (per 100kg)
  loadCoefficient: 0.15,
  
  // Speed coefficient (per 10 km/h above 60)
  speedCoefficient: 0.08,
  
  // Distance coefficient (per 100km)
  distanceCoefficient: 0.02,
  
  // Age coefficient (per year)
  ageCoefficient: 0.3,
  
  // Weather conditions
  weather: {
    sunny: 0,
    rainy: 0.5,
    snowy: 1.2,
    windy: 0.3
  },
  
  // Terrain type
  terrain: {
    flat: 0,
    hilly: 0.8,
    mountainous: 1.5,
    urban: 0.4
  }
};

// Calculate fuel consumption using multiple regression
const calculateFuelConsumption = (inputData) => {
  try {
    let fuelConsumption = REGRESSION_COEFFICIENTS.intercept;
    
    // Vehicle type impact
    fuelConsumption += REGRESSION_COEFFICIENTS.vehicleType[inputData.vehicleType] || 0;
    
    // Engine type impact
    fuelConsumption += REGRESSION_COEFFICIENTS.engineType[inputData.engineType] || 0;
    
    // Load impact (per 100kg)
    const loadImpact = (inputData.averageLoad / 100) * REGRESSION_COEFFICIENTS.loadCoefficient;
    fuelConsumption += loadImpact;
    
    // Speed impact (per 10 km/h above 60)
    const speedImpact = Math.max(0, (inputData.averageSpeed - 60) / 10) * REGRESSION_COEFFICIENTS.speedCoefficient;
    fuelConsumption += speedImpact;
    
    // Distance impact (per 100km)
    const distanceImpact = (inputData.distance / 100) * REGRESSION_COEFFICIENTS.distanceCoefficient;
    fuelConsumption += distanceImpact;
    
    // Age impact
    const ageImpact = inputData.vehicleAge * REGRESSION_COEFFICIENTS.ageCoefficient;
    fuelConsumption += ageImpact;
    
    // Weather impact
    fuelConsumption += REGRESSION_COEFFICIENTS.weather[inputData.weather] || 0;
    
    // Terrain impact
    fuelConsumption += REGRESSION_COEFFICIENTS.terrain[inputData.terrain] || 0;
    
    // Calculate total fuel needed for the trip
    const totalFuelNeeded = (fuelConsumption * inputData.distance) / 100;
    
    // Calculate cost in NPR (Nepal) - allow explicit override from request
    const fallbackPrice =
      NEPAL_FUEL_PRICES_NPR[inputData.engineType] ?? NEPAL_FUEL_PRICES_NPR.diesel;
    const fuelPriceNpr =
      typeof inputData.fuelPriceNPR === 'number' && !Number.isNaN(inputData.fuelPriceNPR)
        ? inputData.fuelPriceNPR
        : fallbackPrice;
    const totalCostNpr = totalFuelNeeded * fuelPriceNpr;
    
    return {
      fuelConsumptionPer100km: Math.round(fuelConsumption * 100) / 100,
      totalFuelNeeded: Math.round(totalFuelNeeded * 100) / 100,
      totalCost: Math.round(totalCostNpr * 100) / 100,
      fuelPrice: Math.round(fuelPriceNpr * 100) / 100,
      currency: 'NPR',
      distance: inputData.distance,
      efficiency: Math.round((inputData.distance / totalFuelNeeded) * 100) / 100 // km/l
    };
  } catch (error) {
    console.error('Error calculating fuel consumption:', error);
    throw new Error('Failed to calculate fuel consumption');
  }
};

// POST /api/fuel-prediction/predict - Predict fuel consumption
router.post('/predict', [
  authenticateToken,
  body('vehicleType').isIn(['van', 'truck', 'sedan', 'suv', 'bus']).withMessage('Valid vehicle type is required'),
  body('engineType').isIn(['diesel', 'gasoline', 'electric', 'hybrid']).withMessage('Valid engine type is required'),
  body('averageLoad').isFloat({ min: 0, max: 5000 }).withMessage('Average load must be between 0 and 5000 kg'),
  body('averageSpeed').isFloat({ min: 10, max: 120 }).withMessage('Average speed must be between 10 and 120 km/h'),
  body('distance').isFloat({ min: 1, max: 1000 }).withMessage('Distance must be between 1 and 1000 km'),
  body('vehicleAge').isFloat({ min: 0, max: 20 }).withMessage('Vehicle age must be between 0 and 20 years'),
  body('weather').isIn(['sunny', 'rainy', 'snowy', 'windy']).withMessage('Valid weather condition is required'),
  body('terrain').isIn(['flat', 'hilly', 'mountainous', 'urban']).withMessage('Valid terrain type is required'),
  body('fuelPriceNPR').optional().isFloat({ min: 0 }).withMessage('Fuel price must be a positive number')
], async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const inputData = req.body;
    if (process.env.NODE_ENV !== 'production') {
      console.log('🔍 Fuel prediction request:', inputData);
    }

    // Calculate fuel consumption using multiple regression
    const prediction = calculateFuelConsumption(inputData);
    
    // Store prediction in database for historical analysis
    const [result] = await pool.execute(
      `INSERT INTO fuel_predictions 
       (vehicle_id, predicted_date, predicted_consumption, factors_considered) 
       VALUES (?, ?, ?, ?)`,
      [
        inputData.vehicleId || null,
        new Date(),
        prediction.totalFuelNeeded,
        JSON.stringify(inputData)
      ]
    );

    if (process.env.NODE_ENV !== 'production') {
      console.log('✅ Fuel prediction completed:', prediction);
    }

    res.json({
      message: 'Fuel prediction completed successfully',
      prediction: {
        ...prediction,
        inputFactors: inputData,
        predictionId: result.insertId
      }
    });

  } catch (error) {
    console.error('❌ Error in fuel prediction:', error);
    res.status(500).json({ message: 'Error calculating fuel prediction' });
  }
});

// GET /api/fuel-prediction/history - Get prediction history
router.get('/history', authenticateToken, async (req, res) => {
  try {
    const [predictions] = await pool.execute(`
      SELECT fp.*, v.vehicle_number, v.make, v.model
      FROM fuel_predictions fp
      LEFT JOIN vehicles v ON fp.vehicle_id = v.id
      ORDER BY fp.created_at DESC
      LIMIT 50
    `);
    
    res.json({ predictions });
  } catch (error) {
    console.error('Error fetching prediction history:', error);
    res.status(500).json({ message: 'Error fetching prediction history' });
  }
});

// GET /api/fuel-prediction/analytics - Get prediction analytics
router.get('/analytics', authenticateToken, async (req, res) => {
  try {
    // Get total predictions
    const [totalResult] = await pool.execute('SELECT COUNT(*) as total FROM fuel_predictions');
    
    // Get average prediction accuracy (if actual consumption is available)
    const [accuracyResult] = await pool.execute(`
      SELECT AVG(accuracy_percentage) as avgAccuracy 
      FROM fuel_predictions 
      WHERE accuracy_percentage IS NOT NULL
    `);
    
    // Get predictions by vehicle type
    const [vehicleTypeResult] = await pool.execute(`
      SELECT 
        JSON_EXTRACT(factors_considered, '$.vehicleType') as vehicleType,
        COUNT(*) as count,
        AVG(predicted_consumption) as avgConsumption
      FROM fuel_predictions 
      GROUP BY vehicleType
    `);
    
    res.json({
      totalPredictions: totalResult[0].total,
      averageAccuracy: accuracyResult[0].avgAccuracy || 0,
      byVehicleType: vehicleTypeResult
    });
  } catch (error) {
    console.error('Error fetching prediction analytics:', error);
    res.status(500).json({ message: 'Error fetching prediction analytics' });
  }
});

// POST /api/fuel-prediction/reset-history - Only for admin, clears all prediction history
router.post(
  '/reset-history',
  authenticateToken,
  async (req, res) => {
    try {
      if (!req.user || req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Forbidden: Admins only' });
      }
      await pool.execute('DELETE FROM fuel_predictions');
      res.json({ message: 'Fuel prediction history cleared' });
    } catch (error) {
      console.error('Error clearing prediction history:', error);
      res.status(500).json({ message: 'Failed to clear prediction history' });
    }
  }
);

module.exports = router; 