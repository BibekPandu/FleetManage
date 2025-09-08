const { pool } = require("../database/config");

async function makeVehicleIdNullable() {
  const connection = await pool.getConnection();
  try {
    console.log("🔧 Altering fuel_predictions.vehicle_id to allow NULL and FK SET NULL...");

    // Check current definition
    const [columns] = await connection.execute("DESCRIBE fuel_predictions");
    const vehicleIdCol = columns.find((c) => c.Field === "vehicle_id");
    console.log("Current vehicle_id definition:", vehicleIdCol);

    // Drop FK constraint if exists (name may vary); try common names
    const fkNames = [
      "fuel_predictions_ibfk_1",
      "fuel_predictions_vehicle_id_foreign",
    ];
    for (const fk of fkNames) {
      try {
        await connection.execute(`ALTER TABLE fuel_predictions DROP FOREIGN KEY ${fk}`);
        console.log(`Dropped FK: ${fk}`);
      } catch (e) {
        // ignore if not exists
      }
    }

    // Modify column to be NULLABLE
    await connection.execute(
      "ALTER TABLE fuel_predictions MODIFY COLUMN vehicle_id INT NULL"
    );
    console.log("✅ vehicle_id is now NULLABLE");

    // Recreate FK with ON DELETE SET NULL
    await connection.execute(
      "ALTER TABLE fuel_predictions ADD CONSTRAINT fk_fuel_predictions_vehicle_id FOREIGN KEY (vehicle_id) REFERENCES vehicles(id) ON DELETE SET NULL ON UPDATE CASCADE"
    );
    console.log("✅ Recreated FK with ON DELETE SET NULL");

    console.log("🎉 Migration complete.");
  } catch (error) {
    console.error("❌ Migration failed:", error.message);
  } finally {
    connection.release();
    process.exit(0);
  }
}

makeVehicleIdNullable();


