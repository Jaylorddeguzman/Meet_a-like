'use client';

import React, { useState } from 'react';
import { Heart, MessageCircle, Bookmark, MoreHorizontal, Flame, Sparkles } from 'lucide-react';
import { Post } from '@/lib/types';
import CharacterAvatar from './CharacterAvatar';
import { useRouter } from 'next/navigation';
import Toast from './Toast';
import { useTheme } from '@/contexts/ThemeContext';

interface PostCardProps {
  post: Post;
  user: {
    id: number;
    _id?: string;
    name: string;
    age: number;
    gender: string;
    character: {
      emoji: string;
      gradient: string;
    };
  };
  onLike?: () => void;
  currentUserId?: number | string;
}

const PostCard: React.FC<PostCardProps> = ({ post, user, onLike, currentUserId }) => {
  const router = useRouter();
  const { currentTheme } = useTheme();
  const [liked, setLiked] = useState(false);
  const [likes, setLikes] = useState(post.likes || 0);
  const [saved, setSaved] = useState(false);
  const [selectedReaction, setSelectedReaction] = useState<string | null>(null);
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [localComments, setLocalComments] = useState(post.comments || []);
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);
  const [showFloatingEmoji, setShowFloatingEmoji] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);
  const [lastTap, setLastTap] = useState(0);
  const [showDoubleTapHeart, setShowDoubleTapHeart] = useState(false);

  const reactions = ['❤️', '😍', '🔥', '👍', '😂', '😮'];

  const handleProfileClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    const userId = user._id || user.id || post.userId;
    
    console.log('=== PROFILE CLICK DEBUG ===');
    console.log('User object:', user);
    console.log('Post userId:', post.userId);
    console.log('Resolved userId:', userId);
    console.log('Navigation URL:', `/profile/${userId}`);
    
    if (!userId) {
      console.error('ERROR: No userId found!');
      setErrorMessage('Unable to load profile - no user ID found');
      return;
    }
    
    try {
      router.push(`/profile/${userId}`);
      console.log('Navigation initiated successfully');
    } catch (error) {
      console.error('Navigation error:', error);
      setErrorMessage('Failed to navigate to profile');
    }
  };

  const handleLike = () => {
    setLiked(!liked);
    setLikes(liked ? likes - 1 : likes + 1);
    if (!liked && onLike) {
      onLike();
      // Trigger floating heart animation
      setShowFloatingEmoji('💖');
      setTimeout(() => setShowFloatingEmoji(null), 1000);
    }
  };

  // (reactions handled via handleSendReaction)

  const handleSendReaction = (emoji: string) => {
    // If same reaction clicked, remove it and unlike; otherwise set reaction and like
    if (selectedReaction === emoji) {
      setSelectedReaction(null);
      if (liked) handleLike();
    } else {
      setSelectedReaction(emoji);
      if (!liked) handleLike();
      // small visual feedback
      setShowFloatingEmoji(emoji);
      setTimeout(() => setShowFloatingEmoji(null), 800);
    }
    // TODO: send reaction to server via API
  };

  const handleToggleComments = () => {
    setShowComments(!showComments);
  };

  const handleSubmitComment = async () => {
    const text = commentText.trim();
    if (!text) return;

    const postId = (post as any)._id || (post as any).id || (post as any).postId || null;
    const userId = currentUserId;

    if (!postId) {
      setErrorMessage('Unable to identify post to comment on');
      return;
    }

    if (!userId) {
      setErrorMessage('You must be signed in to comment');
      return;
    }

    // optimistic UI update while persisting
    setIsSubmittingComment(true);
    try {
      const res = await fetch('/api/posts/comments', {
        method: 'POST',
        credentials: 'same-origin',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ postId, userId, text })
      });

      const raw = await res.text();
      let data: any = {};
      if (raw) {
        try {
          data = JSON.parse(raw);
        } catch (parseErr) {
          // Server returned non-JSON (likely HTML error page). Surface helpful message.
          throw new Error('Server returned non-JSON response: ' + String(raw).slice(0,200));
        }
      }

      if (!res.ok) {
        throw new Error(data?.error || `Failed to add comment (status ${res.status})`);
      }

      // Append returned comment (server authored fields) to local comments
      if (data.comment) {
        setLocalComments(prev => [...(prev || []), data.comment]);
      } else {
        // fallback: append a minimal local comment
        setLocalComments(prev => [...(prev || []), { userId, userName: 'You', userCharacter: null, text, createdAt: new Date() }]);
      }

      setCommentText('');
      setShowFloatingEmoji('💬');
      setTimeout(() => setShowFloatingEmoji(null), 800);
    } catch (err: any) {
      console.error('Comment submit error', err);
      setErrorMessage(err?.message || 'Failed to submit comment');
    } finally {
      setIsSubmittingComment(false);
    }
  };

  // Double tap to like
  const handleDoubleTap = () => {
    const now = Date.now();
    const DOUBLE_TAP_DELAY = 300;
    
    if (now - lastTap < DOUBLE_TAP_DELAY) {
      if (!liked) {
        handleLike();
        setShowDoubleTapHeart(true);
        setTimeout(() => setShowDoubleTapHeart(false), 1000);
      }
    }
    setLastTap(now);
  };

  // Swipe gestures
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (touchStart - touchEnd > 150) {
      // Swiped left - save post
      setSaved(true);
      setShowFloatingEmoji('🔖');
      setTimeout(() => setShowFloatingEmoji(null), 1000);
    }
    
    if (touchEnd - touchStart > 150) {
      // Swiped right - like post
      if (!liked) {
        handleLike();
      }
    }
  };

  return (
    <>
      {errorMessage && (
        <Toast 
          message={errorMessage} 
          type="error" 
          onClose={() => setErrorMessage(null)} 
        />
      )}
      
      <div className="transition-all duration-300 overflow-hidden group animate-fade-in-up relative active:scale-98"
        onDoubleClick={handleDoubleTap}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* Floating reaction emoji */}
      {showFloatingEmoji && (
        <div className="absolute inset-0 pointer-events-none z-10 flex items-center justify-center">
          <div className="text-5xl animate-float-heart drop-shadow-lg">{showFloatingEmoji}</div>
        </div>
      )}

      {/* Double tap heart */}
      {showDoubleTapHeart && (
        <div className="absolute inset-0 pointer-events-none z-10 flex items-center justify-center">
          <div className="text-8xl animate-heart-beat opacity-90 drop-shadow-2xl">❤️</div>
        </div>
      )}

      <div className="p-4">
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3 cursor-pointer hover:opacity-90 transition-opacity" onClick={handleProfileClick}>
            <div className="relative flex-shrink-0">
              <CharacterAvatar character={user.character} size={48} />
              <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-white animate-pulse shadow-lg" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-base leading-tight" style={{ color: currentTheme.textPrimary }}>
                  {user.name}, {user.age}
                </h3>
                {likes > 50 && (
                  <Flame className="w-4 h-4 text-orange-500 animate-pulse drop-shadow" />
                )}
              </div>
              <div className="flex items-center gap-1.5 mt-0.5">
                <p className="text-xs font-medium" style={{ color: currentTheme.textSecondary }}>{user.gender}</p>
                <span className="text-xs opacity-40" style={{ color: currentTheme.textSecondary }}>•</span>
                <p className="text-xs opacity-75" style={{ color: currentTheme.textSecondary }}>2h ago</p>
              </div>
            </div>
          </div>
          <button className="p-2 hover:bg-white/10 rounded-full transition-all hover:scale-110 active:scale-95">
            <MoreHorizontal className="w-5 h-5" style={{ color: currentTheme.textSecondary }} />
          </button>
        </div>

        {/* Content */}
        <p className="text-[15px] mb-3 leading-relaxed font-normal" style={{ color: currentTheme.textPrimary }}>{post.text}</p>

        {/* Engagement summary (clickable): left = react, right = comments */}
        <div className="flex items-center justify-between text-xs mb-3 pb-3" style={{ 
          color: currentTheme.textSecondary,
          borderBottom: `1px solid ${currentTheme.cardBorder}`
        }}>
          <div
            className="flex items-center gap-1.5 cursor-pointer"
            onClick={() => handleSendReaction('❤️')}
            style={{ padding: '6px 8px', borderRadius: 999 }}
          >
            {selectedReaction && <span className="text-base">{selectedReaction}</span>}
            <span className="font-bold text-sm" style={{ color: currentTheme.textPrimary }}>{likes}</span>
            <span className="opacity-90">reactions</span>
          </div>
          <div className="cursor-pointer" onClick={handleToggleComments} style={{ padding: '6px 8px', borderRadius: 999 }}>
            <span className="opacity-90">{post.comments ? post.comments.length : 0} comments</span>
          </div>
        </div>

        {/* (Removed extra action buttons to save space) */}

        {/* Inline Comment Area */}
        {showComments && (
          <div className="mt-3 px-2">
            <div className="space-y-3">
              {localComments && localComments.length > 0 && (
                <div className="space-y-2 max-h-44 overflow-auto pr-2">
                  {localComments.slice(-3).map((c, idx) => (
                    <div key={idx} className="flex items-start gap-2">
                      <div className="flex-shrink-0">
                        <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: c.userCharacter?.gradient || currentTheme.gradient }}>{c.userCharacter?.emoji}</div>
                      </div>
                      <div>
                        <div className="text-sm font-semibold" style={{ color: currentTheme.textPrimary }}>{c.userName}</div>
                        <div className="text-sm" style={{ color: currentTheme.textSecondary }}>{c.text}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <div className="flex items-start gap-3">
                <div className="flex-shrink-0">
                  <CharacterAvatar character={user.character} size={36} />
                </div>
                <div className="flex-1">
                  <textarea
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border-2 focus:outline-none resize-none text-sm"
                    style={{ background: `${currentTheme.cardBg}ee`, borderColor: currentTheme.cardBorder, color: currentTheme.textPrimary }}
                    placeholder="Write a comment..."
                    rows={2}
                  />
                  <div className="flex items-center justify-end gap-2 mt-2">
                    <button onClick={() => { setCommentText(''); setShowComments(false); }} className="text-sm" style={{ color: currentTheme.textSecondary }}>Cancel</button>
                    <button onClick={handleSubmitComment} disabled={isSubmittingComment} className="px-3 py-1 rounded-full text-sm font-semibold text-white disabled:opacity-40" style={{ background: currentTheme.accentColor }}>{isSubmittingComment ? 'Sending...' : 'Send'}</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
    </>
  );
};

export default PostCard;
