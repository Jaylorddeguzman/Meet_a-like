'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, MessageCircle, Settings } from 'lucide-react';

const BottomNav: React.FC = () => {
  const pathname = usePathname();

  const isActive = (path: string) => pathname === path;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t-2 border-gray-200 shadow-lg z-50">
      <div className="max-w-2xl mx-auto flex justify-around py-4">
        <Link 
          href="/feed" 
          className={`flex flex-col items-center gap-1 ${isActive('/feed') ? 'text-purple-500' : 'text-gray-500'}`}
        >
          <Home size={24} />
          <span className="text-xs font-semibold">Feed</span>
        </Link>
        <Link 
          href="/messages" 
          className={`flex flex-col items-center gap-1 ${isActive('/messages') ? 'text-purple-500' : 'text-gray-500'}`}
        >
          <MessageCircle size={24} />
          <span className="text-xs font-semibold">Messages</span>
        </Link>
        <button className="flex flex-col items-center gap-1 text-gray-500">
          <Settings size={24} />
          <span className="text-xs font-semibold">Settings</span>
        </button>
      </div>
    </div>
  );
};

export default BottomNav;
