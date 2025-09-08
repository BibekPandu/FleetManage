const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { testConnection, initializeDatabase } = require('./database/config');

// Load environment variables
dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Basic route for testing
app.get('/api/test', (req, res) => {
  res.json({ message: 'FleetFox Backend is running!' });
});

// Import routes
const authRoutes = require('./routes/auth');
const vehicleRoutes = require('./routes/vehicles');
const staffRoutes = require('./routes/staff');
const logbookRoutes = require('./routes/logbook');
const schedulesRouter = require('./routes/schedules');
const expencesRouter = require('./routes/expences');
const fuelPredictionRoutes = require('./routes/fuelPrediction');
// const reportRoutes = require('./routes/reports');

// Use routes
app.use('/api/auth', authRoutes);
app.use('/api/vehicles', vehicleRoutes);
app.use('/api/staff', staffRoutes);
app.use('/api/logbook', logbookRoutes);
app.use('/api/schedules', schedulesRouter);
app.use('/api/expences', expencesRouter);
app.use('/api/fuel-prediction', fuelPredictionRoutes);
// app.use('/api/reports', reportRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// Initialize database (one-time per cold start)
let databaseInitialized = false;
const initializeIfNeeded = async () => {
  try {
    const isConnected = await testConnection();
    if (!isConnected) {
      console.error('❌ Failed to connect to database. Please check your MySQL configuration.');
      return;
    }

    if (!databaseInitialized) {
      const isInitialized = await initializeDatabase();
      if (!isInitialized) {
        console.error('❌ Failed to initialize database tables.');
        return;
      }
      databaseInitialized = true;
    }
  } catch (error) {
    console.error('❌ Server initialization failed:', error);
  }
};

// For traditional server usage (local dev), start listening if run directly
if (require.main === module) {
  const PORT = process.env.PORT || 5000;
  (async () => {
    try {
      await initializeIfNeeded();
      app.listen(PORT, () => {
        if (process.env.NODE_ENV !== 'production') {
          console.log(`🚀 FleetFox Backend running on port ${PORT}`);
          console.log(`📊 Test the API: http://localhost:${PORT}/api/test`);
          console.log(`🔐 Auth endpoints: http://localhost:${PORT}/api/auth`);
          console.log(`🚗 Vehicle endpoints: http://localhost:${PORT}/api/vehicles`);
          console.log(`👥 Staff endpoints: http://localhost:${PORT}/api/staff`);
          console.log(`📝 Logbook endpoints: http://localhost:${PORT}/api/logbook`);
          console.log(`⛽ Fuel prediction endpoints: http://localhost:${PORT}/api/fuel-prediction`);
        }
      });
    } catch (error) {
      console.error('❌ Server startup failed:', error);
      process.exit(1);
    }
  })();
}

module.exports = { app, initializeIfNeeded };