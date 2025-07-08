const http = require('http');

const API_BASE_URL = 'http://localhost:5000/api';

// Test data
const testStaff = {
  username: 'testdriver',
  email: 'testdriver@fleetfox.com',
  first_name: 'Test',
  last_name: 'Driver',
  role: 'driver',
  phone: '1234567890',
  license_number: 'DL123456'
};

const testLogbook = {
  vehicle_id: 1,
  driver_id: 1,
  trip_type: 'delivery',
  start_location: 'Warehouse A',
  end_location: 'Customer B',
  start_time: '2024-01-15T08:00:00',
  end_time: '2024-01-15T10:00:00',
  distance_km: 25.5,
  fuel_consumed: 5.2,
  notes: 'Test delivery trip'
};

function makeRequest(path, method = 'GET', data = null) {
  return new Promise((resolve, reject) => {
    const url = new URL(path, API_BASE_URL);
    
    const options = {
      hostname: url.hostname,
      port: url.port,
      path: url.pathname,
      method: method,
      headers: {
        'Content-Type': 'application/json'
      }
    };

    if (data) {
      const postData = JSON.stringify(data);
      options.headers['Content-Length'] = Buffer.byteLength(postData);
    }

    const req = http.request(options, (res) => {
      let body = '';
      
      res.on('data', (chunk) => {
        body += chunk;
      });
      
      res.on('end', () => {
        try {
          const response = {
            status: res.statusCode,
            data: body ? JSON.parse(body) : null
          };
          resolve(response);
        } catch (error) {
          resolve({
            status: res.statusCode,
            data: body
          });
        }
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    if (data) {
      req.write(JSON.stringify(data));
    }
    
    req.end();
  });
}

async function testStaffAPI() {
  console.log('🧪 Testing Staff API...');
  
  try {
    // Test GET /api/staff
    console.log('📋 Testing GET /api/staff...');
    const response = await makeRequest('/staff');
    console.log('Status:', response.status);
    
    if (response.status === 200) {
      console.log('✅ Staff API working! Found', response.data?.staff?.length || 0, 'staff members');
    } else {
      console.log('❌ Staff API error:', response.data);
    }
  } catch (error) {
    console.log('❌ Staff API test failed:', error.message);
  }
}

async function testLogbookAPI() {
  console.log('\n🧪 Testing Logbook API...');
  
  try {
    // Test GET /api/logbook
    console.log('📋 Testing GET /api/logbook...');
    const response = await makeRequest('/logbook');
    console.log('Status:', response.status);
    
    if (response.status === 200) {
      console.log('✅ Logbook API working! Found', response.data?.entries?.length || 0, 'entries');
    } else {
      console.log('❌ Logbook API error:', response.data);
    }
  } catch (error) {
    console.log('❌ Logbook API test failed:', error.message);
  }
}

async function runTests() {
  console.log('🚀 Starting API Tests...\n');
  
  await testStaffAPI();
  await testLogbookAPI();
  
  console.log('\n✅ API Tests completed!');
}

runTests().catch(console.error); 