const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

async function testRegistrationAndLogin() {
  try {
    console.log('🧪 Testing registration and login flow...');
    
    // Test data
    const testUser = {
      username: 'testdriver',
      email: 'testdriver@example.com',
      password: 'password123',
      role: 'driver'
    };
    
    // Step 1: Register a new user
    console.log('📝 Step 1: Registering new user...');
    const registerResponse = await fetch('http://localhost:5000/api/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(testUser)
    });

    const registerData = await registerResponse.json();
    
    if (registerResponse.ok) {
      console.log('✅ Registration successful:', registerData);
    } else {
      console.log('❌ Registration failed:', registerData.message);
      return;
    }
    
    // Step 2: Login with the new user
    console.log('🔐 Step 2: Logging in with new user...');
    const loginResponse = await fetch('http://localhost:5000/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        username: testUser.username,
        password: testUser.password
      })
    });

    const loginData = await loginResponse.json();
    
    if (loginResponse.ok) {
      console.log('✅ Login successful:', loginData.user);
      console.log('🔑 Token:', loginData.token.substring(0, 20) + '...');
    } else {
      console.log('❌ Login failed:', loginData.message);
    }
    
  } catch (error) {
    console.error('❌ Test error:', error.message);
  }
}

testRegistrationAndLogin(); 