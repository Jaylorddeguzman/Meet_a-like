'use client';

import React from 'react';
import { Zap, Trophy, Target, Flame, Star, Heart } from 'lucide-react';

interface EngagementBarProps {
  userName?: string;
  stats?: {
    posts: number;
    likes: number;
    matches: number;
    streak: number;
  };
}

const EngagementBar: React.FC<EngagementBarProps> = ({ 
  userName = 'User', 
  stats = { posts: 0, likes: 0, matches: 0, streak: 0 }
}) => {
  const level = Math.floor((stats.posts + stats.likes + stats.matches) / 10) + 1;
  const progress = ((stats.posts + stats.likes + stats.matches) % 10) * 10;

  return (
    <div className="bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 rounded-2xl shadow-lg p-0.5 mb-3">
      <div className="bg-white rounded-[15px] p-3">
        {/* Header */}
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-1.5">
            <Trophy className="w-4 h-4 text-yellow-500" />
            <span className="font-bold text-sm text-gray-800">Level {level}</span>
          </div>
          <div className="flex items-center gap-1.5 bg-orange-100 px-2 py-0.5 rounded-full">
            <Flame className="w-3 h-3 text-orange-500 animate-pulse" />
            <span className="font-bold text-xs text-orange-700">{stats.streak} day 🔥</span>
          </div>
        </div>

        {/* Progress bar */}
        <div className="relative mb-3">
          <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 rounded-full transition-all duration-500 animate-gradient-x"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="absolute -top-6 right-0 bg-purple-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
            {progress}% to Lv {level + 1}
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-4 gap-2">
          <div className="bg-gradient-to-br from-pink-50 to-pink-100 rounded-xl p-2 text-center hover:scale-105 transition-transform cursor-pointer">
            <div className="flex justify-center mb-0.5">
              <div className="w-6 h-6 bg-pink-500 rounded-full flex items-center justify-center">
                <Heart className="w-3 h-3 text-white fill-white" />
              </div>
            </div>
            <div className="font-bold text-gray-800 text-base">{stats.likes}</div>
            <div className="text-[10px] text-gray-600">Likes</div>
          </div>

          <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-2 text-center hover:scale-105 transition-transform cursor-pointer">
            <div className="flex justify-center mb-0.5">
              <div className="w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center">
                <Target className="w-3 h-3 text-white" />
              </div>
            </div>
            <div className="font-bold text-gray-800 text-base">{stats.matches}</div>
            <div className="text-[10px] text-gray-600">Matches</div>
          </div>

          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-2 text-center hover:scale-105 transition-transform cursor-pointer">
            <div className="flex justify-center mb-0.5">
              <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                <Zap className="w-3 h-3 text-white fill-white" />
              </div>
            </div>
            <div className="font-bold text-gray-800 text-base">{stats.posts}</div>
            <div className="text-[10px] text-gray-600">Posts</div>
          </div>

          <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-xl p-2 text-center hover:scale-105 transition-transform cursor-pointer">
            <div className="flex justify-center mb-0.5">
              <div className="w-6 h-6 bg-yellow-500 rounded-full flex items-center justify-center">
                <Star className="w-3 h-3 text-white fill-white" />
              </div>
            </div>
            <div className="font-bold text-gray-800 text-base">{level}</div>
            <div className="text-[10px] text-gray-600">Level</div>
          </div>
        </div>

        {/* Daily challenges */}
        <div className="mt-2 p-2 bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <Target className="w-3 h-3 text-purple-600" />
              <span className="text-xs font-semibold text-gray-700">Daily Challenge</span>
            </div>
            <span className="text-[10px] text-purple-600 font-bold">2/3</span>
          </div>
          <div className="mt-1 w-full h-1.5 bg-white rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-purple-500 to-blue-500 rounded-full" style={{ width: '66%' }} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default EngagementBar;
