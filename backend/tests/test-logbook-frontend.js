const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

const API_BASE_URL = 'http://localhost:5000/api';

// Simulate a JWT token (you'll need to replace this with a real token from login)
const TEST_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsInVzZXJuYW1lIjoiYWRtaW4iLCJyb2xlIjoiYWRtaW4iLCJpYXQiOjE3MzU2NzY2NjQsImV4cCI6MTczNTc2MzA2NH0.example';

const testLogbookFrontend = async () => {
  try {
    console.log('🧪 Testing Logbook Frontend Integration...');
    
    const headers = {
      'Authorization': `Bearer ${TEST_TOKEN}`,
      'Content-Type': 'application/json'
    };
    
    // Test 1: Get all logbook entries
    console.log('\n📋 Test 1: Fetching all logbook entries...');
    try {
      const response = await fetch(`${API_BASE_URL}/logbook`, {
        method: 'GET',
        headers
      });
      
      console.log('Status:', response.status);
      
      if (response.ok) {
        const data = await response.json();
        console.log('✅ Successfully fetched logbook entries:', data.entries?.length || 0, 'entries');
        if (data.entries && data.entries.length > 0) {
          console.log('Sample entry:', data.entries[0]);
        }
      } else {
        const errorData = await response.json();
        console.log('❌ Failed to fetch entries:', errorData);
      }
    } catch (error) {
      console.log('❌ Network error:', error.message);
    }
    
    // Test 2: Create a new logbook entry
    console.log('\n➕ Test 2: Creating a new logbook entry...');
    const newEntry = {
      date: '2024-01-21',
      vehicle: 'Test Frontend Vehicle',
      driver: 'Test Frontend Driver',
      description: 'Test entry from frontend simulation'
    };
    
    try {
      const response = await fetch(`${API_BASE_URL}/logbook`, {
        method: 'POST',
        headers,
        body: JSON.stringify(newEntry)
      });
      
      console.log('Status:', response.status);
      
      if (response.ok) {
        const data = await response.json();
        console.log('✅ Successfully created logbook entry:', data.entry);
        
        const entryId = data.entry.id;
        
        // Test 3: Update the entry
        console.log('\n✏️ Test 3: Updating the logbook entry...');
        const updatedEntry = {
          ...newEntry,
          description: 'Updated description from frontend simulation'
        };
        
        const updateResponse = await fetch(`${API_BASE_URL}/logbook/${entryId}`, {
          method: 'PUT',
          headers,
          body: JSON.stringify(updatedEntry)
        });
        
        console.log('Update Status:', updateResponse.status);
        
        if (updateResponse.ok) {
          const updateData = await updateResponse.json();
          console.log('✅ Successfully updated logbook entry:', updateData.entry);
          
          // Test 4: Delete the entry
          console.log('\n🗑️ Test 4: Deleting the logbook entry...');
          const deleteResponse = await fetch(`${API_BASE_URL}/logbook/${entryId}`, {
            method: 'DELETE',
            headers
          });
          
          console.log('Delete Status:', deleteResponse.status);
          
          if (deleteResponse.ok) {
            console.log('✅ Successfully deleted logbook entry');
          } else {
            const deleteError = await deleteResponse.json();
            console.log('❌ Failed to delete entry:', deleteError);
          }
        } else {
          const updateError = await updateResponse.json();
          console.log('❌ Failed to update entry:', updateError);
        }
      } else {
        const errorData = await response.json();
        console.log('❌ Failed to create entry:', errorData);
      }
    } catch (error) {
      console.log('❌ Network error during create/update/delete:', error.message);
    }
    
    console.log('\n🎉 Frontend integration test completed!');
    
  } catch (error) {
    console.error('❌ Error in frontend integration test:', error.message);
  }
};

testLogbookFrontend(); 