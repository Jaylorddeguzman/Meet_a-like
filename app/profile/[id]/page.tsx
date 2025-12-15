'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useUser } from '@/contexts/UserContext';
import CharacterAvatar from '@/components/CharacterAvatar';
import BottomNav from '@/components/BottomNav';
import { ArrowLeft, MessageCircle, UserPlus, UserCheck, MapPin, Briefcase, GraduationCap, Heart, MoreHorizontal } from 'lucide-react';
import { sampleUsers } from '@/lib/data';
import { User } from '@/lib/types';
import { assignCharacter } from '@/lib/utils';

export default function ProfilePage() {
  const { currentUser, isLoading } = useUser();
  const router = useRouter();
  const params = useParams();
  const [profileUser, setProfileUser] = useState<User | null>(null);
  const [userPosts, setUserPosts] = useState<any[]>([]);
  const [isFollowing, setIsFollowing] = useState(false);
  const [loadingPosts, setLoadingPosts] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    console.log('=== PROFILE PAGE MOUNT ===');
    console.log('Params:', params);
    console.log('Current user:', currentUser);
    console.log('Is loading:', isLoading);
    
    if (!isLoading && !currentUser) {
      console.log('No user, redirecting to home');
      router.push('/');
      return;
    }

    const userId = params.id as string;
    console.log('Profile userId from params:', userId);
    
    if (!userId) {
      console.error('ERROR: No userId in params!');
      setError('Invalid profile ID');
      return;
    }
    
    // Fetch profile user
    fetchProfileUser(userId);
    
    // Fetch user's posts
    fetchUserPosts(userId);
  }, [params.id, currentUser, isLoading, router]);

  const fetchProfileUser = async (userId: string) => {
    console.log('=== FETCHING PROFILE ===');
    console.log('Requested userId:', userId);
    
    try {
      const apiUrl = `/api/profile?userId=${userId}`;
      console.log('API URL:', apiUrl);
      
      const response = await fetch(apiUrl);
      console.log('Response status:', response.status);
      
      if (response.ok) {
        const data = await response.json();
        console.log('API Response data:', data);
        
        if (data.user) {
          console.log('User found:', data.user);
          setProfileUser(data.user);
          return;
        } else {
          console.warn('No user in response data');
        }
      } else {
        console.error('Response not OK:', response.status, response.statusText);
        const errorText = await response.text();
        console.error('Error response:', errorText);
      }
    } catch (error) {
      console.error('Fetch error:', error);
    }
    
    // Fallback to sample users if API fails
    console.log('Attempting fallback to sample users');
    const numericId = parseInt(userId);
    console.log('Numeric ID:', numericId);
    
    if (!isNaN(numericId)) {
      const user = sampleUsers.find(u => u.id === numericId);
      console.log('Found sample user:', user);
      
      if (user) {
        const userWithChar = { ...user, character: assignCharacter(user.style) };
        console.log('Setting profile user:', userWithChar);
        setProfileUser(userWithChar);
        
        // Log profile view
        if (currentUser) {
          fetch('/api/analytics/profile-view', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
              viewerId: currentUser._id || currentUser.id, 
              profileId: userId 
            })
          }).catch(err => console.error('Analytics failed:', err));
        }
      } else {
        console.error('User not found in sample users');
        setError(`Profile not found for ID: ${userId}`);
      }
    } else {
      console.error('Invalid numeric ID');
      setError('Invalid profile ID format');
    }
  };

  const fetchUserPosts = async (userId: string) => {
    try {
      const response = await fetch(`/api/posts?userId=${userId}`);
      if (response.ok) {
        const posts = await response.json();
        setUserPosts(posts.slice(0, 10)); // Last 10 posts
      }
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setLoadingPosts(false);
    }
  };

  const handleFollow = () => {
    setIsFollowing(!isFollowing);
    // TODO: Call API to follow/unfollow user
  };

  const handleMessage = () => {
    router.push(`/messages?userId=${params.id}`);
  };

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-lg p-6 max-w-md text-center">
          <div className="text-5xl mb-4">⚠️</div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">Error Loading Profile</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => router.back()}
            className="px-6 py-2 bg-gradient-to-r from-pink-500 to-purple-500 text-white font-bold rounded-lg"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }
  
  if (isLoading || !profileUser) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 flex items-center justify-center">
        <div className="text-xl font-bold bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent">
          Loading...
        </div>
      </div>
    );
  }

  const isOwnProfile = currentUser && (currentUser.id === profileUser.id || currentUser._id === profileUser._id);

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 pb-20">
      {/* Header */}
      <div className="bg-white shadow-sm sticky top-0 z-40">
        <div className="max-w-2xl mx-auto px-3 py-3 flex items-center gap-3">
          <button 
            onClick={() => router.back()} 
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="font-bold text-lg">{profileUser.name}</h1>
            <p className="text-xs text-gray-600">{userPosts.length} posts</p>
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto">
        {/* Cover & Profile Section */}
        <div className="bg-white mb-3">
          {/* Cover Photo */}
          <div className="h-40 bg-gradient-to-br from-pink-400 via-purple-400 to-blue-400" />
          
          {/* Profile Info */}
          <div className="px-4 pb-4">
            <div className="flex items-end justify-between -mt-16 mb-3">
              <div className="w-32 h-32 rounded-full border-4 border-white shadow-lg overflow-hidden bg-white">
                <CharacterAvatar character={profileUser.character} size={120} />
              </div>
              
              {!isOwnProfile && (
                <div className="flex gap-2 mb-2">
                  <button
                    onClick={handleMessage}
                    className="px-4 py-2 bg-gradient-to-r from-pink-500 to-purple-500 text-white text-sm font-bold rounded-lg hover:shadow-lg transition-all"
                  >
                    <MessageCircle className="w-4 h-4" />
                  </button>
                  <button
                    onClick={handleFollow}
                    className={`px-4 py-2 text-sm font-bold rounded-lg transition-all ${
                      isFollowing
                        ? 'bg-gray-200 text-gray-700'
                        : 'bg-blue-500 text-white hover:bg-blue-600'
                    }`}
                  >
                    {isFollowing ? <UserCheck className="w-4 h-4" /> : <UserPlus className="w-4 h-4" />}
                  </button>
                </div>
              )}
            </div>

            <div className="mt-3">
              <h2 className="text-2xl font-bold text-gray-800">
                {profileUser.name}, {profileUser.age}
              </h2>
              <p className="text-sm text-gray-600">{profileUser.gender}</p>
            </div>

            {/* Bio */}
            {profileUser.bio && (
              <p className="text-sm text-gray-700 mt-3 leading-relaxed">
                {profileUser.bio}
              </p>
            )}

            {/* Info */}
            <div className="mt-3 space-y-2">
              {profileUser.location && (
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <MapPin className="w-4 h-4" />
                  <span>{profileUser.location}</span>
                </div>
              )}
              {profileUser.occupation && (
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Briefcase className="w-4 h-4" />
                  <span>{profileUser.occupation}</span>
                </div>
              )}
              {profileUser.education && (
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <GraduationCap className="w-4 h-4" />
                  <span>{profileUser.education}</span>
                </div>
              )}
            </div>

            {/* Interests */}
            {profileUser.interests && profileUser.interests.length > 0 && (
              <div className="mt-3">
                <div className="flex flex-wrap gap-1.5">
                  {profileUser.interests.map((interest, i) => (
                    <span
                      key={i}
                      className="px-2 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-medium"
                    >
                      {interest}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Stats */}
            <div className="flex gap-6 mt-4 pt-4 border-t border-gray-100">
              <div className="text-center">
                <div className="font-bold text-gray-800">{userPosts.length}</div>
                <div className="text-xs text-gray-600">Posts</div>
              </div>
              <div className="text-center">
                <div className="font-bold text-gray-800">1.2k</div>
                <div className="text-xs text-gray-600">Followers</div>
              </div>
              <div className="text-center">
                <div className="font-bold text-gray-800">543</div>
                <div className="text-xs text-gray-600">Following</div>
              </div>
            </div>
          </div>
        </div>

        {/* Posts Section */}
        <div className="bg-white">
          <div className="px-4 py-3 border-b border-gray-100">
            <h3 className="font-bold text-gray-800">Posts</h3>
          </div>

          {loadingPosts ? (
            <div className="text-center py-12">
              <div className="inline-block w-8 h-8 border-4 border-purple-200 border-t-purple-500 rounded-full animate-spin" />
            </div>
          ) : userPosts.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-5xl mb-3">📝</div>
              <p className="text-sm text-gray-500">No posts yet</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {userPosts.map((post, index) => (
                <div key={post._id || post.id || index} className="p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <CharacterAvatar character={profileUser.character} size={40} />
                      <div>
                        <p className="text-sm font-semibold text-gray-800">{profileUser.name}</p>
                        <p className="text-xs text-gray-500">
                          {post.createdAt ? new Date(post.createdAt).toLocaleDateString() : 'Recently'}
                        </p>
                      </div>
                    </div>
                    <button className="p-1 hover:bg-gray-100 rounded-full transition-colors">
                      <MoreHorizontal className="w-4 h-4 text-gray-600" />
                    </button>
                  </div>
                  <p className="text-sm text-gray-700 leading-relaxed mb-3">{post.text}</p>
                  <div className="flex items-center gap-4 text-xs text-gray-500">
                    <button className="flex items-center gap-1 hover:text-pink-500 transition-colors">
                      <Heart className="w-4 h-4" />
                      <span>{post.likes || 0}</span>
                    </button>
                    <button className="flex items-center gap-1 hover:text-blue-500 transition-colors">
                      <MessageCircle className="w-4 h-4" />
                      <span>12</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
