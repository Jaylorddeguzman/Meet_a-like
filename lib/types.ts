export interface Character {
  emoji: string;
  gradient: string;
}

export interface CharacterCustomization {
  backgroundColor?: string;
  pattern?: 'solid' | 'gradient' | 'sparkles' | 'hearts';
  accessories?: string[];
  mood?: 'happy' | 'playful' | 'chill' | 'romantic';
}

export type ProfileStyle = 'cute' | 'cool' | 'fun' | 'mysterious';
export type Gender = 'male' | 'female' | 'non-binary' | 'other';
export type RelationshipGoal = 'casual' | 'relationship' | 'marriage' | 'friendship' | 'not-sure';

export interface Location {
  city?: string;
  state?: string;
  country?: string;
  coordinates?: {
    type: 'Point';
    coordinates: [number, number]; // [longitude, latitude]
  };
}

export interface Preferences {
  ageRange: { min: number; max: number };
  maxDistance: number;
  showMeGender: string[];
  dealbreakers?: string[];
}

export interface User {
  id: string;
  name: string;
  email: string;
  image?: string;
  age: number;
  gender: Gender;
  style: ProfileStyle;
  character: Character;
  characterCustomization?: CharacterCustomization;
  bio: string;
  interests: string[];
  traits: string[];
  lookingFor: string;
  
  // Enhanced Profile
  location?: Location;
  height?: number;
  education?: string;
  occupation?: string;
  smoking?: 'never' | 'socially' | 'regularly' | 'prefer-not-say';
  drinking?: 'never' | 'socially' | 'regularly' | 'prefer-not-say';
  relationshipGoal?: RelationshipGoal;
  personalityType?: string;
  loveLanguage?: string;
  zodiacSign?: string;
  
  preferences?: Preferences;
  
  // Status
  isOnline?: boolean;
  lastActiveAt?: Date;
  isVerified?: boolean;
  isPremium?: boolean;
  premiumExpiresAt?: Date;
  
  // Metadata
  isAIGenerated: boolean;
  profileCompleted: boolean;
  profileCompleteness?: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface Post {
  id?: string;
  userId: string;
  userName: string;
  userCharacter: Character;
  text: string;
  images?: string[];
  likes: number;
  likedBy?: string[];
  comments?: Comment[];
  visibility?: 'public' | 'matches' | 'private';
  createdAt?: Date;
  updatedAt?: Date;
}

export interface Comment {
  userId: string;
  userName: string;
  userCharacter: Character;
  text: string;
  createdAt: Date;
}

export interface Message {
  id: string;
  conversationId?: string;
  senderId: string;
  receiverId: string;
  text: string;
  images?: string[];
  read: boolean;
  readAt?: Date;
  replyTo?: string;
  isDeleted?: boolean;
  deletedFor?: string[];
  createdAt: Date;
}

export interface Conversation {
  id: string;
  participants: string[];
  lastMessage: string;
  lastMessageAt: Date;
  lastMessageBy: string;
  unreadCount?: { [userId: string]: number };
  isArchived?: boolean;
  archivedBy?: string[];
  mutedBy?: string[];
  createdAt: Date;
}

export interface Match {
  id: string;
  userId: string;
  likedUserId: string;
  isMatch: boolean;
  matchedAt?: Date;
  compatibilityScore?: number;
  commonInterests?: string[];
  status?: 'pending' | 'matched' | 'passed' | 'blocked';
  createdAt: Date;
}

export interface Notification {
  id: string;
  userId: string;
  type: 'match' | 'message' | 'like' | 'profile_view' | 'system';
  title: string;
  message: string;
  relatedUserId?: string;
  relatedUserName?: string;
  relatedUserCharacter?: Character;
  actionUrl?: string;
  read: boolean;
  readAt?: Date;
  createdAt: Date;
  expiresAt?: Date;
}

export interface UserSettings {
  userId: string;
  privacy: {
    showOnlineStatus: boolean;
    showDistance: boolean;
    showAge: boolean;
    showLastActive: boolean;
    profileVisibility: 'everyone' | 'matches' | 'hidden';
  };
  notifications: {
    email: {
      matches: boolean;
      messages: boolean;
      likes: boolean;
      promotions: boolean;
    };
    push: {
      matches: boolean;
      messages: boolean;
      likes: boolean;
    };
  };
  discovery: {
    pauseProfile: boolean;
    incognitoMode: boolean;
    globalMode: boolean;
  };
  account: {
    language: string;
    timezone?: string;
    emailVerified: boolean;
    phoneVerified: boolean;
  };
  updatedAt: Date;
}

export interface Block {
  id: string;
  blockerId: string;
  blockedUserId: string;
  reason?: string;
  createdAt: Date;
}

export interface Report {
  id: string;
  reporterId: string;
  reportedUserId: string;
  category: 'spam' | 'harassment' | 'inappropriate' | 'fake' | 'other';
  description?: string;
  status: 'pending' | 'reviewed' | 'resolved' | 'dismissed';
  reviewedBy?: string;
  reviewedAt?: Date;
  resolution?: string;
  createdAt: Date;
}

export interface SetupForm {
  name: string;
  age: string;
  gender: Gender;
  style: ProfileStyle;
  generateAI?: boolean;
}

export type CharacterSize = 'sm' | 'md' | 'lg' | 'xl';

export type ViewType = 'setup' | 'feed' | 'profile' | 'messages';
