'use client';

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Heart, X, Info, MapPin, Briefcase, Sparkles } from 'lucide-react';
import CharacterAvatar from '@/components/CharacterAvatar';
import BottomNav from '@/components/BottomNav';
import { User } from '@/lib/types';
import { getMatchQuality, getMatchColor } from '@/lib/matching-algorithm';

interface MatchData {
  user: User;
  matchScore: number;
  matchBreakdown: {
    interests: number;
    traits: number;
    goals: number;
    location: number;
    age: number;
    lifestyle: number;
  };
  reasons: string[];
}

const DiscoverPage: React.FC = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [matches, setMatches] = useState<MatchData[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/');
    } else if (status === 'authenticated') {
      fetchMatches();
    }
  }, [status, router]);

  const fetchMatches = async () => {
    try {
      const response = await fetch('/api/discover?limit=20');
      if (response.ok) {
        const data = await response.json();
        setMatches(data.matches || []);
      }
    } catch (error) {
      console.error('Error fetching matches:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async () => {
    if (currentIndex >= matches.length) return;

    const currentMatch = matches[currentIndex];
    
    try {
      const response = await fetch('/api/matches', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: session?.user?.email,
          likedUserId: currentMatch.user.id
        })
      });

      if (response.ok) {
        const data = await response.json();
        if (data.isMatch) {
          alert("It's a match! 🎉");
        }
      }
    } catch (error) {
      console.error('Error liking user:', error);
    }

    nextCard();
  };

  const handlePass = () => {
    nextCard();
  };

  const nextCard = () => {
    setCurrentIndex(prev => prev + 1);
    setShowDetails(false);
  };

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-100 via-purple-100 to-blue-100 flex items-center justify-center">
        <div className="text-xl font-semibold text-purple-600">Loading matches...</div>
      </div>
    );
  }

  const currentMatch = matches[currentIndex];

  if (!currentMatch) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-100 via-purple-100 to-blue-100 pb-20">
        <div className="max-w-2xl mx-auto p-4 min-h-screen flex items-center justify-center">
          <div className="bg-white rounded-3xl shadow-2xl p-12 text-center">
            <Sparkles className="mx-auto mb-4 text-purple-500" size={64} />
            <h2 className="text-3xl font-bold text-gray-800 mb-4">No More Matches</h2>
            <p className="text-gray-600 mb-6">
              You've seen all available matches. Check back later for more!
            </p>
            <button
              onClick={() => router.push('/feed')}
              className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-8 py-3 rounded-xl font-bold hover:shadow-lg transition-all"
            >
              Go to Feed
            </button>
          </div>
        </div>
        <BottomNav />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 via-purple-100 to-blue-100 pb-20">
      <div className="max-w-2xl mx-auto p-4">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-4">
          <h1 className="text-3xl font-bold text-gray-800">Discover</h1>
          <p className="text-gray-600 mt-1">
            {matches.length - currentIndex} potential matches
          </p>
        </div>

        {/* Match Card */}
        <div className="relative">
          <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
            {/* Match Score Badge */}
            <div className="absolute top-4 right-4 z-10">
              <div className="bg-white rounded-full px-4 py-2 shadow-lg">
                <div className={`text-lg font-bold ${getMatchColor(currentMatch.matchScore)}`}>
                  {currentMatch.matchScore}% Match
                </div>
                <div className="text-xs text-gray-600">{getMatchQuality(currentMatch.matchScore)}</div>
              </div>
            </div>

            {/* Details Toggle */}
            <button
              onClick={() => setShowDetails(!showDetails)}
              className="absolute top-4 left-4 z-10 bg-white rounded-full p-3 shadow-lg hover:bg-gray-100 transition-colors"
            >
              <Info size={24} className="text-purple-600" />
            </button>

            {/* User Avatar */}
            <div className="bg-gradient-to-br from-purple-200 to-pink-200 p-12 flex items-center justify-center">
              <CharacterAvatar
                character={currentMatch.user.character}
                customization={currentMatch.user.characterCustomization}
                size={150}
              />
            </div>

            {/* User Info */}
            <div className="p-6">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h2 className="text-3xl font-bold text-gray-800">
                    {currentMatch.user.name}, {currentMatch.user.age}
                  </h2>
                  {currentMatch.user.location?.city && (
                    <div className="flex items-center text-gray-600 mt-1">
                      <MapPin size={16} className="mr-1" />
                      <span>{currentMatch.user.location.city}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Match Reasons */}
              {currentMatch.reasons.length > 0 && (
                <div className="mb-4">
                  <div className="flex flex-wrap gap-2">
                    {currentMatch.reasons.map((reason, idx) => (
                      <span
                        key={idx}
                        className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm font-semibold"
                      >
                        {reason}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Bio */}
              <p className="text-gray-700 mb-4">{currentMatch.user.bio}</p>

              {/* Additional Info */}
              {!showDetails && (
                <div className="space-y-2">
                  {currentMatch.user.occupation && (
                    <div className="flex items-center text-gray-600">
                      <Briefcase size={16} className="mr-2" />
                      <span>{currentMatch.user.occupation}</span>
                    </div>
                  )}
                  
                  {currentMatch.user.interests.length > 0 && (
                    <div>
                      <h4 className="font-semibold text-gray-800 mb-2">Interests</h4>
                      <div className="flex flex-wrap gap-2">
                        {currentMatch.user.interests.slice(0, 5).map((interest, idx) => (
                          <span
                            key={idx}
                            className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm"
                          >
                            {interest}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Detailed Match Breakdown */}
              {showDetails && (
                <div className="mt-4 space-y-3">
                  <h4 className="font-bold text-gray-800 mb-3">Compatibility Breakdown</h4>
                  
                  {Object.entries(currentMatch.matchBreakdown).map(([key, value]) => (
                    <div key={key} className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span className="font-semibold text-gray-700 capitalize">{key}</span>
                        <span className={`font-bold ${getMatchColor(value)}`}>{Math.round(value)}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all"
                          style={{ width: `${value}%` }}
                        />
                      </div>
                    </div>
                  ))}

                  {/* Full Profile Info */}
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    {currentMatch.user.education && (
                      <p className="text-sm text-gray-600 mb-2">
                        <strong>Education:</strong> {currentMatch.user.education}
                      </p>
                    )}
                    {currentMatch.user.relationshipGoal && (
                      <p className="text-sm text-gray-600 mb-2">
                        <strong>Looking for:</strong> {currentMatch.user.relationshipGoal}
                      </p>
                    )}
                    {currentMatch.user.traits.length > 0 && (
                      <div className="mb-2">
                        <strong className="text-sm text-gray-600">Personality:</strong>
                        <div className="flex flex-wrap gap-2 mt-1">
                          {currentMatch.user.traits.map((trait, idx) => (
                            <span
                              key={idx}
                              className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-xs"
                            >
                              {trait}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-center gap-6 mt-6">
            <button
              onClick={handlePass}
              className="bg-white text-red-500 p-6 rounded-full shadow-xl hover:shadow-2xl hover:scale-110 transition-all"
            >
              <X size={32} strokeWidth={3} />
            </button>
            <button
              onClick={handleLike}
              className="bg-gradient-to-r from-pink-500 to-red-500 text-white p-6 rounded-full shadow-xl hover:shadow-2xl hover:scale-110 transition-all"
            >
              <Heart size={32} strokeWidth={3} fill="currentColor" />
            </button>
          </div>
        </div>
      </div>

      <BottomNav />
    </div>
  );
};

export default DiscoverPage;
