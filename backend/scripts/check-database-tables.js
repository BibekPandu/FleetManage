const { pool } = require("../database/config");

async function checkDatabaseTables() {
  try {
    console.log("🔍 Checking Database Tables...\n");

    // Get all tables
    const [tables] = await pool.execute("SHOW TABLES");
    console.log("📋 All Tables in Database:");
    tables.forEach((table, index) => {
      const tableName = Object.values(table)[0];
      console.log(`  ${index + 1}. ${tableName}`);
    });

    console.log("\n📊 Table Structures:");

    // Check each table structure
    for (const table of tables) {
      const tableName = Object.values(table)[0];
      console.log(`\n🔍 Table: ${tableName}`);

      try {
        const [columns] = await pool.execute(`DESCRIBE ${tableName}`);
        console.log("  Columns:");
        columns.forEach((col) => {
          console.log(
            `    - ${col.Field}: ${col.Type} ${
              col.Null === "NO" ? "NOT NULL" : "NULL"
            } ${col.Key ? `(${col.Key})` : ""}`
          );
        });

        // Count rows
        const [countResult] = await pool.execute(
          `SELECT COUNT(*) as count FROM ${tableName}`
        );
        console.log(`  Rows: ${countResult[0].count}`);
      } catch (error) {
        console.log(`  ❌ Error checking table ${tableName}:`, error.message);
      }
    }

    // Check specific tables that frontend expects
    console.log("\n🎯 Frontend Expected Tables Check:");
    const expectedTables = [
      "users",
      "vehicles",
      "staff",
      "logbook",
      "schedules",
      "reports",
    ];

    for (const expectedTable of expectedTables) {
      const [exists] = await pool.execute(
        `
        SELECT COUNT(*) as count 
        FROM information_schema.tables 
        WHERE table_schema = DATABASE() 
        AND table_name = ?
      `,
        [expectedTable]
      );

      if (exists[0].count > 0) {
        console.log(`  ✅ ${expectedTable}: EXISTS`);
      } else {
        console.log(`  ❌ ${expectedTable}: MISSING`);
      }
    }
  } catch (error) {
    console.error("❌ Error checking database:", error);
  } finally {
    process.exit(0);
  }
}

checkDatabaseTables();
