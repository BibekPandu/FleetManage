const fetch = require('node-fetch');

const API_BASE = 'http://localhost:5000/api';

async function testSimplifiedSystem() {
  console.log('🧪 Testing Simplified FleetFox System...\n');

  try {
    // Test 1: Login
    console.log('1️⃣ Testing Login...');
    const loginResponse = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username: 'admin',
        password: 'admin123'
      })
    });

    if (!loginResponse.ok) {
      throw new Error('Login failed');
    }

    const loginData = await loginResponse.json();
    const token = loginData.token;
    console.log('✅ Login successful\n');

    // Test 2: Get Staff
    console.log('2️⃣ Testing Staff API...');
    const staffResponse = await fetch(`${API_BASE}/staff`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    if (!staffResponse.ok) {
      throw new Error('Staff fetch failed');
    }

    const staffData = await staffResponse.json();
    console.log(`✅ Found ${staffData.staff.length} staff members`);
    console.log('📋 Staff fields:', Object.keys(staffData.staff[0] || {}));
    console.log('');

    // Test 3: Get Logbook
    console.log('3️⃣ Testing Logbook API...');
    const logbookResponse = await fetch(`${API_BASE}/logbook`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    if (!logbookResponse.ok) {
      throw new Error('Logbook fetch failed');
    }

    const logbookData = await logbookResponse.json();
    console.log(`✅ Found ${logbookData.entries.length} logbook entries`);
    console.log('📋 Logbook fields:', Object.keys(logbookData.entries[0] || {}));
    console.log('');

    // Test 4: Add Staff
    console.log('4️⃣ Testing Add Staff...');
    const addStaffResponse = await fetch(`${API_BASE}/staff`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name: 'Test Driver',
        role: 'driver',
        status: 'active'
      })
    });

    if (!addStaffResponse.ok) {
      throw new Error('Add staff failed');
    }

    const newStaff = await addStaffResponse.json();
    console.log('✅ Staff added successfully:', newStaff.staff.name);
    console.log('');

    // Test 5: Add Logbook Entry
    console.log('5️⃣ Testing Add Logbook Entry...');
    const addLogResponse = await fetch(`${API_BASE}/logbook`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        date: '2024-01-16',
        vehicle: 'Test Vehicle',
        driver: 'Test Driver',
        description: 'Test route'
      })
    });

    if (!addLogResponse.ok) {
      throw new Error('Add logbook entry failed');
    }

    const newLog = await addLogResponse.json();
    console.log('✅ Logbook entry added successfully');
    console.log('');

    console.log('🎉 All tests passed! System is simplified and working.');
    console.log('\n📊 Summary:');
    console.log('  - Staff: name, role, status');
    console.log('  - Logbook: date, vehicle, driver, description');
    console.log('  - Forms are now short and simple');
    console.log('  - Ready for round-robin scheduling algorithm!');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

testSimplifiedSystem(); 