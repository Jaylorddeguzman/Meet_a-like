'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface Theme {
  id: string;
  name: string;
  emoji: string;
  background: string;
  backgroundAnimation: string;
  cardBg: string;
  cardBorder: string;
  textPrimary: string;
  textSecondary: string;
  accentColor: string;
  glowColor: string;
  gradient: string;
}

export const themes: Theme[] = [
  {
    id: 'modern',
    name: 'Modern Clean',
    emoji: '✨',
    // Lighter, friendlier dating-app palette
    background: 'linear-gradient(135deg, #f8fafc 0%, #eef2ff 50%, #e6f0ff 100%)',
    backgroundAnimation: 'none',
    cardBg: 'rgba(255, 255, 255, 0.92)',
    cardBorder: 'rgba(15, 23, 42, 0.06)',
    textPrimary: '#0f172a',
    textSecondary: 'rgba(15, 23, 42, 0.7)',
    accentColor: '#ff6b6b',
    glowColor: 'rgba(255,107,107,0.12)',
    gradient: 'linear-gradient(90deg, #ff6b6b, #ff9aa2)',
  },
  {
    id: 'sunset',
    name: 'Sunset Vibes',
    emoji: '🌅',
    background: 'linear-gradient(135deg, #ff6b6b 0%, #ee5a6f 20%, #c06c84 40%, #6c5b7b 60%, #355c7d 80%, #2a4858 100%)',
    backgroundAnimation: 'neon-bg-shift 15s ease infinite',
    cardBg: 'rgba(26, 18, 26, 0.95)',
    cardBorder: 'rgba(255, 107, 107, 0.4)',
    textPrimary: '#ffffff',
    textSecondary: 'rgba(255, 214, 214, 0.95)',
    accentColor: '#ff8080',
    glowColor: 'rgba(255, 107, 107, 0.4)',
    gradient: 'linear-gradient(90deg, #ff6b6b, #ee5a6f, #ffa07a, #ff6b6b)',
  },
  {
    id: 'ocean',
    name: 'Ocean Dream',
    emoji: '🌊',
    background: 'linear-gradient(135deg, #1e3a8a 0%, #2563eb 20%, #3b82f6 40%, #0ea5e9 60%, #06b6d4 80%, #1e3a8a 100%)',
    backgroundAnimation: 'neon-bg-shift 15s ease infinite',
    cardBg: 'rgba(15, 23, 42, 0.95)',
    cardBorder: 'rgba(59, 130, 246, 0.5)',
    textPrimary: '#ffffff',
    textSecondary: 'rgba(191, 219, 254, 0.95)',
    accentColor: '#60a5fa',
    glowColor: 'rgba(59, 130, 246, 0.4)',
    gradient: 'linear-gradient(90deg, #3b82f6, #60a5fa, #06b6d4, #3b82f6)',
  },
  {
    id: 'cyberpunk',
    name: 'Cyberpunk',
    emoji: '🤖',
    background: 'linear-gradient(135deg, #1a0a2e 0%, #16213e 20%, #0f3460 40%, #1a1a2e 60%, #2d0a3f 80%, #1a0a2e 100%)',
    backgroundAnimation: 'neon-bg-shift 15s ease infinite',
    cardBg: 'rgba(15, 15, 30, 0.97)',
    cardBorder: 'rgba(0, 191, 255, 0.5)',
    textPrimary: '#ffffff',
    textSecondary: 'rgba(203, 213, 225, 0.95)',
    accentColor: '#00d4ff',
    glowColor: 'rgba(0, 191, 255, 0.4)',
    gradient: 'linear-gradient(90deg, #00bfff, #ff1493, #ff69b4, #00bfff)',
  },
  {
    id: 'forest',
    name: 'Forest Magic',
    emoji: '🌲',
    background: 'linear-gradient(135deg, #1a4d2e 0%, #245933 20%, #4f772d 40%, #2d5016 60%, #1b3a26 80%, #1a4d2e 100%)',
    backgroundAnimation: 'neon-bg-shift 15s ease infinite',
    cardBg: 'rgba(18, 30, 22, 0.95)',
    cardBorder: 'rgba(79, 119, 45, 0.5)',
    textPrimary: '#ffffff',
    textSecondary: 'rgba(220, 252, 231, 0.95)',
    accentColor: '#a7f3d0',
    glowColor: 'rgba(144, 238, 144, 0.4)',
    gradient: 'linear-gradient(90deg, #90ee90, #4f772d, #98fb98, #90ee90)',
  },
  {
    id: 'lavender',
    name: 'Lavender Dreams',
    emoji: '💜',
    background: 'linear-gradient(135deg, #7c3aed 0%, #a855f7 20%, #c084fc 40%, #9333ea 60%, #6b21a8 80%, #7c3aed 100%)',
    backgroundAnimation: 'neon-bg-shift 15s ease infinite',
    cardBg: 'rgba(24, 15, 35, 0.95)',
    cardBorder: 'rgba(192, 132, 252, 0.5)',
    textPrimary: '#ffffff',
    textSecondary: 'rgba(233, 213, 255, 0.95)',
    accentColor: '#d8b4fe',
    glowColor: 'rgba(192, 132, 252, 0.4)',
    gradient: 'linear-gradient(90deg, #7c3aed, #c084fc, #d8b4fe, #7c3aed)',
  },
  {
    id: 'candy',
    name: 'Candy Pop',
    emoji: '🍭',
    background: 'linear-gradient(135deg, #ff0080 0%, #ff77e9 20%, #ffc0ff 40%, #ff6ec7 60%, #ff0080 80%, #ff77e9 100%)',
    backgroundAnimation: 'neon-bg-shift 12s ease infinite',
    cardBg: 'rgba(30, 12, 24, 0.95)',
    cardBorder: 'rgba(255, 119, 233, 0.5)',
    textPrimary: '#ffffff',
    textSecondary: 'rgba(255, 192, 255, 0.95)',
    accentColor: '#ff77e9',
    glowColor: 'rgba(255, 0, 128, 0.5)',
    gradient: 'linear-gradient(90deg, #ff0080, #ff77e9, #ffc0ff, #ff0080)',
  },
  {
    id: 'midnight',
    name: 'Midnight Sky',
    emoji: '🌙',
    background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 20%, #334155 40%, #1e293b 60%, #0f172a 80%, #0f172a 100%)',
    backgroundAnimation: 'neon-bg-shift 18s ease infinite',
    cardBg: 'rgba(15, 23, 42, 0.97)',
    cardBorder: 'rgba(148, 163, 184, 0.4)',
    textPrimary: '#f8fafc',
    textSecondary: 'rgba(226, 232, 240, 0.95)',
    accentColor: '#cbd5e1',
    glowColor: 'rgba(148, 163, 184, 0.3)',
    gradient: 'linear-gradient(90deg, #94a3b8, #cbd5e1, #e2e8f0, #94a3b8)',
  },
  {
    id: 'fire',
    name: 'Fire & Ice',
    emoji: '🔥',
    background: 'linear-gradient(135deg, #dc2626 0%, #ea580c 20%, #f59e0b 40%, #06b6d4 60%, #0284c7 80%, #dc2626 100%)',
    backgroundAnimation: 'neon-bg-shift 10s ease infinite',
    cardBg: 'rgba(25, 15, 18, 0.95)',
    cardBorder: 'rgba(251, 146, 60, 0.5)',
    textPrimary: '#ffffff',
    textSecondary: 'rgba(254, 215, 170, 0.95)',
    accentColor: '#fb923c',
    glowColor: 'rgba(249, 115, 22, 0.5)',
    gradient: 'linear-gradient(90deg, #f59e0b, #fb923c, #06b6d4, #f59e0b)',
  },
  {
    id: 'aurora',
    name: 'Aurora Borealis',
    emoji: '✨',
    background: 'linear-gradient(135deg, #10b981 0%, #14b8a6 20%, #06b6d4 40%, #3b82f6 60%, #8b5cf6 80%, #10b981 100%)',
    backgroundAnimation: 'neon-bg-shift 20s ease infinite',
    cardBg: 'rgba(12, 24, 28, 0.95)',
    cardBorder: 'rgba(20, 184, 166, 0.5)',
    textPrimary: '#ffffff',
    textSecondary: 'rgba(209, 250, 229, 0.95)',
    accentColor: '#5eead4',
    glowColor: 'rgba(20, 184, 166, 0.4)',
    gradient: 'linear-gradient(90deg, #10b981, #06b6d4, #8b5cf6, #10b981)',
  },
  {
    id: 'rose',
    name: 'Rose Garden',
    emoji: '🌹',
    background: 'linear-gradient(135deg, #9f1239 0%, #be123c 20%, #e11d48 40%, #f43f5e 60%, #fb7185 80%, #9f1239 100%)',
    backgroundAnimation: 'neon-bg-shift 14s ease infinite',
    cardBg: 'rgba(25, 12, 18, 0.95)',
    cardBorder: 'rgba(244, 63, 94, 0.5)',
    textPrimary: '#ffffff',
    textSecondary: 'rgba(254, 205, 211, 0.95)',
    accentColor: '#fb7185',
    glowColor: 'rgba(244, 63, 94, 0.4)',
    gradient: 'linear-gradient(90deg, #e11d48, #f43f5e, #fb7185, #e11d48)',
  },
];

interface ThemeContextType {
  currentTheme: Theme;
  setTheme: (themeId: string) => void;
  themes: Theme[];
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [currentTheme, setCurrentTheme] = useState<Theme>(
    themes.find((t) => t.id === 'modern') || themes[0]
  );

  useEffect(() => {
    // Force the lighter 'modern' theme to ensure the app appears bright
    // (overrides any previously saved dark theme)
    const forced = themes.find(t => t.id === 'modern');
    if (forced) {
      setCurrentTheme(forced);
      localStorage.setItem('selectedTheme', 'modern');
    }
  }, []);

  const setTheme = (themeId: string) => {
    const theme = themes.find(t => t.id === themeId);
    if (theme) {
      setCurrentTheme(theme);
      localStorage.setItem('selectedTheme', themeId);
    }
  };

  return (
    <ThemeContext.Provider value={{ currentTheme, setTheme, themes }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
