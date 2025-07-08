const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

const testSchedulesAPI = async () => {
  try {
    console.log('🧪 Testing Schedules API...');
    
    // Step 1: Login to get a token
    console.log('\n🔐 Step 1: Logging in...');
    const loginResponse = await fetch('http://localhost:5000/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        username: 'admin',
        password: 'admin123'
      })
    });
    
    if (!loginResponse.ok) {
      console.log('❌ Login failed');
      return;
    }
    
    const loginData = await loginResponse.json();
    const token = loginData.token;
    console.log('✅ Login successful');
    
    const headers = {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    };
    
    // Step 2: Get all schedules
    console.log('\n📋 Step 2: Fetching all schedules...');
    const schedulesResponse = await fetch('http://localhost:5000/api/schedules', {
      headers
    });
    
    if (schedulesResponse.ok) {
      const schedulesData = await schedulesResponse.json();
      console.log(`✅ Found ${schedulesData.schedules?.length || 0} schedules`);
      if (schedulesData.schedules && schedulesData.schedules.length > 0) {
        console.log('Sample schedule:', schedulesData.schedules[0]);
      }
    } else {
      const errorData = await schedulesResponse.json();
      console.log('❌ Failed to fetch schedules:', errorData);
    }
    
    // Step 3: Create a new schedule
    console.log('\n➕ Step 3: Creating a new schedule...');
    const newSchedule = {
      vehicle_id: 1, // Assuming vehicle with ID 1 exists
      driver_id: 1,  // Assuming user with ID 1 exists
      schedule_date: '2024-01-25',
      start_time: '09:00:00',
      end_time: '17:00:00',
      purpose: 'Test delivery route',
      status: 'scheduled',
      notes: 'Test schedule from API'
    };
    
    const createResponse = await fetch('http://localhost:5000/api/schedules', {
      method: 'POST',
      headers,
      body: JSON.stringify(newSchedule)
    });
    
    if (createResponse.ok) {
      const createData = await createResponse.json();
      console.log('✅ Schedule created successfully:', createData.schedule);
      
      const scheduleId = createData.schedule.id;
      
      // Step 4: Update the schedule
      console.log('\n✏️ Step 4: Updating the schedule...');
      const updatedSchedule = {
        ...newSchedule,
        purpose: 'Updated test delivery route',
        status: 'in_progress'
      };
      
      const updateResponse = await fetch(`http://localhost:5000/api/schedules/${scheduleId}`, {
        method: 'PUT',
        headers,
        body: JSON.stringify(updatedSchedule)
      });
      
      if (updateResponse.ok) {
        const updateData = await updateResponse.json();
        console.log('✅ Schedule updated successfully:', updateData.schedule);
        
        // Step 5: Delete the schedule
        console.log('\n🗑️ Step 5: Deleting the schedule...');
        const deleteResponse = await fetch(`http://localhost:5000/api/schedules/${scheduleId}`, {
          method: 'DELETE',
          headers
        });
        
        if (deleteResponse.ok) {
          console.log('✅ Schedule deleted successfully');
        } else {
          const deleteError = await deleteResponse.json();
          console.log('❌ Failed to delete schedule:', deleteError);
        }
      } else {
        const updateError = await updateResponse.json();
        console.log('❌ Failed to update schedule:', updateError);
      }
    } else {
      const createError = await createResponse.json();
      console.log('❌ Failed to create schedule:', createError);
    }
    
    console.log('\n🎉 Schedules API test completed!');
    
  } catch (error) {
    console.error('❌ Error testing schedules API:', error.message);
  }
};

testSchedulesAPI(); 