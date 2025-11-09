const mysql = require("mysql2/promise");
require("dotenv").config();

// Database configuration
const dbConfig = {
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "fleetfox_db",
  port: process.env.DB_PORT || 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
};

// Create connection pool
const pool = mysql.createPool(dbConfig);

// Test database connection
const testConnection = async () => {
  try {
    const connection = await pool.getConnection();
    console.log("✅ Database connected successfully!");
    connection.release();
    return true;
  } catch (error) {
    console.error("❌ Database connection failed:", error.message);
    return false;
  }
};

// Initialize database (create tables if they don't exist)
const initializeDatabase = async () => {
  try {
    const connection = await pool.getConnection();

    // Create users table
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(50) UNIQUE NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        role ENUM('admin', 'manager', 'driver') DEFAULT 'driver',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);

    // Create vehicles table
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS vehicles (
        id INT AUTO_INCREMENT PRIMARY KEY,
        vehicle_number VARCHAR(50) UNIQUE NOT NULL,
        make VARCHAR(50) NOT NULL,
        model VARCHAR(50) NOT NULL,
        year INT NOT NULL,
        license_plate VARCHAR(20) UNIQUE NOT NULL,
        fuel_type ENUM('petrol', 'diesel', 'electric', 'hybrid') NOT NULL,
        status ENUM('active', 'maintenance', 'inactive') DEFAULT 'active',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);

    // Ensure 'driver' column exists on vehicles table for driver assignment
    try {
      const [driverCol] = await connection.execute(`
        SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS 
        WHERE TABLE_SCHEMA = DATABASE() 
          AND TABLE_NAME = 'vehicles' 
          AND COLUMN_NAME = 'driver'
      `);
      if (driverCol.length === 0) {
        await connection.execute(`
          ALTER TABLE vehicles ADD COLUMN driver VARCHAR(100) NULL AFTER status
        `);
      }
    } catch (e) {
      console.warn("⚠️ Unable to verify/add 'driver' column on vehicles table:", e.message);
    }

    // Create staff table
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS staff (
        id INT AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(50) UNIQUE NOT NULL,
        role ENUM('driver', 'mechanic', 'manager', 'admin') NOT NULL,
    
        status ENUM('active', 'inactive') DEFAULT 'active',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);

    // Create logbook table
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS logbook (
        id INT AUTO_INCREMENT PRIMARY KEY,
        date DATE NOT NULL,
        vehicle VARCHAR(100) NOT NULL,
        driver VARCHAR(100) NOT NULL,
        description TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);

    // Create schedules table (simple schema)
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS schedules (
        id INT AUTO_INCREMENT PRIMARY KEY,
        date DATE NOT NULL,
        vehicle VARCHAR(100) NOT NULL,
        driver VARCHAR(100) NOT NULL,
        task VARCHAR(100) NOT NULL,
        status ENUM('scheduled', 'in_progress', 'completed', 'cancelled') DEFAULT 'scheduled',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);

    // Create fuel_predictions table
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS fuel_predictions (
        id INT AUTO_INCREMENT PRIMARY KEY,
        vehicle_id INT NULL,
        predicted_date DATE NOT NULL,
        predicted_consumption DECIMAL(10,2) NOT NULL,
        actual_consumption DECIMAL(10,2),
        accuracy_percentage DECIMAL(5,2),
        factors_considered TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (vehicle_id) REFERENCES vehicles(id) ON DELETE SET NULL
      )
    `);

    // Ensure fuel_predictions.vehicle_id is nullable and FK deletes set NULL (migrate older schema)
    try {
      // Check if vehicle_id is NOT NULL currently
      const [vehNullCheck] = await connection.execute(`
        SELECT IS_NULLABLE, COLUMN_TYPE
        FROM INFORMATION_SCHEMA.COLUMNS
        WHERE TABLE_SCHEMA = DATABASE()
          AND TABLE_NAME = 'fuel_predictions'
          AND COLUMN_NAME = 'vehicle_id'
      `);
      const isNullable = vehNullCheck[0] && vehNullCheck[0].IS_NULLABLE === 'YES';
      if (!isNullable) {
        // Find and drop the existing foreign key constraint on vehicle_id
        const [fkRows] = await connection.execute(`
          SELECT CONSTRAINT_NAME
          FROM INFORMATION_SCHEMA.KEY_COLUMN_USAGE
          WHERE TABLE_SCHEMA = DATABASE()
            AND TABLE_NAME = 'fuel_predictions'
            AND COLUMN_NAME = 'vehicle_id'
            AND REFERENCED_TABLE_NAME IS NOT NULL
        `);
        if (fkRows.length) {
          for (const row of fkRows) {
            try {
              await connection.execute(
                `ALTER TABLE fuel_predictions DROP FOREIGN KEY \`${row.CONSTRAINT_NAME}\``
              );
            } catch (e) {
              console.warn('⚠️ Unable to drop FK on fuel_predictions:', e.message);
            }
          }
        }
        // Modify column to allow NULL
        await connection.execute(
          'ALTER TABLE fuel_predictions MODIFY COLUMN vehicle_id INT NULL'
        );
        // Recreate FK with ON DELETE SET NULL
        await connection.execute(
          'ALTER TABLE fuel_predictions ADD CONSTRAINT fk_fuel_predictions_vehicle_id FOREIGN KEY (vehicle_id) REFERENCES vehicles(id) ON DELETE SET NULL'
        );
      }
    } catch (e) {
      console.warn("⚠️ Fuel predictions schema migration warning:", e.message);
    }

    // Create reports table
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS reports (
        id INT AUTO_INCREMENT PRIMARY KEY,
        report_type ENUM('fuel_consumption', 'maintenance', 'driver_performance', 'vehicle_utilization') NOT NULL,
        title VARCHAR(100) NOT NULL,
        description TEXT,
        generated_by INT NOT NULL,
        report_data JSON,
        generated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (generated_by) REFERENCES users(id) ON DELETE CASCADE
      )
    `);

    // Create expenses table
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS expenses (
        id INT AUTO_INCREMENT PRIMARY KEY,
        date DATE NOT NULL,
        amount DECIMAL(10,2) NOT NULL,
        category VARCHAR(50) NOT NULL,
        description TEXT,
        vehicle_id INT,
        driver VARCHAR(100) NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (vehicle_id) REFERENCES vehicles(id) ON DELETE SET NULL
      )
    `);

    // Ensure 'driver' column exists on expenses (for persisting selected driver)
    try {
      const [expDriverCol] = await connection.execute(`
        SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS 
        WHERE TABLE_SCHEMA = DATABASE() 
          AND TABLE_NAME = 'expenses' 
          AND COLUMN_NAME = 'driver'
      `);
      if (expDriverCol.length === 0) {
        await connection.execute(`
          ALTER TABLE expenses ADD COLUMN driver VARCHAR(100) NULL AFTER vehicle_id
        `);
      }
    } catch (e) {
      console.warn("⚠️ Unable to verify/add 'driver' column on expenses table:", e.message);
    }

    console.log("✅ Database tables created successfully!");
    connection.release();
    return true;
  } catch (error) {
    console.error("❌ Database initialization failed:", error.message);
    return false;
  }
};

module.exports = {
  pool,
  testConnection,
  initializeDatabase,
};
