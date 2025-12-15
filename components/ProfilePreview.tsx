'use client';

import React, { useState, useEffect } from 'react';
import { X, Heart, MessageCircle, Star, Clock, MapPin } from 'lucide-react';
import CharacterAvatar from './CharacterAvatar';
import { useTheme } from '@/contexts/ThemeContext';

interface ProfilePreviewProps {
  user: {
    id: number;
    name: string;
    age: number;
    gender: string;
    bio?: string;
    location?: string;
    interests?: string[];
    character: {
      emoji: string;
      gradient: string;
    };
  };
  onClose: () => void;
  onMatch?: () => void;
}

const ProfilePreview: React.FC<ProfilePreviewProps> = ({ user, onClose, onMatch }) => {
  const [isVisible, setIsVisible] = useState(false);
  const { currentTheme } = useTheme();

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(onClose, 300);
  };

  const handleMatch = () => {
    if (onMatch) onMatch();
    handleClose();
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black/40 backdrop-blur-sm z-50 transition-opacity duration-300 ${
          isVisible ? 'opacity-100' : 'opacity-0'
        }`}
        onClick={handleClose}
      />

      {/* Preview Card */}
      <div
        className={`fixed inset-x-3 top-1/2 -translate-y-1/2 md:inset-x-auto md:left-1/2 md:-translate-x-1/2 max-w-sm w-full z-50 transition-all duration-300 ${
          isVisible ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
        }`}
      >
        <div className="rounded-2xl shadow-2xl overflow-hidden animate-fade-in-up" style={{ background: currentTheme.cardBg }}>
          {/* Header with close button */}
          <div className="relative h-36 flex items-center justify-center" style={{ background: currentTheme.gradient }}>
            <button
              onClick={handleClose}
              className="absolute top-2 right-2 w-8 h-8 bg-black/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:opacity-90 transition-opacity"
            >
              <X className="w-4 h-4" style={{ color: currentTheme.textPrimary }} />
            </button>
            <CharacterAvatar character={user.character} size={80} />
            <div className="absolute bottom-2 right-2 px-2 py-0.5 rounded-full flex items-center gap-1" style={{ background: `${currentTheme.accentColor}22` }}>
              <div className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: currentTheme.accentColor }} />
              <span className="text-white text-xs font-semibold">Online</span>
            </div>
          </div>

          {/* Content */}
          <div className="p-4" style={{ color: currentTheme.textPrimary }}>
            {/* Name and age */}
            <div className="flex items-center gap-2 mb-3">
              <h2 className="text-2xl font-bold">
                {user.name}, {user.age}
              </h2>
              <Star className="w-5 h-5 text-yellow-400" />
            </div>

            {/* Info */}
            <div className="space-y-2 mb-4" style={{ color: currentTheme.textSecondary }}>
              <div className="flex items-center gap-1.5 text-sm">
                <MapPin className="w-3.5 h-3.5" />
                <span>{user.location || '5 miles away'}</span>
              </div>
              <div className="flex items-center gap-1.5 text-sm">
                <Clock className="w-3.5 h-3.5" />
                <span>Active 2 minutes ago</span>
              </div>
            </div>

            {/* Bio */}
            {user.bio && (
              <div className="mb-4">
                <h3 className="font-semibold text-sm mb-1">About</h3>
                <p className="text-sm leading-relaxed" style={{ color: currentTheme.textSecondary }}>{user.bio}</p>
              </div>
            )}

            {/* Interests */}
            <div className="mb-4">
              <h3 className="font-semibold text-sm mb-1.5">Interests</h3>
              <div className="flex flex-wrap gap-1.5">
                {(user.interests || ['Coffee', 'Music', 'Travel', 'Reading']).map((interest, i) => (
                  <span
                    key={i}
                    className="px-2 py-0.5 rounded-full text-xs font-medium"
                    style={{ background: `${currentTheme.accentColor}11`, color: currentTheme.textPrimary }}
                  >
                    {interest}
                  </span>
                ))}
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex gap-2">
              <button
                onClick={handleClose}
                className="flex-1 py-2 text-sm font-bold rounded-full transition-all hover:opacity-90"
                style={{ background: `${currentTheme.accentColor}11`, color: currentTheme.textPrimary }}
              >
                Maybe Later
              </button>
              <button
                onClick={handleMatch}
                className="flex-1 py-2 text-white text-sm font-bold rounded-full flex items-center justify-center gap-1.5 transition-all hover:opacity-95"
                style={{ background: currentTheme.accentColor }}
              >
                <Heart className="w-4 h-4" style={{ color: '#fff' }} />
                Like
              </button>
              <button
                className="px-3 py-2 rounded-full transition-all hover:opacity-90"
                style={{ background: currentTheme.accentColor, color: '#fff' }}
              >
                <MessageCircle className="w-4 h-4" />
              </button>
            </div>

            {/* View full profile link */}
            <button className="w-full mt-2 py-1.5 text-sm font-semibold rounded-xl transition-colors" style={{ color: currentTheme.accentColor, background: `${currentTheme.accentColor}11` }}>
              View Full Profile →
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProfilePreview;
