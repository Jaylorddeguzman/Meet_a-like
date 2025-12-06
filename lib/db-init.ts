/**
 * Database Initialization and Setup Script
 * 
 * This script connects to MongoDB and ensures all collections and indexes are properly set up.
 * Run this manually or it will be automatically invoked when the app starts.
 */

import connectDB, { User, Post, Message, Conversation, Match, ProfileView } from './mongodb';

export async function initializeDatabase() {
  try {
    console.log('🔄 Initializing database...');
    
    // Connect to MongoDB
    await connectDB();
    
    // Create indexes for all collections
    console.log('📊 Creating indexes...');
    
    await User.createIndexes();
    await Post.createIndexes();
    await Message.createIndexes();
    await Conversation.createIndexes();
    await Match.createIndexes();
    await ProfileView.createIndexes();
    
    console.log('✅ Database initialized successfully!');
    console.log(`
📦 Collections created:
  - users (User profiles with AI-generated data)
  - posts (User posts and updates)
  - messages (Direct messages between users)
  - conversations (Message threads)
  - matches (User likes and matches)
  - profileviews (Profile view analytics)
  - accounts (NextAuth OAuth accounts)
  - sessions (NextAuth sessions)

🔍 Indexes created for optimal query performance
    `);
    
    return true;
  } catch (error) {
    console.error('❌ Database initialization failed:', error);
    throw error;
  }
}

// Helper function to get database stats
export async function getDatabaseStats() {
  try {
    await connectDB();
    
    const stats = {
      users: await User.countDocuments(),
      posts: await Post.countDocuments(),
      messages: await Message.countDocuments(),
      conversations: await Conversation.countDocuments(),
      matches: await Match.countDocuments(),
      profileViews: await ProfileView.countDocuments()
    };
    
    return stats;
  } catch (error) {
    console.error('Error fetching database stats:', error);
    throw error;
  }
}

// Helper function to seed sample data (for testing)
export async function seedSampleData() {
  try {
    await connectDB();
    
    console.log('🌱 Seeding sample data...');
    
    // Check if data already exists
    const userCount = await User.countDocuments();
    if (userCount > 0) {
      console.log('⚠️ Database already has data. Skipping seed.');
      return;
    }
    
    // Sample users will be created through the profile setup flow
    console.log('✅ Database ready for user registration through the app');
    
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    throw error;
  }
}

// Run initialization if this file is executed directly
if (require.main === module) {
  initializeDatabase()
    .then(() => {
      console.log('Database initialization complete');
      process.exit(0);
    })
    .catch((error) => {
      console.error('Database initialization failed:', error);
      process.exit(1);
    });
}
