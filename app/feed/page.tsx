'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@/contexts/UserContext';
import CharacterAvatar from '@/components/CharacterAvatar';
import BottomNav from '@/components/BottomNav';
import PostCard from '@/components/PostCard';
import NotificationBell from '@/components/NotificationBell';
import { sampleUsers } from '@/lib/data';
import { Post } from '@/lib/types';
import { assignCharacter } from '@/lib/utils';

export default function FeedPage() {
  const { currentUser, posts, addPost, isLoading } = useUser();
  const router = useRouter();
  const [newPost, setNewPost] = useState('');

  useEffect(() => {
    if (!isLoading && !currentUser) {
      router.push('/');
    }
  }, [currentUser, isLoading, router]);

  const handlePost = async () => {
    if (!currentUser || !newPost.trim()) return;

    const post: Post = {
      id: Date.now(),
      userId: currentUser.id,
      text: newPost,
      likes: 0,
      createdAt: new Date(),
    };

    addPost(post);
    setNewPost('');

    // Log to analytics via API route
    try {
      await fetch('/api/analytics/post', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(post)
      });
    } catch (error) {
      console.error('Analytics logging failed:', error);
    }
  };

  const getUserById = (id: number) => {
    if (id === currentUser?.id) return currentUser;
    const user = sampleUsers.find(u => u.id === id);
    return user ? { ...user, character: assignCharacter(user.style) } : null;
  };

  if (isLoading || !currentUser) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-100 via-purple-100 to-blue-100 flex items-center justify-center">
        <div className="text-2xl font-bold bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent">
          Loading...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 via-purple-100 to-blue-100 pb-20">
      <div className="max-w-2xl mx-auto p-4">
        {/* Header */}
        <div className="bg-white rounded-3xl shadow-2xl p-6 mb-6 flex items-center justify-between">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent">
            CharacterMatch
          </h1>
          <NotificationBell />
        </div>
        
        {/* Create Post */}
        <div className="bg-white rounded-2xl shadow-lg p-4 mb-6">
          <div className="flex gap-3">
            <CharacterAvatar character={currentUser.character} size="sm" />
            <div className="flex-1">
              <textarea
                value={newPost}
                onChange={(e) => setNewPost(e.target.value)}
                className="w-full px-4 py-2 rounded-xl border-2 border-gray-200 focus:border-purple-400 focus:outline-none resize-none"
                placeholder="What's on your mind?"
                rows={2}
              />
              <button 
                onClick={handlePost}
                disabled={!newPost.trim()}
                className="mt-2 px-6 py-2 bg-gradient-to-r from-pink-500 to-purple-500 text-white font-bold rounded-xl hover:shadow-lg transition disabled:opacity-50"
              >
                Post
              </button>
            </div>
          </div>
        </div>
        
        {/* Posts Feed */}
        <div className="space-y-4">
          {posts.map((post, i) => {
            const user = getUserById(post.userId);
            if (!user) return null;
            
            return (
              <PostCard key={post.id || i} post={post} user={user} />
            );
          })}
        </div>
      </div>
      
      <BottomNav />
    </div>
  );
}
