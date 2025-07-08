const bcrypt = require("bcryptjs");
const { pool } = require("../database/config");

const createAdminUser = async () => {
  try {
    const connection = await pool.getConnection();

    // Check if admin user already exists
    const [existingUsers] = await connection.execute(
      "SELECT id FROM users WHERE username = ? OR email = ?",
      ["admin", "admin@fleetfox.com"]
    );

    if (existingUsers.length > 0) {
      console.log("✅ Admin user already exists!");
      connection.release();
      return;
    }

    // Create admin user
    const hashedPassword = await bcrypt.hash("admin123", 10);

    await connection.execute(
      "INSERT INTO users (username, email, password, role) VALUES (?, ?, ?, ?)",
      ["admin", "admin@fleetfox.com", hashedPassword, "admin"]
    );

    console.log("✅ Admin user created successfully!");
    console.log("📧 Email: admin@fleetfox.com");
    console.log("🔑 Password: admin123");
    console.log("👤 Role: admin");

    connection.release();
  } catch (error) {
    console.error("❌ Error creating admin user:", error);
  } finally {
    process.exit(0);
  }
};

createAdminUser();
