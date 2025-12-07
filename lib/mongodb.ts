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

// User Schema - Enhanced with new profile fields
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
  
  // NEW: Enhanced Character Customization
  characterCustomization: {
    backgroundColor: String, // Additional bg color
    pattern: String, // 'solid', 'gradient', 'sparkles', 'hearts'
    accessories: [String], // ['glasses', 'hat', 'flower']
    mood: String // 'happy', 'playful', 'chill', 'romantic'
  },
  
  location: {
    city: String,
    state: String,
    country: String,
    coordinates: {
      type: { type: String, enum: ['Point'], default: 'Point' },
      coordinates: [Number] // [longitude, latitude]
    }
  },
  
  height: Number, // in cm
  education: String,
  occupation: String,
  smoking: { type: String, enum: ['never', 'socially', 'regularly', 'prefer-not-say'] },
  drinking: { type: String, enum: ['never', 'socially', 'regularly', 'prefer-not-say'] },
  relationshipGoal: { 
    type: String, 
    enum: ['casual', 'relationship', 'marriage', 'friendship', 'not-sure'] 
  },
  
  // Personality Expansion
  personalityType: String, // MBTI or similar
  loveLanguage: String,
  zodiacSign: String,
  
  // User Preferences
  preferences: {
    ageRange: {
      min: { type: Number, default: 18 },
      max: { type: Number, default: 99 }
    },
    maxDistance: { type: Number, default: 50 }, // in km
    showMeGender: [String],
    dealbreakers: [String]
  },
  
  // Status & Verification
  isOnline: { type: Boolean, default: false },
  lastActiveAt: { type: Date, default: Date.now },
  isVerified: { type: Boolean, default: false },
  isPremium: { type: Boolean, default: false },
  premiumExpiresAt: Date,
  
  // Metadata
  isAIGenerated: { type: Boolean, default: false },
  profileCompleted: { type: Boolean, default: false },
  profileCompleteness: { type: Number, default: 0 }, // 0-100%
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Post Schema - Enhanced with new features
const PostSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  userName: { type: String, required: true },
  userCharacter: {
    emoji: String,
    gradient: String
  },
  text: { type: String, required: true },
  images: [String], // Array of image URLs
  likes: { type: Number, default: 0 },
  likedBy: [String], // Array of user IDs who liked the post
  comments: [{
    userId: String,
    userName: String,
    userCharacter: {
      emoji: String,
      gradient: String
    },
    text: String,
    createdAt: { type: Date, default: Date.now }
  }],
  visibility: { 
    type: String, 
    enum: ['public', 'matches', 'private'], 
    default: 'public' 
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
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

// Notification Schema (NEW)
const NotificationSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  type: { 
    type: String, 
    enum: ['match', 'message', 'like', 'profile_view', 'system'],
    required: true 
  },
  title: String,
  message: String,
  relatedUserId: String,
  relatedUserName: String,
  relatedUserCharacter: {
    emoji: String,
    gradient: String
  },
  actionUrl: String,
  read: { type: Boolean, default: false },
  readAt: Date,
  createdAt: { type: Date, default: Date.now },
  expiresAt: Date
});

// User Settings Schema (NEW)
const UserSettingsSchema = new mongoose.Schema({
  userId: { type: String, required: true, unique: true },
  privacy: {
    showOnlineStatus: { type: Boolean, default: true },
    showDistance: { type: Boolean, default: true },
    showAge: { type: Boolean, default: true },
    showLastActive: { type: Boolean, default: true },
    profileVisibility: { 
      type: String, 
      enum: ['everyone', 'matches', 'hidden'], 
      default: 'everyone' 
    }
  },
  notifications: {
    email: {
      matches: { type: Boolean, default: true },
      messages: { type: Boolean, default: true },
      likes: { type: Boolean, default: true },
      promotions: { type: Boolean, default: false }
    },
    push: {
      matches: { type: Boolean, default: true },
      messages: { type: Boolean, default: true },
      likes: { type: Boolean, default: true }
    }
  },
  discovery: {
    pauseProfile: { type: Boolean, default: false },
    incognitoMode: { type: Boolean, default: false },
    globalMode: { type: Boolean, default: false }
  },
  account: {
    language: { type: String, default: 'en' },
    timezone: String,
    emailVerified: { type: Boolean, default: false },
    phoneVerified: { type: Boolean, default: false }
  },
  updatedAt: { type: Date, default: Date.now }
});

// Block Schema (NEW)
const BlockSchema = new mongoose.Schema({
  blockerId: { type: String, required: true },
  blockedUserId: { type: String, required: true },
  reason: String,
  createdAt: { type: Date, default: Date.now }
});

// Report Schema (NEW)
const ReportSchema = new mongoose.Schema({
  reporterId: { type: String, required: true },
  reportedUserId: { type: String, required: true },
  category: { 
    type: String, 
    enum: ['spam', 'harassment', 'inappropriate', 'fake', 'other'],
    required: true 
  },
  description: String,
  status: { 
    type: String, 
    enum: ['pending', 'reviewed', 'resolved', 'dismissed'], 
    default: 'pending' 
  },
  reviewedBy: String,
  reviewedAt: Date,
  resolution: String,
  createdAt: { type: Date, default: Date.now }
});

// Create indexes for better query performance
UserSchema.index({ email: 1 });
UserSchema.index({ profileCompleted: 1, isOnline: 1 });
UserSchema.index({ lastActiveAt: -1 });
UserSchema.index({ 'location.coordinates': '2dsphere' });
PostSchema.index({ userId: 1, createdAt: -1 });
PostSchema.index({ createdAt: -1 });
PostSchema.index({ visibility: 1, createdAt: -1 });
MessageSchema.index({ senderId: 1, receiverId: 1, createdAt: -1 });
MessageSchema.index({ receiverId: 1, read: 1 });
ConversationSchema.index({ participants: 1, lastMessageAt: -1 });
MatchSchema.index({ userId: 1, likedUserId: 1 });
MatchSchema.index({ userId: 1, isMatch: 1 });
ProfileViewSchema.index({ viewedUserId: 1, createdAt: -1 });
ProfileViewSchema.index({ viewerId: 1, createdAt: -1 });
NotificationSchema.index({ userId: 1, read: 1, createdAt: -1 });
NotificationSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });
UserSettingsSchema.index({ userId: 1 });
BlockSchema.index({ blockerId: 1, blockedUserId: 1 }, { unique: true });
BlockSchema.index({ blockedUserId: 1 });
ReportSchema.index({ status: 1, createdAt: -1 });
ReportSchema.index({ reportedUserId: 1 });

// Export models (use existing model if already compiled)
export const User = mongoose.models.User || mongoose.model('User', UserSchema);
export const Post = mongoose.models.Post || mongoose.model('Post', PostSchema);
export const Message = mongoose.models.Message || mongoose.model('Message', MessageSchema);
export const Conversation = mongoose.models.Conversation || mongoose.model('Conversation', ConversationSchema);
export const Match = mongoose.models.Match || mongoose.model('Match', MatchSchema);
export const ProfileView = mongoose.models.ProfileView || mongoose.model('ProfileView', ProfileViewSchema);
export const Notification = mongoose.models.Notification || mongoose.model('Notification', NotificationSchema);
export const UserSettings = mongoose.models.UserSettings || mongoose.model('UserSettings', UserSettingsSchema);
export const Block = mongoose.models.Block || mongoose.model('Block', BlockSchema);
export const Report = mongoose.models.Report || mongoose.model('Report', ReportSchema);
