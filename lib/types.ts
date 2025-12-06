export interface Character {
  emoji: string;
  gradient: string;
}

export type ProfileStyle = 'cute' | 'cool' | 'fun' | 'mysterious';
export type Gender = 'male' | 'female' | 'non-binary' | 'other';

export interface User {
  id: string;
  name: string;
  email: string;
  image?: string;
  age: number;
  gender: Gender;
  style: ProfileStyle;
  character: Character;
  bio: string;
  interests: string[];
  traits: string[];
  lookingFor: string;
  isAIGenerated: boolean;
  profileCompleted: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface Post {
  id?: string;
  userId: string;
  text: string;
  likes: number;
  createdAt?: Date;
}

export interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  text: string;
  read: boolean;
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
