'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useUser } from '@/contexts/UserContext';
import CharacterAvatar from '@/components/CharacterAvatar';
import { X, MessageCircle } from 'lucide-react';
import { sampleUsers } from '@/lib/data';
import { User } from '@/lib/types';
import { assignCharacter } from '@/lib/utils';

export default function ProfilePage() {
  const { currentUser, isLoading } = useUser();
  const router = useRouter();
  const params = useParams();
  const [profileUser, setProfileUser] = useState<User | null>(null);

  useEffect(() => {
    if (!isLoading && !currentUser) {
      router.push('/');
      return;
    }

    const userId = parseInt(params.id as string);
    
    if (userId === currentUser?.id) {
      setProfileUser(currentUser);
    } else {
      const user = sampleUsers.find(u => u.id === userId);
      if (user) {
        setProfileUser({ ...user, character: assignCharacter(user.style) });
        
        // Log profile view via API route
        if (currentUser) {
          fetch('/api/analytics/profile-view', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ viewerId: currentUser.id, profileId: userId })
          }).catch(err => console.error('Analytics logging failed:', err));
        }
      }
    }
  }, [params.id, currentUser, isLoading, router]);

  if (isLoading || !currentUser || !profileUser) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-100 via-purple-100 to-blue-100 flex items-center justify-center">
        <div className="text-2xl font-bold bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent">
          Loading...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 via-purple-100 to-blue-100">
      <div className="max-w-2xl mx-auto p-4">
        <button 
          onClick={() => router.back()} 
          className="mb-4 p-2 bg-white rounded-full shadow-lg hover:shadow-xl transition"
        >
          <X size={24} />
        </button>
        
        <div className="bg-white rounded-3xl shadow-2xl p-8">
          <div className="flex flex-col items-center mb-6">
            <CharacterAvatar character={profileUser.character} size="xl" />
            <h2 className="text-3xl font-bold mt-4">{profileUser.name}, {profileUser.age}</h2>
            <p className="text-gray-600">{profileUser.gender}</p>
          </div>
          
          <div className="mb-6">
            <h3 className="font-bold text-lg mb-2">About</h3>
            <p className="text-gray-700">{profileUser.bio}</p>
          </div>
          
          {profileUser.interests && profileUser.interests.length > 0 && (
            <div className="mb-6">
              <h3 className="font-bold text-lg mb-2">Interests</h3>
              <div className="flex flex-wrap gap-2">
                {profileUser.interests.map((interest, i) => (
                  <span 
                    key={i} 
                    className="px-4 py-2 bg-gradient-to-r from-pink-200 to-purple-200 rounded-full text-sm font-semibold"
                  >
                    {interest}
                  </span>
                ))}
              </div>
            </div>
          )}
          
          {profileUser.id !== currentUser.id && (
            <button 
              onClick={() => router.push('/messages')} 
              className="w-full bg-gradient-to-r from-pink-500 to-purple-500 text-white font-bold py-3 rounded-xl hover:shadow-lg transform hover:scale-105 transition flex items-center justify-center gap-2"
            >
              <MessageCircle size={20} />
              Send Message
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
