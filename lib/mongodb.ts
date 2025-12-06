import mongoose from 'mongoose';

// MongoDB connection string
const MONGODB_URI = process.env.MONGODB_URI || '';

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable in .env.local');
}

interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

declare global {
  var mongoose: MongooseCache | undefined;
}

let cached: MongooseCache = global.mongoose || { conn: null, promise: null };

if (!global.mongoose) {
  global.mongoose = cached;
}

async function connectDB() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    };

    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
      console.log('✅ MongoDB connected successfully');
      return mongoose;
    }).catch((error) => {
      console.error('❌ MongoDB connection error:', error);
      throw error;
    });
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

// User Schema
const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  image: String,
  age: { type: Number, required: true },
  gender: { 
    type: String, 
    enum: ['male', 'female', 'non-binary', 'other'],
    required: true 
  },
  style: { 
    type: String, 
    enum: ['cute', 'cool', 'fun', 'mysterious'],
    required: true 
  },
  character: {
    emoji: { type: String, required: true },
    gradient: { type: String, required: true }
  },
  bio: String,
  interests: [String],
  traits: [String],
  lookingFor: String,
  isAIGenerated: { type: Boolean, default: false },
  profileCompleted: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Post Schema
const PostSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  userName: { type: String, required: true },
  userCharacter: {
    emoji: String,
    gradient: String
  },
  text: { type: String, required: true },
  likes: { type: Number, default: 0 },
  likedBy: [String], // Array of user IDs who liked the post
  createdAt: { type: Date, default: Date.now }
});

// Message Schema
const MessageSchema = new mongoose.Schema({
  senderId: { type: String, required: true },
  receiverId: { type: String, required: true },
  text: { type: String, required: true },
  read: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

// Conversation Schema (for tracking message threads)
const ConversationSchema = new mongoose.Schema({
  participants: [{ type: String, required: true }],
  lastMessage: String,
  lastMessageAt: Date,
  createdAt: { type: Date, default: Date.now }
});

// Match Schema (for storing user matches/likes)
const MatchSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  likedUserId: { type: String, required: true },
  isMatch: { type: Boolean, default: false }, // true if both users liked each other
  createdAt: { type: Date, default: Date.now }
});

// Profile View Schema (for analytics)
const ProfileViewSchema = new mongoose.Schema({
  viewerId: { type: String, required: true },
  viewedUserId: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

// Create indexes for better query performance
UserSchema.index({ email: 1 });
UserSchema.index({ profileCompleted: 1 });
PostSchema.index({ userId: 1, createdAt: -1 });
PostSchema.index({ createdAt: -1 });
MessageSchema.index({ senderId: 1, receiverId: 1, createdAt: -1 });
MessageSchema.index({ receiverId: 1, read: 1 });
ConversationSchema.index({ participants: 1, lastMessageAt: -1 });
MatchSchema.index({ userId: 1, likedUserId: 1 });
MatchSchema.index({ userId: 1, isMatch: 1 });
ProfileViewSchema.index({ viewedUserId: 1, createdAt: -1 });

// Export models (use existing model if already compiled)
export const User = mongoose.models.User || mongoose.model('User', UserSchema);
export const Post = mongoose.models.Post || mongoose.model('Post', PostSchema);
export const Message = mongoose.models.Message || mongoose.model('Message', MessageSchema);
export const Conversation = mongoose.models.Conversation || mongoose.model('Conversation', ConversationSchema);
export const Match = mongoose.models.Match || mongoose.model('Match', MatchSchema);
export const ProfileView = mongoose.models.ProfileView || mongoose.model('ProfileView', ProfileViewSchema);
