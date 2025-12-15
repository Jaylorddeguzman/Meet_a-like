'use client';

import React, { useState, useEffect } from 'react';
import { X, MessageCircle, UserPlus, Heart, MapPin, Briefcase, GraduationCap, MoreHorizontal, UserCheck } from 'lucide-react';
import CharacterAvatar from './CharacterAvatar';

interface UserProfileModalProps {
  user: {
    id: number | string;
    _id?: string;
    name: string;
    age: number;
    gender: string;
    bio?: string;
    location?: string;
    occupation?: string;
    education?: string;
    interests?: string[];
    character: {
      emoji: string;
      gradient: string;
    };
  };
  onClose: () => void;
  currentUserId?: number | string;
}

const UserProfileModal: React.FC<UserProfileModalProps> = ({ user, onClose, currentUserId }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [userPosts, setUserPosts] = useState<any[]>([]);
  const [isFollowing, setIsFollowing] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setIsVisible(true);
    fetchUserPosts();
  }, []);

  const fetchUserPosts = async () => {
    try {
      // Fetch user's posts from API
      const response = await fetch(`/api/posts?userId=${user._id || user.id}`);
      if (response.ok) {
        const posts = await response.json();
        // Get last 10 posts
        setUserPosts(posts.slice(0, 10));
      }
    } catch (error) {
      console.error('Error fetching user posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(onClose, 300);
  };

  const handleMessage = () => {
    // Navigate to messages
    window.location.href = `/messages?userId=${user._id || user.id}`;
  };

  const handleFollow = () => {
    setIsFollowing(!isFollowing);
    // TODO: Call API to follow/unfollow user
  };

  const isOwnProfile = currentUserId && (currentUserId === user.id || currentUserId === user._id);

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black/50 backdrop-blur-sm z-50 transition-opacity duration-300 ${
          isVisible ? 'opacity-100' : 'opacity-0'
        }`}
        onClick={handleClose}
      />

      {/* Modal */}
      <div
        className={`fixed inset-x-0 bottom-0 md:inset-x-auto md:left-1/2 md:top-1/2 md:-translate-x-1/2 md:-translate-y-1/2 max-w-2xl w-full z-50 transition-all duration-300 ${
          isVisible ? 'translate-y-0 md:scale-100 opacity-100' : 'translate-y-full md:translate-y-0 md:scale-95 opacity-0'
        }`}
      >
        <div className="bg-white rounded-t-3xl md:rounded-3xl shadow-2xl overflow-hidden max-h-[90vh] md:max-h-[85vh] flex flex-col">
          {/* Header */}
          <div className="relative">
            {/* Cover gradient */}
            <div className="h-32 bg-gradient-to-br from-pink-400 via-purple-400 to-blue-400" />
            
            {/* Close button */}
            <button
              onClick={handleClose}
              className="absolute top-3 right-3 w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition-colors shadow-lg"
            >
              <X className="w-4 h-4 text-gray-700" />
            </button>

            {/* Profile Info */}
            <div className="px-4 pb-4">
              <div className="flex items-end gap-3 -mt-12">
                <div className="relative">
                  <div className="w-24 h-24 rounded-full border-4 border-white shadow-lg overflow-hidden bg-white">
                    <CharacterAvatar character={user.character} size={88} />
                  </div>
                  <div className="absolute bottom-1 right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white" />
                </div>
                
                <div className="flex-1 mb-2">
                  <h2 className="text-2xl font-bold text-gray-800">
                    {user.name}, {user.age}
                  </h2>
                  <p className="text-sm text-gray-600">{user.gender}</p>
                </div>

                {!isOwnProfile && (
                  <div className="flex gap-2 mb-2">
                    <button
                      onClick={handleMessage}
                      className="px-4 py-1.5 bg-gradient-to-r from-pink-500 to-purple-500 text-white text-sm font-bold rounded-full hover:shadow-lg transition-all hover:scale-105 active:scale-95 flex items-center gap-1.5"
                    >
                      <MessageCircle className="w-4 h-4" />
                      Message
                    </button>
                    <button
                      onClick={handleFollow}
                      className={`px-4 py-1.5 text-sm font-bold rounded-full transition-all hover:scale-105 active:scale-95 flex items-center gap-1.5 ${
                        isFollowing
                          ? 'bg-gray-200 text-gray-700'
                          : 'bg-blue-500 text-white hover:bg-blue-600'
                      }`}
                    >
                      {isFollowing ? (
                        <>
                          <UserCheck className="w-4 h-4" />
                          Following
                        </>
                      ) : (
                        <>
                          <UserPlus className="w-4 h-4" />
                          Follow
                        </>
                      )}
                    </button>
                  </div>
                )}
              </div>

              {/* Bio */}
              {user.bio && (
                <p className="text-sm text-gray-700 mt-3 leading-relaxed">
                  {user.bio}
                </p>
              )}

              {/* Info */}
              <div className="mt-3 space-y-2">
                {user.location && (
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <MapPin className="w-4 h-4" />
                    <span>{user.location}</span>
                  </div>
                )}
                {user.occupation && (
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Briefcase className="w-4 h-4" />
                    <span>{user.occupation}</span>
                  </div>
                )}
                {user.education && (
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <GraduationCap className="w-4 h-4" />
                    <span>{user.education}</span>
                  </div>
                )}
              </div>

              {/* Interests */}
              {user.interests && user.interests.length > 0 && (
                <div className="mt-3">
                  <div className="flex flex-wrap gap-1.5">
                    {user.interests.map((interest, i) => (
                      <span
                        key={i}
                        className="px-2 py-0.5 bg-purple-100 text-purple-700 rounded-full text-xs font-medium"
                      >
                        {interest}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Stats */}
              <div className="flex gap-4 mt-4 pt-4 border-t border-gray-100">
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
          <div className="flex-1 overflow-y-auto px-4 pb-4">
            <div className="flex items-center justify-between mb-3 pt-2">
              <h3 className="font-bold text-gray-800">Recent Posts</h3>
              <span className="text-xs text-gray-500">{userPosts.length} posts</span>
            </div>

            {loading ? (
              <div className="text-center py-8">
                <div className="inline-block w-8 h-8 border-4 border-purple-200 border-t-purple-500 rounded-full animate-spin" />
              </div>
            ) : userPosts.length === 0 ? (
              <div className="text-center py-8">
                <div className="text-4xl mb-2">📝</div>
                <p className="text-sm text-gray-500">No posts yet</p>
              </div>
            ) : (
              <div className="space-y-3">
                {userPosts.map((post, index) => (
                  <div
                    key={post._id || post.id || index}
                    className="bg-gray-50 rounded-2xl p-3 hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <CharacterAvatar character={user.character} size={32} />
                        <div>
                          <p className="text-sm font-semibold text-gray-800">{user.name}</p>
                          <p className="text-xs text-gray-500">
                            {post.createdAt ? new Date(post.createdAt).toLocaleDateString() : 'Recently'}
                          </p>
                        </div>
                      </div>
                      <button className="p-1 hover:bg-gray-200 rounded-full transition-colors">
                        <MoreHorizontal className="w-4 h-4 text-gray-600" />
                      </button>
                    </div>
                    <p className="text-sm text-gray-700 leading-relaxed">{post.text}</p>
                    <div className="flex items-center gap-3 mt-2 text-xs text-gray-500">
                      <div className="flex items-center gap-1">
                        <Heart className="w-3.5 h-3.5" />
                        <span>{post.likes || 0}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <MessageCircle className="w-3.5 h-3.5" />
                        <span>12</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default UserProfileModal;
