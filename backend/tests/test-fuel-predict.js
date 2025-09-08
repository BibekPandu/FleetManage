const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));

async function run() {
  try {
    console.log('🔐 Logging in as admin...');
    const loginRes = await fetch('http://localhost:5000/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: 'admin', password: 'admin123' }),
    });
    const loginData = await loginRes.json();
    if (!loginRes.ok) {
      console.error('❌ Login failed:', loginData);
      process.exit(1);
    }
    const token = loginData.token;
    console.log('✅ Got token');

    const payload = {
      // vehicleId intentionally omitted (nullable)
      vehicleType: 'van',
      engineType: 'diesel',
      averageLoad: 500,
      averageSpeed: 70,
      distance: 150,
      vehicleAge: 3,
      weather: 'sunny',
      terrain: 'flat',
    };

    console.log('🚚 Sending prediction payload:', payload);
    const predictRes = await fetch('http://localhost:5000/api/fuel-prediction/predict', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });

    const predictData = await predictRes.json();
    if (!predictRes.ok) {
      console.error('❌ Prediction failed:', predictData);
      process.exit(1);
    }

    console.log('✅ Prediction success:', predictData);
  } catch (err) {
    console.error('❌ Test error:', err);
    process.exit(1);
  }
}

run();



