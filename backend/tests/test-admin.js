const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

async function testAdminLogin() {
  try {
    console.log('🧪 Testing admin login...');
    
    const response = await fetch('http://localhost:5000/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        username: 'admin',
        password: 'admin123'
      })
    });

    const data = await response.json();
    
    if (response.ok) {
      console.log('✅ Login successful!');
      console.log('👤 User:', data.user);
      console.log('🔑 Token:', data.token.substring(0, 20) + '...');
    } else {
      console.log('❌ Login failed:', data.message);
    }
  } catch (error) {
    console.error('❌ Test error:', error.message);
  }
}

testAdminLogin(); 