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
// const reportRoutes = require('./routes/reports');
// const fuelPredictionRoutes = require('./routes/fuel-prediction');

// Use routes
app.use('/api/auth', authRoutes);
app.use('/api/vehicles', vehicleRoutes);
app.use('/api/staff', staffRoutes);
app.use('/api/logbook', logbookRoutes);
app.use('/api/schedules', schedulesRouter);
// app.use('/api/reports', reportRoutes);
// app.use('/api/fuel-prediction', fuelPredictionRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

const PORT = process.env.PORT || 5000;

// Initialize database and start server
const startServer = async () => {
  try {
    // Test database connection
    const isConnected = await testConnection();
    if (!isConnected) {
      console.error('❌ Failed to connect to database. Please check your MySQL configuration.');
      process.exit(1);
    }

    // Initialize database tables
    const isInitialized = await initializeDatabase();
    if (!isInitialized) {
      console.error('❌ Failed to initialize database tables.');
      process.exit(1);
    }

    // Start the server
    app.listen(PORT, () => {
      console.log(`🚀 FleetFox Backend running on port ${PORT}`);
      console.log(`📊 Test the API: http://localhost:${PORT}/api/test`);
      console.log(`🔐 Auth endpoints: http://localhost:${PORT}/api/auth`);
      console.log(`🚗 Vehicle endpoints: http://localhost:${PORT}/api/vehicles`);
      console.log(`👥 Staff endpoints: http://localhost:${PORT}/api/staff`);
      console.log(`📝 Logbook endpoints: http://localhost:${PORT}/api/logbook`);
    });

  } catch (error) {
    console.error('❌ Server startup failed:', error);
    process.exit(1);
  }
};

startServer(); 