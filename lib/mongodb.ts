import mongoose from 'mongoose';

// MongoDB connection string will be provided later
const MONGODB_URI = process.env.MONGODB_URI || '';

if (!MONGODB_URI) {
  console.warn('MongoDB URI not configured. Database features will be unavailable.');
}

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function connectDB() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    };

    if (MONGODB_URI) {
      cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
        console.log('✅ MongoDB connected successfully');
        return mongoose;
      }).catch((error) => {
        console.error('❌ MongoDB connection error:', error);
        throw error;
      });
    } else {
      console.warn('⚠️ MongoDB connection skipped - URI not configured');
      cached.promise = Promise.resolve(null);
    }
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}

export default connectDB;

// TODO: Define Mongoose schemas when ready to integrate
// Example schemas:
/*
const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  age: { type: Number, required: true },
  gender: { type: String, required: true },
  style: { type: String, enum: ['cute', 'cool', 'fun', 'mysterious'], required: true },
  character: {
    emoji: String,
    gradient: String
  },
  bio: { type: String, required: true },
  interests: [String],
  createdAt: { type: Date, default: Date.now }
});

const PostSchema = new mongoose.Schema({
  userId: { type: Number, required: true },
  text: { type: String, required: true },
  likes: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }
});
*/
