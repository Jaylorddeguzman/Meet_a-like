'use client';

import React from 'react';
import { Heart, User } from 'lucide-react';
import { Post } from '@/lib/types';
import CharacterAvatar from './CharacterAvatar';
import { useRouter } from 'next/navigation';

interface PostCardProps {
  post: Post;
  user: {
    id: number;
    name: string;
    age: number;
    gender: string;
    character: {
      emoji: string;
      gradient: string;
    };
  };
}

const PostCard: React.FC<PostCardProps> = ({ post, user }) => {
  const router = useRouter();

  const handleProfileClick = () => {
    router.push(`/profile/${post.userId}`);
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition">
      <div className="flex items-start gap-4 mb-4">
        <div onClick={handleProfileClick} className="cursor-pointer">
          <CharacterAvatar character={user.character} size="md" />
        </div>
        <div className="flex-1">
          <h3 className="font-bold text-lg">{user.name}, {user.age}</h3>
          <p className="text-sm text-gray-600">{user.gender}</p>
        </div>
      </div>
      <p className="text-gray-800 mb-4">{post.text}</p>
      <div className="flex gap-4">
        <button className="flex items-center gap-2 text-pink-500 hover:text-pink-600 font-semibold">
          <Heart size={20} />
          {post.likes}
        </button>
        <button 
          onClick={handleProfileClick}
          className="flex items-center gap-2 text-purple-500 hover:text-purple-600 font-semibold"
        >
          <User size={20} />
          View Profile
        </button>
      </div>
    </div>
  );
};

export default PostCard;
