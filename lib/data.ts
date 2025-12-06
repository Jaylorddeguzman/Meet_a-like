import { Character, User, Post } from './types';

export const characterSets: Record<string, Character[]> = {
  cute: [
    { emoji: '🐱', gradient: 'from-pink-400 to-purple-400' },
    { emoji: '🐰', gradient: 'from-blue-400 to-cyan-400' },
    { emoji: '🐻', gradient: 'from-yellow-400 to-orange-400' },
    { emoji: '🦊', gradient: 'from-orange-400 to-red-400' }
  ],
  cool: [
    { emoji: '🦁', gradient: 'from-purple-500 to-pink-500' },
    { emoji: '🐺', gradient: 'from-gray-600 to-blue-600' },
    { emoji: '🐉', gradient: 'from-green-500 to-teal-500' },
    { emoji: '🦅', gradient: 'from-indigo-500 to-purple-500' }
  ],
  fun: [
    { emoji: '🦄', gradient: 'from-pink-500 to-yellow-400' },
    { emoji: '🐙', gradient: 'from-purple-400 to-blue-500' },
    { emoji: '🦋', gradient: 'from-pink-300 to-purple-300' },
    { emoji: '🐠', gradient: 'from-cyan-400 to-blue-500' }
  ],
  mysterious: [
    { emoji: '🦉', gradient: 'from-indigo-600 to-purple-700' },
    { emoji: '🐈‍⬛', gradient: 'from-gray-700 to-purple-900' },
    { emoji: '🦇', gradient: 'from-purple-800 to-black' },
    { emoji: '🐍', gradient: 'from-green-700 to-emerald-900' }
  ]
};

export const sampleUsers: User[] = [
  { 
    id: 1, 
    name: 'Alex', 
    age: 25, 
    gender: 'Non-binary', 
    style: 'cute', 
    bio: 'Love coffee, cats, and late-night conversations ☕', 
    interests: ['Music', 'Art', 'Gaming'],
    character: { emoji: '🐱', gradient: 'from-pink-400 to-purple-400' }
  },
  { 
    id: 2, 
    name: 'Jordan', 
    age: 28, 
    gender: 'Male', 
    style: 'cool', 
    bio: 'Adventure seeker and fitness enthusiast 🏔️', 
    interests: ['Hiking', 'Photography', 'Cooking'],
    character: { emoji: '🦁', gradient: 'from-purple-500 to-pink-500' }
  },
  { 
    id: 3, 
    name: 'Sam', 
    age: 24, 
    gender: 'Female', 
    style: 'fun', 
    bio: 'Dancing through life with a smile 💃', 
    interests: ['Dancing', 'Travel', 'Food'],
    character: { emoji: '🦄', gradient: 'from-pink-500 to-yellow-400' }
  },
  { 
    id: 4, 
    name: 'Taylor', 
    age: 27, 
    gender: 'Female', 
    style: 'mysterious', 
    bio: 'Bookworm and stargazer 🌙', 
    interests: ['Reading', 'Astronomy', 'Poetry'],
    character: { emoji: '🦉', gradient: 'from-indigo-600 to-purple-700' }
  },
  { 
    id: 5, 
    name: 'Morgan', 
    age: 26, 
    gender: 'Male', 
    style: 'fun', 
    bio: 'Professional meme connoisseur 😄', 
    interests: ['Comedy', 'Gaming', 'Movies'],
    character: { emoji: '🐙', gradient: 'from-purple-400 to-blue-500' }
  }
];

export const samplePosts: Post[] = [
  { id: 1, userId: 1, text: 'Just finished an amazing painting session! Anyone else into art? 🎨', likes: 12 },
  { id: 2, userId: 2, text: 'Conquered a new hiking trail today. The view was breathtaking! 🏔️', likes: 24 },
  { id: 3, userId: 3, text: 'Found the cutest café downtown! Best matcha latte ever ☕✨', likes: 18 },
  { id: 4, userId: 4, text: 'Reading under the stars tonight. What\'s your favorite book? 📚', likes: 15 },
  { id: 5, userId: 5, text: 'Movie night recommendations? Looking for something funny! 🎬', likes: 9 }
];

// TODO: Replace with MongoDB queries when connection is provided
export async function getUsers(): Promise<User[]> {
  // Placeholder: Will fetch from MongoDB
  return sampleUsers;
}

// TODO: Replace with MongoDB queries when connection is provided
export async function getUserById(id: number): Promise<User | null> {
  // Placeholder: Will fetch from MongoDB
  return sampleUsers.find(u => u.id === id) || null;
}

// TODO: Replace with MongoDB queries when connection is provided
export async function getPosts(): Promise<Post[]> {
  // Placeholder: Will fetch from MongoDB
  return samplePosts;
}

// TODO: Replace with MongoDB/BigQuery insert when connection is provided
export async function createUser(userData: Omit<User, 'id' | 'createdAt'>): Promise<User> {
  // Placeholder: Will insert to MongoDB and log to BigQuery
  const newUser = {
    ...userData,
    id: Date.now(),
    createdAt: new Date()
  };
  return newUser;
}

// TODO: Replace with MongoDB/BigQuery insert when connection is provided
export async function createPost(postData: Omit<Post, 'id' | 'createdAt'>): Promise<Post> {
  // Placeholder: Will insert to MongoDB and log to BigQuery
  const newPost = {
    ...postData,
    id: Date.now(),
    createdAt: new Date()
  };
  return newPost;
}
