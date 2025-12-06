import { NextResponse } from 'next/server';
import connectDB, { User } from '@/lib/mongodb';

export async function GET() {
  const results = {
    mongodb: { status: 'error', message: '', details: {} },
    bigquery: { status: 'info', message: 'BigQuery is optional for analytics' }
  };

  // Test MongoDB
  try {
    console.log('Testing MongoDB connection...');
    const mongoose = await connectDB();
    
    if (mongoose && mongoose.connection.readyState === 1) {
      results.mongodb.status = 'success';
      results.mongodb.message = 'Connected successfully';
      results.mongodb.details = {
        database: mongoose.connection.db.databaseName,
        host: mongoose.connection.host,
        readyState: 'connected'
      };

      // Try to count documents
      try {
        const userCount = await User.countDocuments();
        results.mongodb.details.userCount = userCount;
        results.mongodb.details.collectionsReady = true;
      } catch (err) {
        results.mongodb.details.collectionsReady = false;
        results.mongodb.details.note = 'Collections will be created on first use';
      }
    } else {
      results.mongodb.status = 'error';
      results.mongodb.message = 'Connection state is not ready';
    }
  } catch (error: any) {
    results.mongodb.status = 'error';
    results.mongodb.message = error.message;
    results.mongodb.details = {
      error: error.toString()
    };
  }

  // Test BigQuery (check if configured)
  try {
    if (process.env.BIGQUERY_PROJECT_ID) {
      results.bigquery.status = 'success';
      results.bigquery.message = 'BigQuery credentials configured';
      results.bigquery.details = {
        projectId: process.env.BIGQUERY_PROJECT_ID,
        dataset: process.env.BIGQUERY_DATASET || 'not set'
      };
    } else {
      results.bigquery.status = 'warning';
      results.bigquery.message = 'BigQuery not configured (optional)';
      results.bigquery.details = {
        note: 'Analytics will work without BigQuery. Set BIGQUERY_PROJECT_ID in .env.local to enable.'
      };
    }
  } catch (error: any) {
    results.bigquery.status = 'error';
    results.bigquery.message = error.message;
  }

  return NextResponse.json({
    timestamp: new Date().toISOString(),
    results
  }, {
    status: results.mongodb.status === 'success' ? 200 : 500
  });
}
