// Test MongoDB and BigQuery connections
import connectDB from './lib/mongodb';
import { logAnalytics } from './lib/bigquery';

async function testConnections() {
  console.log('🧪 Testing Database Connections...\n');

  // Test MongoDB
  console.log('1️⃣ Testing MongoDB Atlas Connection...');
  try {
    const mongoose = await connectDB();
    if (mongoose) {
      console.log('✅ MongoDB Connected Successfully!');
      console.log(`   Database: ${mongoose.connection.db.databaseName}`);
      console.log(`   Host: ${mongoose.connection.host}`);
      
      // List collections
      const collections = await mongoose.connection.db.listCollections().toArray();
      console.log(`   Collections: ${collections.length > 0 ? collections.map(c => c.name).join(', ') : 'None yet (will be created on first use)'}`);
    }
  } catch (error) {
    console.error('❌ MongoDB Connection Failed:');
    console.error(`   Error: ${error.message}`);
  }

  console.log('\n2️⃣ Testing BigQuery Connection...');
  try {
    // Test BigQuery by logging a test event
    const testEvent = {
      event_type: 'connection_test',
      user_id: 'test-user',
      timestamp: new Date().toISOString(),
      data: { test: true }
    };
    
    await logAnalytics('test_event', testEvent);
    console.log('✅ BigQuery Connected Successfully!');
    console.log('   Test event logged to analytics');
  } catch (error) {
    console.error('❌ BigQuery Connection Failed:');
    console.error(`   Error: ${error.message}`);
    
    if (error.message.includes('BIGQUERY_PROJECT_ID')) {
      console.log('   ℹ️  BigQuery is optional - analytics will work without it');
    }
  }

  console.log('\n✨ Connection Test Complete!\n');
}

// Run tests
testConnections()
  .then(() => {
    console.log('All tests completed');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Test failed:', error);
    process.exit(1);
  });
