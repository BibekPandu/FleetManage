const http = require('http');

const API_BASE_URL = 'http://localhost:5000/api';

function makeRequest(path, method = 'POST', data = null) {
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

async function testStaffCreation() {
  console.log('🧪 Testing Staff Creation...');
  
  // Test data for staff creation
  const testStaff = {
    username: 'testdriver1',
    email: 'testdriver1@fleetfox.com',
    first_name: 'Test',
    last_name: 'Driver',
    role: 'driver',
    phone: '1234567890',
    license_number: 'DL123456'
  };
  
  try {
    console.log('📋 Testing POST /api/staff...');
    console.log('📤 Sending data:', testStaff);
    
    const response = await makeRequest('/staff', 'POST', testStaff);
    console.log('📥 Response Status:', response.status);
    console.log('📥 Response Data:', JSON.stringify(response.data, null, 2));
    
    if (response.status === 201) {
      console.log('✅ Staff creation successful!');
    } else {
      console.log('❌ Staff creation failed!');
    }
  } catch (error) {
    console.log('❌ Staff creation test failed:', error.message);
  }
}

async function testStaffList() {
  console.log('\n🧪 Testing Staff List...');
  
  try {
    console.log('📋 Testing GET /api/staff...');
    
    const response = await makeRequest('/staff', 'GET');
    console.log('📥 Response Status:', response.status);
    
    if (response.status === 200) {
      console.log('✅ Staff list successful! Found', response.data?.staff?.length || 0, 'staff members');
    } else {
      console.log('❌ Staff list failed!');
      console.log('📥 Response Data:', JSON.stringify(response.data, null, 2));
    }
  } catch (error) {
    console.log('❌ Staff list test failed:', error.message);
  }
}

async function runTests() {
  console.log('🚀 Starting Staff API Tests...\n');
  
  await testStaffList();
  await testStaffCreation();
  
  console.log('\n✅ Staff API Tests completed!');
}

runTests().catch(console.error); 