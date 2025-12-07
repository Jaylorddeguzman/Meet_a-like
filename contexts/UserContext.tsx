'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode, useMemo } from 'react';
import { User, Post } from '@/lib/types';
import { samplePosts } from '@/lib/data';

interface UserContextType {
  currentUser: User | null;
  setCurrentUser: (user: User | null) => void;
  posts: Post[];
  addPost: (post: Post) => void;
  isLoading: boolean;
  showWelcome: boolean;
  setShowWelcome: (show: boolean) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUserState] = useState<User | null>(null);
  const [posts, setPosts] = useState<Post[]>(samplePosts);
  const [isLoading, setIsLoading] = useState(false);
  const [showWelcome, setShowWelcome] = useState(false);

  // Load user and posts from localStorage on mount - non-blocking
  useEffect(() => {
    // Run asynchronously without blocking render
    const loadFromStorage = async () => {
      try {
        const storedUser = localStorage.getItem('currentUser');
        const storedPosts = localStorage.getItem('posts');

        if (storedUser) {
          setCurrentUserState(JSON.parse(storedUser));
        }

        if (storedPosts) {
          setPosts(JSON.parse(storedPosts));
        }
      } catch (error) {
        console.error('Error loading from localStorage:', error);
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

  // Memoize context value to prevent unnecessary re-renders
  const contextValue = useMemo(
    () => ({ currentUser, setCurrentUser, posts, addPost, isLoading, showWelcome, setShowWelcome }),
    [currentUser, posts, isLoading, showWelcome]
  );

  return (
    <UserContext.Provider value={contextValue}>
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

