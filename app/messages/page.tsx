'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@/contexts/UserContext';
import BottomNav from '@/components/BottomNav';
import CharacterAvatar from '@/components/CharacterAvatar';
import LoadingSpinner from '@/components/LoadingSpinner';
import { X } from 'lucide-react';
import { sampleUsers } from '@/lib/data';
import { assignCharacter } from '@/lib/utils';

export default function MessagesPage() {
  const { currentUser, isLoading } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !currentUser) {
      router.push('/');
    }
  }, [currentUser, isLoading, router]);

  if (isLoading || !currentUser) {
    return <LoadingSpinner message="Loading messages..." />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 via-purple-100 to-blue-100 pb-20">
      <div className="max-w-2xl mx-auto p-4">
        <div className="bg-white rounded-3xl shadow-2xl p-6 mb-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">Messages</h2>
          </div>
        </div>
        
        <div className="space-y-3">
          {sampleUsers.slice(0, 3).map(user => {
            const userWithChar = { ...user, character: assignCharacter(user.style) };
            return (
              <div 
                key={user.id} 
                onClick={() => router.push(`/profile/${user.id}`)}
                className="bg-white rounded-2xl shadow-lg p-4 flex items-center gap-4 hover:shadow-xl transition cursor-pointer"
              >
                <CharacterAvatar character={userWithChar.character} size="sm" />
                <div className="flex-1">
                  <h3 className="font-bold">{user.name}</h3>
                  <p className="text-sm text-gray-600">Hey! How are you?</p>
                </div>
                <div className="w-3 h-3 bg-pink-500 rounded-full"></div>
              </div>
            );
          })}
          
          {sampleUsers.length === 0 && (
            <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
              <p className="text-gray-600">No messages yet. Start connecting with people!</p>
            </div>
          )}
        </div>
      </div>
      
      <BottomNav />
    </div>
  );
}
