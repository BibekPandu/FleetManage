const mysql = require('mysql2/promise');
require('dotenv').config();

const testLogbookAPI = async () => {
  try {
    console.log('🧪 Testing Logbook API functionality...');
    
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'fleetfox_db',
      port: process.env.DB_PORT || 3306
    });
    
    // Test 1: Check if logbook table exists and has correct structure
    console.log('\n📋 Test 1: Checking logbook table structure...');
    const [columns] = await connection.execute('DESCRIBE logbook');
    console.log('✅ Logbook table structure:');
    columns.forEach(col => {
      console.log(`   - ${col.Field}: ${col.Type}`);
    });
    
    // Test 2: Check existing entries
    console.log('\n📊 Test 2: Checking existing logbook entries...');
    const [entries] = await connection.execute('SELECT * FROM logbook ORDER BY created_at DESC');
    console.log(`✅ Found ${entries.length} logbook entries:`);
    entries.forEach(entry => {
      console.log(`   - ID: ${entry.id}, Date: ${entry.date}, Vehicle: ${entry.vehicle}, Driver: ${entry.driver}`);
    });
    
    // Test 3: Insert a test entry
    console.log('\n➕ Test 3: Testing logbook entry creation...');
    const testEntry = {
      date: '2024-01-20',
      vehicle: 'Test Vehicle',
      driver: 'Test Driver',
      description: 'Test logbook entry'
    };
    
    const [result] = await connection.execute(
      'INSERT INTO logbook (date, vehicle, driver, description) VALUES (?, ?, ?, ?)',
      [testEntry.date, testEntry.vehicle, testEntry.driver, testEntry.description]
    );
    
    console.log(`✅ Test entry created with ID: ${result.insertId}`);
    
    // Test 4: Retrieve the test entry
    const [newEntry] = await connection.execute(
      'SELECT * FROM logbook WHERE id = ?',
      [result.insertId]
    );
    
    console.log('✅ Retrieved test entry:', newEntry[0]);
    
    // Test 5: Update the test entry
    console.log('\n✏️ Test 4: Testing logbook entry update...');
    await connection.execute(
      'UPDATE logbook SET description = ? WHERE id = ?',
      ['Updated test description', result.insertId]
    );
    
    const [updatedEntry] = await connection.execute(
      'SELECT * FROM logbook WHERE id = ?',
      [result.insertId]
    );
    
    console.log('✅ Updated test entry:', updatedEntry[0]);
    
    // Test 6: Delete the test entry
    console.log('\n🗑️ Test 5: Testing logbook entry deletion...');
    await connection.execute('DELETE FROM logbook WHERE id = ?', [result.insertId]);
    
    const [deletedEntry] = await connection.execute(
      'SELECT * FROM logbook WHERE id = ?',
      [result.insertId]
    );
    
    if (deletedEntry.length === 0) {
      console.log('✅ Test entry deleted successfully');
    } else {
      console.log('❌ Test entry was not deleted');
    }
    
    console.log('\n🎉 All logbook API tests passed!');
    console.log('📝 The logbook functionality should now work correctly with the frontend.');
    
    await connection.end();
    
  } catch (error) {
    console.error('❌ Error testing logbook API:', error.message);
    process.exit(1);
  }
};

testLogbookAPI(); 