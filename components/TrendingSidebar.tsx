'use client';

import React from 'react';
import { TrendingUp, Flame, Sparkles, Users, Heart } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';

interface TrendingUser {
  id: number;
  name: string;
  emoji: string;
  followers: number;
  isNew?: boolean;
}

const TrendingSidebar: React.FC = () => {
  const { currentTheme } = useTheme();
  const trendingUsers: TrendingUser[] = [
    { id: 1, name: 'Sarah', emoji: '😊', followers: 1234, isNew: true },
    { id: 2, name: 'Alex', emoji: '😎', followers: 987 },
    { id: 3, name: 'Emma', emoji: '🥰', followers: 856 },
    { id: 4, name: 'Jake', emoji: '🤗', followers: 743 },
    { id: 5, name: 'Lisa', emoji: '✨', followers: 621 },
  ];

  const trendingTopics = [
    { tag: '#DateNight', count: 2345 },
    { tag: '#FindLove', count: 1876 },
    { tag: '#Coffee', count: 1543 },
    { tag: '#Adventure', count: 1234 },
    { tag: '#BookLovers', count: 987 },
  ];

  return (
    <div className="hidden lg:block w-72 space-y-4">
      {/* Trending Users */}
      <div className="rounded-2xl p-4" style={{
        background: currentTheme.cardBg,
        border: `1px solid ${currentTheme.cardBorder}`
      }}>
        <div className="flex items-center gap-1.5 mb-3">
          <Flame className="w-4 h-4" style={{ color: currentTheme.accentColor }} />
          <h2 className="text-base font-bold" style={{ color: currentTheme.textPrimary }}>Trending</h2>
        </div>
        <div className="space-y-2">
          {trendingUsers.map((user, index) => (
            <div
              key={user.id}
              className="flex items-center gap-2 p-1.5 rounded-xl cursor-pointer transition-all group"
            >
              <div className="relative">
                <div className="w-10 h-10 rounded-full flex items-center justify-center text-lg" style={{ background: currentTheme.gradient }}>
                  {user.emoji}
                </div>
                {user.isNew && (
                  <div className="absolute -top-0.5 -right-0.5 text-white text-[9px] font-bold px-1 py-0.5 rounded-full" style={{ background: currentTheme.accentColor }}>
                    NEW
                  </div>
                )}
                <div className="absolute -bottom-0.5 -right-0.5 bg-orange-500 text-white text-[9px] font-bold px-1 py-0.5 rounded-full">
                  #{index + 1}
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm truncate" style={{ color: currentTheme.textPrimary }}>
                  {user.name}
                </p>
                <p className="text-[10px]" style={{ color: currentTheme.textSecondary }}>{user.followers.toLocaleString()} followers</p>
              </div>
              <Heart className="w-4 h-4 flex-shrink-0" style={{ color: currentTheme.accentColor }} />
            </div>
          ))}
        </div>
        <button className="w-full mt-3 py-1.5 text-sm font-semibold rounded-xl transition-colors" style={{ color: currentTheme.accentColor, background: `${currentTheme.accentColor}11` }}>
          View All
        </button>
      </div>

      {/* Trending Topics */}
      <div className="rounded-2xl p-4" style={{ background: currentTheme.cardBg, border: `1px solid ${currentTheme.cardBorder}` }}>
        <div className="flex items-center gap-1.5 mb-3">
          <TrendingUp className="w-4 h-4" style={{ color: currentTheme.accentColor }} />
          <h2 className="text-base font-bold" style={{ color: currentTheme.textPrimary }}>Topics</h2>
        </div>
        <div className="space-y-2">
          {trendingTopics.map((topic, index) => (
            <div
              key={index}
              className="p-2 rounded-xl cursor-pointer transition-all group"
              style={{ background: `${currentTheme.accentColor}0b`, borderRadius: 12 }}
            >
              <div className="flex items-center justify-between">
                <p className="font-semibold text-sm" style={{ color: currentTheme.textPrimary }}>
                  {topic.tag}
                </p>
                <Sparkles className="w-3 h-3" style={{ color: currentTheme.accentColor }} />
              </div>
              <p className="text-[10px] mt-0.5" style={{ color: currentTheme.textSecondary }}>
                {topic.count.toLocaleString()} posts
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Stats */}
      <div className="rounded-2xl p-4" style={{ background: currentTheme.gradient, color: '#fff' }}>
        <div className="flex items-center gap-1.5 mb-3">
          <Users className="w-4 h-4" />
          <h2 className="text-base font-bold">Community</h2>
        </div>
        <div className="space-y-2">
          <div className="flex justify-between items-center text-sm">
            <span>Active Users</span>
            <span className="text-xl font-bold">1.2k+</span>
          </div>
          <div className="flex justify-between items-center text-sm">
            <span>Matches Today</span>
            <span className="text-xl font-bold">234</span>
          </div>
          <div className="flex justify-between items-center text-sm">
            <span>Messages Sent</span>
            <span className="text-xl font-bold">5.6k</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrendingSidebar;
