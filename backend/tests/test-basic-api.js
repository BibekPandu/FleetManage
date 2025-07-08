const http = require('http');

function testBasicAPI() {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'localhost',
      port: 5000,
      path: '/api/test',
      method: 'GET'
    };

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
    
    req.end();
  });
}

async function runTest() {
  console.log('🧪 Testing Basic API...');
  
  try {
    const response = await testBasicAPI();
    console.log('📥 Response Status:', response.status);
    console.log('📥 Response Data:', JSON.stringify(response.data, null, 2));
    
    if (response.status === 200) {
      console.log('✅ Basic API is working!');
    } else {
      console.log('❌ Basic API is not working!');
    }
  } catch (error) {
    console.log('❌ Basic API test failed:', error.message);
  }
}

runTest(); 