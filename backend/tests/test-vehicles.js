const fetch = require('node-fetch');

const API_BASE_URL = 'http://localhost:5000/api';

// Test data
const testVehicle = {
  vehicle_number: 'V001',
  make: 'Ford',
  model: 'Transit',
  year: 2022,
  license_plate: 'ABC123',
  fuel_type: 'diesel',
  status: 'active'
};

const updatedVehicle = {
  vehicle_number: 'V001',
  make: 'Ford',
  model: 'Transit Custom',
  year: 2023,
  license_plate: 'ABC123',
  fuel_type: 'diesel',
  status: 'maintenance'
};

let authToken = '';
let createdVehicleId = null;

// Helper function to get auth headers
const getAuthHeaders = () => ({
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${authToken}`
});

// Test 1: Login to get token
async function testLogin() {
  console.log('🔐 Testing login...');
  
  try {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username: 'admin',
        password: 'admin123'
      })
    });

    const data = await response.json();
    
    if (response.ok) {
      authToken = data.token;
      console.log('✅ Login successful');
      return true;
    } else {
      console.log('❌ Login failed:', data.message);
      return false;
    }
  } catch (error) {
    console.log('❌ Login error:', error.message);
    return false;
  }
}

// Test 2: Create vehicle
async function testCreateVehicle() {
  console.log('\n🚗 Testing create vehicle...');
  
  try {
    const response = await fetch(`${API_BASE_URL}/vehicles`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(testVehicle)
    });

    const data = await response.json();
    
    if (response.ok) {
      createdVehicleId = data.vehicle.id;
      console.log('✅ Vehicle created successfully');
      console.log('   Vehicle ID:', createdVehicleId);
      console.log('   Vehicle Number:', data.vehicle.vehicle_number);
      return true;
    } else {
      console.log('❌ Create vehicle failed:', data.message);
      if (data.errors) {
        data.errors.forEach(error => {
          console.log(`   - ${error.param}: ${error.msg}`);
        });
      }
      return false;
    }
  } catch (error) {
    console.log('❌ Create vehicle error:', error.message);
    return false;
  }
}

// Test 3: Get all vehicles
async function testGetVehicles() {
  console.log('\n📋 Testing get all vehicles...');
  
  try {
    const response = await fetch(`${API_BASE_URL}/vehicles`, {
      headers: getAuthHeaders()
    });

    const data = await response.json();
    
    if (response.ok) {
      console.log('✅ Get vehicles successful');
      console.log(`   Found ${data.vehicles.length} vehicles`);
      data.vehicles.forEach(vehicle => {
        console.log(`   - ${vehicle.vehicle_number}: ${vehicle.make} ${vehicle.model} (${vehicle.year})`);
      });
      return true;
    } else {
      console.log('❌ Get vehicles failed:', data.message);
      return false;
    }
  } catch (error) {
    console.log('❌ Get vehicles error:', error.message);
    return false;
  }
}

// Test 4: Get single vehicle
async function testGetVehicle() {
  if (!createdVehicleId) {
    console.log('❌ No vehicle ID available for get test');
    return false;
  }

  console.log('\n🔍 Testing get single vehicle...');
  
  try {
    const response = await fetch(`${API_BASE_URL}/vehicles/${createdVehicleId}`, {
      headers: getAuthHeaders()
    });

    const data = await response.json();
    
    if (response.ok) {
      console.log('✅ Get single vehicle successful');
      console.log('   Vehicle:', data.vehicle);
      return true;
    } else {
      console.log('❌ Get single vehicle failed:', data.message);
      return false;
    }
  } catch (error) {
    console.log('❌ Get single vehicle error:', error.message);
    return false;
  }
}

// Test 5: Update vehicle
async function testUpdateVehicle() {
  if (!createdVehicleId) {
    console.log('❌ No vehicle ID available for update test');
    return false;
  }

  console.log('\n✏️ Testing update vehicle...');
  
  try {
    const response = await fetch(`${API_BASE_URL}/vehicles/${createdVehicleId}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(updatedVehicle)
    });

    const data = await response.json();
    
    if (response.ok) {
      console.log('✅ Update vehicle successful');
      console.log('   Updated vehicle:', data.vehicle);
      return true;
    } else {
      console.log('❌ Update vehicle failed:', data.message);
      if (data.errors) {
        data.errors.forEach(error => {
          console.log(`   - ${error.param}: ${error.msg}`);
        });
      }
      return false;
    }
  } catch (error) {
    console.log('❌ Update vehicle error:', error.message);
    return false;
  }
}

// Test 6: Get vehicle statistics
async function testGetStats() {
  console.log('\n📊 Testing get vehicle statistics...');
  
  try {
    const response = await fetch(`${API_BASE_URL}/vehicles/stats/overview`, {
      headers: getAuthHeaders()
    });

    const data = await response.json();
    
    if (response.ok) {
      console.log('✅ Get vehicle stats successful');
      console.log('   Total vehicles:', data.total);
      console.log('   By status:', data.byStatus);
      console.log('   By fuel type:', data.byFuelType);
      return true;
    } else {
      console.log('❌ Get vehicle stats failed:', data.message);
      return false;
    }
  } catch (error) {
    console.log('❌ Get vehicle stats error:', error.message);
    return false;
  }
}

// Test 7: Delete vehicle
async function testDeleteVehicle() {
  if (!createdVehicleId) {
    console.log('❌ No vehicle ID available for delete test');
    return false;
  }

  console.log('\n🗑️ Testing delete vehicle...');
  
  try {
    const response = await fetch(`${API_BASE_URL}/vehicles/${createdVehicleId}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });

    const data = await response.json();
    
    if (response.ok) {
      console.log('✅ Delete vehicle successful');
      return true;
    } else {
      console.log('❌ Delete vehicle failed:', data.message);
      return false;
    }
  } catch (error) {
    console.log('❌ Delete vehicle error:', error.message);
    return false;
  }
}

// Run all tests
async function runAllTests() {
  console.log('🚀 Starting Vehicles API Tests...\n');
  
  const tests = [
    testLogin,
    testCreateVehicle,
    testGetVehicles,
    testGetVehicle,
    testUpdateVehicle,
    testGetStats,
    testDeleteVehicle
  ];

  let passed = 0;
  let total = tests.length;

  for (const test of tests) {
    const result = await test();
    if (result) passed++;
    
    // Small delay between tests
    await new Promise(resolve => setTimeout(resolve, 500));
  }

  console.log('\n📈 Test Results:');
  console.log(`   Passed: ${passed}/${total}`);
  console.log(`   Success Rate: ${Math.round((passed / total) * 100)}%`);
  
  if (passed === total) {
    console.log('🎉 All tests passed! Vehicles API is working correctly.');
  } else {
    console.log('⚠️ Some tests failed. Please check the errors above.');
  }
}

// Run tests if this file is executed directly
if (require.main === module) {
  runAllTests().catch(console.error);
}

module.exports = {
  testLogin,
  testCreateVehicle,
  testGetVehicles,
  testGetVehicle,
  testUpdateVehicle,
  testGetStats,
  testDeleteVehicle,
  runAllTests
}; 