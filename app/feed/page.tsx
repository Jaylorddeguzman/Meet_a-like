'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@/contexts/UserContext';
import { useTheme } from '@/contexts/ThemeContext';
import CharacterAvatar from '@/components/CharacterAvatar';
import BottomNav from '@/components/BottomNav';
import PostCard from '@/components/PostCard';
import NotificationBell from '@/components/NotificationBell';
import LoadingSpinner from '@/components/LoadingSpinner';
import { sampleUsers } from '@/lib/data';
import { Post } from '@/lib/types';
import { assignCharacter } from '@/lib/utils';
import { Sparkles, TrendingUp, Flame, Users } from 'lucide-react';

export default function FeedPage() {
  const { currentUser, addPost, isLoading } = useUser();
  const { currentTheme } = useTheme();
  const router = useRouter();
  const [newPost, setNewPost] = useState('');
  const [loading, setLoading] = useState(true);
  const [dbUser, setDbUser] = useState<any>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showFloatingHeart, setShowFloatingHeart] = useState(false);
  const [showQuickReact, setShowQuickReact] = useState(false);
  const [floatingEmojis, setFloatingEmojis] = useState<{id: number, emoji: string, x: number}[]>([]);
  const [pullDistance, setPullDistance] = useState(0);
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const feedRef = useRef<HTMLDivElement>(null);
  const startY = useRef(0);
  const emojiCounter = useRef(0);

  // Pull to refresh handler
  const handleTouchStart = (e: React.TouchEvent) => {
    startY.current = e.touches[0].clientY;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    const currentY = e.touches[0].clientY;
    const diff = currentY - startY.current;
    
    if (feedRef.current && feedRef.current.scrollTop === 0 && diff > 0) {
      setPullDistance(Math.min(diff, 120));
      if (diff > 80) {
        setIsRefreshing(true);
      }
    }
  };

  const handleTouchEnd = async () => {
    if (isRefreshing) {
      // Refresh posts
      try {
        const postsResponse = await fetch('/api/posts');
        if (postsResponse.ok) {
          const postsData = await postsResponse.json();
          setPosts(postsData);
        }
      } catch (error) {
        console.error('Error refreshing:', error);
      }
      setTimeout(() => setIsRefreshing(false), 1000);
    }
    setPullDistance(0);
  };

  // Add floating emoji animation
  const addFloatingEmoji = (emoji: string) => {
    const id = emojiCounter.current++;
    const x = Math.random() * 80 + 10; // Random position between 10-90%
    setFloatingEmojis(prev => [...prev, { id, emoji, x }]);
    setTimeout(() => {
      setFloatingEmojis(prev => prev.filter(e => e.id !== id));
    }, 3000);
  };

  // Random emoji burst for engagement
  const triggerEmojiBurst = () => {
    const emojis = ['💖', '✨', '🔥', '💫', '⭐', '💝'];
    for (let i = 0; i < 3; i++) {
      setTimeout(() => {
        addFloatingEmoji(emojis[Math.floor(Math.random() * emojis.length)]);
      }, i * 140);
    }
  };

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
  }, [dbUser, loading, router]);

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
        triggerEmojiBurst();
        
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
    <div 
      className="min-h-screen pb-20 overflow-x-hidden relative"
      style={{
        background: currentTheme.background,
        backgroundSize: '400% 400%',
        animation: currentTheme.backgroundAnimation,
      }}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Themed glow overlay */}
      <div className="fixed inset-0 pointer-events-none" style={{
        background: `
          radial-gradient(circle at 20% 30%, ${currentTheme.glowColor} 0%, transparent 50%),
          radial-gradient(circle at 80% 70%, ${currentTheme.glowColor} 0%, transparent 50%),
          radial-gradient(circle at 50% 50%, ${currentTheme.glowColor.replace('0.5', '0.3')} 0%, transparent 50%)
        `,
      }} />
      {/* Floating emojis animation */}
      {floatingEmojis.map(({id, emoji, x}) => (
        <div 
          key={id}
          className="fixed pointer-events-none z-50 animate-float-up text-3xl"
          style={{
            left: `${x}%`,
            bottom: '18%'
          }}
        >
          {emoji}
        </div>
      ))}

      {/* Pull to refresh indicator */}
      {pullDistance > 0 && (
        <div 
          className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50 transition-all duration-200"
          style={{ opacity: Math.min(pullDistance / 80, 1) }}
        >
          <div className="backdrop-blur-xl px-5 py-3 rounded-full shadow-lg flex items-center gap-3 border-2" style={{
            background: currentTheme.cardBg,
            borderColor: currentTheme.cardBorder
          }}>
            <div 
              className="w-6 h-6 border-3 rounded-full"
              style={{
                borderColor: currentTheme.accentColor,
                borderTopColor: 'transparent',
                transform: `rotate(${pullDistance * 4}deg)`,
                transition: 'transform 0.1s'
              }}
            />
            <span className="font-bold text-sm" style={{ color: currentTheme.textPrimary }}>
              {pullDistance > 80 ? 'Release to refresh' : 'Pull to refresh'}
            </span>
          </div>
        </div>
      )}

      {/* Pull to refresh indicator */}
      {isRefreshing && (
        <div className="fixed top-24 left-1/2 transform -translate-x-1/2 z-50 backdrop-blur-xl px-6 py-3 rounded-full shadow-lg flex items-center gap-3 animate-bounce border-2" style={{
          background: currentTheme.cardBg,
          borderColor: currentTheme.cardBorder
        }}>
          <Sparkles className="w-5 h-5 animate-spin" style={{ color: currentTheme.accentColor }} />
          <span className="font-bold" style={{ color: currentTheme.textPrimary }}>Refreshing...</span>
        </div>
      )}

      <div className="max-w-2xl mx-auto px-4 py-3" ref={feedRef}>
        {/* Quick React Floating Button */}
        <button
          onClick={() => setShowQuickReact(!showQuickReact)}
          className="fixed bottom-24 right-6 z-40 w-14 h-14 rounded-full shadow-md flex items-center justify-center text-2xl hover:scale-105 active:scale-95 transition-all"
          style={{
            background: currentTheme.accentColor,
            color: '#fff',
            boxShadow: `0 8px 24px ${currentTheme.glowColor}`
          }}
        >
          ✨
        </button>

        {/* Quick Reactions Panel */}
        {showQuickReact && (
          <>
            <div 
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 animate-fade-in"
              onClick={() => setShowQuickReact(false)}
            />
            <div className="fixed bottom-44 right-6 z-50 backdrop-blur-xl rounded-3xl shadow-2xl p-4 animate-scale-in border-2" style={{
              background: currentTheme.cardBg,
              borderColor: currentTheme.cardBorder
            }}>
              <div className="flex flex-col gap-2">
                <div className="text-xs font-bold mb-1 text-center" style={{ color: currentTheme.textPrimary }}>Quick React!</div>
                {['💖', '😍', '🔥', '😂', '😮', '👏', '✨', '💝'].map((emoji, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      addFloatingEmoji(emoji);
                      setShowQuickReact(false);
                    }}
                    className="w-12 h-12 flex items-center justify-center text-2xl hover:scale-125 active:scale-95 transition-all rounded-xl hover:bg-white/10"
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </div>
          </>
        )}

        {/* Header with online status */}
        <div className="backdrop-blur-xl rounded-3xl shadow-lg p-4 mb-4 flex items-center justify-between sticky top-2 z-40" style={{
          background: currentTheme.cardBg,
          border: `2px solid ${currentTheme.cardBorder}`,
          boxShadow: `0 8px 32px -4px rgba(0, 0, 0, 0.3), 0 0 20px ${currentTheme.glowColor}`
        }}>
          <div className="flex items-center gap-3">
            <div className="relative">
              <h1 className="text-xl md:text-2xl font-bold" style={{ color: currentTheme.textPrimary }}>
                CharacterMatch
              </h1>
              <div className="absolute -top-1 -right-2">
                <Flame className="w-4 h-4 text-orange-500 animate-pulse drop-shadow" />
              </div>
            </div>
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full animate-pulse-subtle" style={{
              background: `${currentTheme.accentColor}22`,
              border: `1px solid ${currentTheme.accentColor}66`
            }}>
              <div className="w-2 h-2 rounded-full animate-ping" style={{ background: currentTheme.accentColor }} />
              <span className="text-xs font-bold" style={{ color: currentTheme.textPrimary }}>{234 + Math.floor(Math.random() * 20)}</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full" style={{
              background: `${currentTheme.accentColor}22`,
              border: `1px solid ${currentTheme.accentColor}66`
            }}>
              <Sparkles className="w-3.5 h-3.5 animate-spin-slow" style={{ color: currentTheme.accentColor }} />
              <span className="text-sm font-bold" style={{ color: currentTheme.textPrimary }}>{posts.length} Posts</span>
            </div>
            <NotificationBell />
          </div>
        </div>


        
        {/* Create Post - Enhanced */}
        <div className="backdrop-blur-xl rounded-3xl shadow-lg p-4 mb-4 hover:shadow-2xl transition-all" style={{
          background: currentTheme.cardBg,
          border: `2px solid ${currentTheme.cardBorder}`,
          boxShadow: `0 4px 24px -2px ${currentTheme.glowColor}`
        }}>
          <div className="flex gap-3">
            <div className="relative flex-shrink-0">
              <CharacterAvatar character={user.character} size={48} />
              <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full flex items-center justify-center" style={{
                background: `linear-gradient(to right, ${currentTheme.accentColor}, ${currentTheme.accentColor}dd)`
              }}>
                <Sparkles className="w-2 h-2 text-white drop-shadow" />
              </div>
            </div>
            <div className="flex-1">
              <textarea
                value={newPost}
                onChange={(e) => setNewPost(e.target.value)}
                className="w-full px-4 py-3 rounded-2xl border-2 focus:outline-none resize-none transition-all text-[15px] placeholder:opacity-60"
                style={{
                  background: `${currentTheme.cardBg}ee`,
                  borderColor: currentTheme.cardBorder,
                  color: currentTheme.textPrimary,
                }}
                placeholder={selectedMood ? `Feeling ${selectedMood}... Share it! ✨` : "Share something amazing... ✨"}
                rows={2}
                maxLength={280}
              />
              <div className="flex items-center justify-between mt-3">
                <div className="flex gap-2 items-center">
                  {/* Mood selector */}
                  <div className="flex gap-1">
                    {[
                      { emoji: '😊', label: 'happy' },
                      { emoji: '😍', label: 'love' },
                      { emoji: '🔥', label: 'fire' },
                      { emoji: '✨', label: 'sparkle' }
                    ].map(mood => (
                      <button
                        key={mood.emoji}
                        onClick={() => setSelectedMood(selectedMood === mood.label ? null : mood.label)}
                        className={`p-2 rounded-xl transition-all text-xl hover:scale-110 active:scale-95 ${
                          selectedMood === mood.label 
                            ? 'scale-110 shadow-lg' 
                            : 'hover:bg-white/10'
                        }`}
                        style={{
                          background: selectedMood === mood.label ? `${currentTheme.accentColor}33` : 'transparent'
                        }}
                      >
                        {mood.emoji}
                      </button>
                    ))}
                  </div>
                  <div className="h-6 w-px opacity-30" style={{ background: currentTheme.textSecondary }}></div>
                  {/* Character count */}
                  <span className={`text-xs font-bold ${
                    newPost.length > 250 
                      ? 'text-red-400' 
                      : newPost.length > 200 
                        ? 'text-orange-400' 
                        : ''
                  }`} style={{
                    color: newPost.length > 200 ? undefined : currentTheme.textSecondary
                  }}>
                    {newPost.length}/280
                  </span>
                </div>
                <button 
                  onClick={handlePost}
                  disabled={!newPost.trim()}
                  className="px-5 py-2 text-white text-sm font-bold rounded-full hover:shadow-lg transition-all disabled:opacity-40 disabled:cursor-not-allowed hover:scale-105 active:scale-95"
                  style={{
                    background: !newPost.trim() ? '#6b7280' : `linear-gradient(135deg, ${currentTheme.accentColor}, ${currentTheme.accentColor}dd)`,
                    boxShadow: !newPost.trim() ? 'none' : `0 4px 16px ${currentTheme.glowColor}`
                  }}
                >
                  Post
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Trending Topics Card */}
        <div className="backdrop-blur-xl rounded-3xl shadow-lg p-4 mb-4 border-2 animate-fade-in" style={{
          background: `${currentTheme.cardBg}ee`,
          borderColor: currentTheme.cardBorder
        }}>
          <div className="flex items-center gap-2 mb-3">
            <TrendingUp className="w-5 h-5 animate-bounce" style={{ color: currentTheme.accentColor }} />
            <h3 className="text-sm font-bold" style={{ color: currentTheme.textPrimary }}>Trending Now</h3>
          </div>
          <div className="flex flex-wrap gap-2">
            {['#AnimeMatch', '#AICharacter', '#Dating2025', '#VirtualLove', '#CharacterGoals', '#CuteVibes'].map((tag, i) => (
              <button
                key={i}
                onClick={() => addFloatingEmoji(['💖', '✨', '🔥', '💫'][i % 4])}
                className="px-3 py-1.5 backdrop-blur-sm rounded-full text-xs font-bold hover:scale-105 active:scale-95 transition-all border-2 shadow-sm"
                style={{
                  background: `${currentTheme.accentColor}22`,
                  color: currentTheme.textPrimary,
                  borderColor: currentTheme.cardBorder
                }}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>

        {/* Trending/Hot Posts Indicator */}
        <div className="flex items-center gap-2 mb-3 px-1">
          <TrendingUp className="w-4 h-4 animate-bounce" style={{ color: currentTheme.accentColor }} />
          <span className="text-sm font-bold" style={{ color: currentTheme.textPrimary }}>Trending Posts</span>
          <div className="flex-1 h-px opacity-30" style={{ background: currentTheme.textSecondary }} />
        </div>
        
        {/* Posts Feed - Enhanced */}
        <div className="backdrop-blur-xl rounded-3xl shadow-lg overflow-hidden border-2" style={{
          background: currentTheme.cardBg,
          borderColor: currentTheme.cardBorder
        }}>
          {posts.length === 0 ? (
            <div className="p-10 text-center animate-fade-in">
              <div className="relative inline-block mb-6">
                <div className="text-7xl animate-bounce">💝</div>
                <div className="absolute -top-2 -right-2 text-3xl animate-spin-slow">✨</div>
                <div className="absolute -bottom-2 -left-2 text-3xl animate-pulse">💫</div>
              </div>
              <h3 className="text-2xl font-bold mb-3" style={{ color: currentTheme.textPrimary }}>
                Your Feed Awaits!
              </h3>
              <p className="text-sm mb-6 max-w-sm mx-auto leading-relaxed" style={{ color: currentTheme.textSecondary }}>
                Share your thoughts, connect with amazing AI characters, and discover stories that resonate with you.
              </p>
              <div className="flex flex-wrap gap-2 justify-center mb-6">
                {['💖 Find Love', '✨ Make Friends', '🔥 Get Inspired', '🌟 Be You'].map((text, i) => (
                  <span key={i} className="px-4 py-2 backdrop-blur-sm rounded-full text-xs font-bold border-2 shadow-sm" style={{
                    background: `${currentTheme.accentColor}22`,
                    color: currentTheme.textPrimary,
                    borderColor: currentTheme.cardBorder
                  }}>
                    {text}
                  </span>
                ))}
              </div>
              <button 
                onClick={() => document.querySelector('textarea')?.focus()}
                className="px-8 py-3 text-white text-sm font-bold rounded-full hover:shadow-lg transition-all hover:scale-105 active:scale-95"
                style={{
                  background: `linear-gradient(135deg, ${currentTheme.accentColor}, ${currentTheme.accentColor}dd)`,
                  boxShadow: `0 4px 16px ${currentTheme.glowColor}`
                }}
              >
                Create Your First Post ✨
              </button>
            </div>
          ) : (
            <>
              {/* Interactive Tips Card - Show for users with few posts */}
              {posts.length > 0 && posts.length < 3 && (
                <div className="p-5 border-b-2" style={{ borderColor: currentTheme.cardBorder }}>
                  <div className="flex items-start gap-4">
                    <div className="text-4xl animate-bounce">💡</div>
                    <div className="flex-1">
                      <h4 className="font-bold text-base mb-3" style={{ color: currentTheme.textPrimary }}>Pro Tips!</h4>
                      <div className="space-y-2.5 text-sm" style={{ color: currentTheme.textSecondary }}>
                        <div className="flex items-center gap-3 animate-stagger-1">
                          <span className="text-lg">•</span>
                          <span><strong>Double-tap</strong> posts to like them instantly</span>
                        </div>
                        <div className="flex items-center gap-3 animate-stagger-2">
                          <span className="text-lg">•</span>
                          <span><strong>Swipe right</strong> to like, <strong>left</strong> to save</span>
                        </div>
                        <div className="flex items-center gap-3 animate-stagger-3">
                          <span className="text-lg">•</span>
                          <span>Use <strong>✨ Quick React</strong> button for fun interactions</span>
                        </div>
                      </div>
                    </div>
                    <button 
                      onClick={() => {/* Could set a cookie to hide this */}}
                      className="hover:opacity-70 transition-opacity text-base"
                      style={{ color: currentTheme.textSecondary }}
                    >
                      ✕
                    </button>
                  </div>
                </div>
              )}
              
              {posts.map((post: any, i) => {
              // For database posts, user info is already in the post
              const postUser = post.userName ? {
                id: post.userId,
                _id: post.userId,
                name: post.userName,
                character: post.userCharacter
              } : getUserById(post.userId);
              
              if (!postUser) return null;
              
              return (
                <div key={post._id || post.id || i} className={i < posts.length - 1 ? "border-b-2" : ""} style={{ borderColor: currentTheme.cardBorder }}>
                  <PostCard 
                    post={post} 
                    user={postUser}
                    onLike={() => setShowFloatingHeart(true)}
                    currentUserId={user._id || user.id}
                  />
                </div>
              );
            })}
            </>
          )}
        </div>

        {/* Load more indicator */}
        <div className="mt-6 text-center pb-4">
          <button className="px-6 py-3 backdrop-blur-xl rounded-full shadow-lg hover:shadow-xl transition-all flex items-center gap-2 mx-auto group hover:scale-105 active:scale-95 text-sm font-bold border-2" style={{
            background: currentTheme.cardBg,
            borderColor: currentTheme.cardBorder,
            color: currentTheme.textPrimary
          }}>
            <Users className="w-5 h-5 group-hover:animate-pulse" style={{ color: currentTheme.accentColor }} />
            <span>Load More</span>
          </button>
        </div>
      </div>
      
      <BottomNav />
    </div>
  );
}
