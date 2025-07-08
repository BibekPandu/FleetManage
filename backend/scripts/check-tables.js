const mysql = require('mysql2/promise');
require('dotenv').config();

const checkTables = async () => {
  try {
    const connection = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: '',
      database: 'fleetfox_db'
    });
    
    console.log('🔍 Checking database tables...');
    
    const [tables] = await connection.execute('SHOW TABLES');
    console.log('📋 Tables in database:');
    tables.forEach(table => {
      console.log(`   - ${Object.values(table)[0]}`);
    });
    
    // Check staff table structure
    try {
      const [staffColumns] = await connection.execute('DESCRIBE staff');
      console.log('\n👥 Staff table columns:');
      staffColumns.forEach(col => {
        console.log(`   - ${col.Field}: ${col.Type}`);
      });
    } catch (error) {
      console.log('❌ Staff table does not exist or has issues');
    }
    
    // Check logbook table structure
    try {
      const [logbookColumns] = await connection.execute('DESCRIBE logbook');
      console.log('\n📝 Logbook table columns:');
      logbookColumns.forEach(col => {
        console.log(`   - ${col.Field}: ${col.Type}`);
      });
    } catch (error) {
      console.log('❌ Logbook table does not exist or has issues');
    }
    
    await connection.end();
    
  } catch (error) {
    console.error('❌ Error checking database:', error.message);
  }
};

checkTables(); 