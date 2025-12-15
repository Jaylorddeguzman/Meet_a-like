'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, MessageCircle, Settings, Heart } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';

const BottomNav: React.FC = () => {
  const pathname = usePathname();
  const { currentTheme } = useTheme();

  const isActive = (path: string) => pathname === path;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50" style={{
      background: currentTheme.cardBg,
      borderTop: `1px solid ${currentTheme.cardBorder}`
    }}>
      <div className="max-w-2xl mx-auto flex justify-around py-3">
        <Link 
          href="/feed" 
          className={`flex flex-col items-center gap-1 transition-all ${
            isActive('/feed') 
              ? 'scale-110' 
              : 'hover:opacity-80'
          }`}
          style={{ 
            color: isActive('/feed') ? currentTheme.accentColor : currentTheme.textSecondary
          }}
        >
          <Home size={24} />
          <span className="text-xs font-semibold">Feed</span>
        </Link>
        <Link 
          href="/discover" 
          className={`flex flex-col items-center gap-1 transition-all ${
            isActive('/discover') 
              ? 'scale-110' 
              : 'hover:opacity-80'
          }`}
          style={{ 
            color: isActive('/discover') ? currentTheme.accentColor : currentTheme.textSecondary
          }}
        >
          <Heart size={24} />
          <span className="text-xs font-semibold">Discover</span>
        </Link>
        <Link 
          href="/messages" 
          className={`flex flex-col items-center gap-1 transition-all ${
            isActive('/messages') 
              ? 'scale-110' 
              : 'hover:opacity-80'
          }`}
          style={{ 
            color: isActive('/messages') ? currentTheme.accentColor : currentTheme.textSecondary
          }}
        >
          <MessageCircle size={24} />
          <span className="text-xs font-semibold">Messages</span>
        </Link>
        <Link 
          href="/settings" 
          className={`flex flex-col items-center gap-1 transition-all ${
            isActive('/settings') 
              ? 'scale-110' 
              : 'hover:opacity-80'
          }`}
          style={{ 
            color: isActive('/settings') ? currentTheme.accentColor : currentTheme.textSecondary
          }}
        >
          <Settings size={24} />
          <span className="text-xs font-semibold">Settings</span>
        </Link>
      </div>
    </div>
  );
};

export default BottomNav;
