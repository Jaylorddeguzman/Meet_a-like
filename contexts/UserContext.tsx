'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, Post } from '@/lib/types';
import { samplePosts } from '@/lib/data';

interface UserContextType {
  currentUser: User | null;
  setCurrentUser: (user: User | null) => void;
  posts: Post[];
  addPost: (post: Post) => void;
  isLoading: boolean;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUserState] = useState<User | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load user and posts from localStorage on mount
  useEffect(() => {
    const loadFromStorage = () => {
      try {
        const storedUser = localStorage.getItem('currentUser');
        const storedPosts = localStorage.getItem('posts');

        if (storedUser) {
          setCurrentUserState(JSON.parse(storedUser));
        }

        if (storedPosts) {
          setPosts(JSON.parse(storedPosts));
        } else {
          // Initialize with sample posts if none stored
          setPosts(samplePosts);
        }
      } catch (error) {
        console.error('Error loading from localStorage:', error);
        setPosts(samplePosts);
      } finally {
        setIsLoading(false);
      }
    };

    loadFromStorage();
  }, []);

  // Save user to localStorage when it changes
  const setCurrentUser = (user: User | null) => {
    setCurrentUserState(user);
    if (user) {
      localStorage.setItem('currentUser', JSON.stringify(user));
    } else {
      localStorage.removeItem('currentUser');
    }
  };

  // Add post and save to localStorage
  const addPost = (post: Post) => {
    const newPosts = [post, ...posts];
    setPosts(newPosts);
    localStorage.setItem('posts', JSON.stringify(newPosts));
  };

  return (
    <UserContext.Provider value={{ currentUser, setCurrentUser, posts, addPost, isLoading }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}
