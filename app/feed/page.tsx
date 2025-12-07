'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@/contexts/UserContext';
import CharacterAvatar from '@/components/CharacterAvatar';
import BottomNav from '@/components/BottomNav';
import PostCard from '@/components/PostCard';
import NotificationBell from '@/components/NotificationBell';
import LoadingSpinner from '@/components/LoadingSpinner';
import { sampleUsers } from '@/lib/data';
import { Post } from '@/lib/types';
import { assignCharacter } from '@/lib/utils';

export default function FeedPage() {
  const { currentUser, addPost, isLoading } = useUser();
  const router = useRouter();
  const [newPost, setNewPost] = useState('');
  const [loading, setLoading] = useState(true);
  const [dbUser, setDbUser] = useState<any>(null);
  const [posts, setPosts] = useState<Post[]>([]);

  // Fetch user and posts from database
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch user profile
        const userResponse = await fetch('/api/profile');
        if (userResponse.ok) {
          const userData = await userResponse.json();
          if (userData.user) {
            setDbUser(userData.user);
          }
        }

        // Fetch posts from database
        const postsResponse = await fetch('/api/posts');
        if (postsResponse.ok) {
          const postsData = await postsResponse.json();
          setPosts(postsData);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Don't add router as dependency - it causes re-renders
  useEffect(() => {
    if (!loading && !dbUser) {
      router.replace('/');
    }
  }, [dbUser, loading]);

  const handlePost = async () => {
    const user = dbUser || currentUser;
    if (!user || !newPost.trim()) return;

    const postData = {
      userId: user._id || user.id,
      text: newPost,
    };

    try {
      // Save to database
      const response = await fetch('/api/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(postData)
      });

      if (response.ok) {
        const savedPost = await response.json();
        setPosts([savedPost, ...posts]);
        setNewPost('');
        
        // Also add to local context
        addPost(savedPost);
      }
    } catch (error) {
      console.error('Error creating post:', error);
    }
  };

  const getUserById = (id: any) => {
    const user = dbUser || currentUser;
    if (id === user?._id || id === user?.id) return user;
    const foundUser = sampleUsers.find(u => u.id === id);
    return foundUser ? { ...foundUser, character: assignCharacter(foundUser.style) } : null;
  };

  if (loading || isLoading) {
    return <LoadingSpinner message="Loading your feed..." />;
  }

  const user = dbUser || currentUser;
  if (!user) {
    return <LoadingSpinner message="Loading your feed..." />;
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
            <CharacterAvatar character={user.character} size="sm" />
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
          {posts.length === 0 ? (
            <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
              <div className="text-6xl mb-4">📝</div>
              <h3 className="text-xl font-bold text-gray-700 mb-2">No posts yet!</h3>
              <p className="text-gray-500">Be the first to share something with the community.</p>
            </div>
          ) : (
            posts.map((post: any, i) => {
              // For database posts, user info is already in the post
              const postUser = post.userName ? {
                id: post.userId,
                _id: post.userId,
                name: post.userName,
                character: post.userCharacter
              } : getUserById(post.userId);
              
              if (!postUser) return null;
              
              return (
                <PostCard key={post._id || post.id || i} post={post} user={postUser} />
              );
            })
          )}
        </div>
      </div>
      
      <BottomNav />
    </div>
  );
}
