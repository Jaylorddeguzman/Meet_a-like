import { Character } from './types';
import { characterSets } from './data';

export function assignCharacter(style: string): Character {
  const characters = characterSets[style] || characterSets.cute;
  return characters[Math.floor(Math.random() * characters.length)];
}

export function getCharacterSizeClasses(size: 'sm' | 'md' | 'lg' | 'xl'): string {
  const sizes = {
    sm: 'w-12 h-12 text-2xl',
    md: 'w-20 h-20 text-4xl',
    lg: 'w-32 h-32 text-6xl',
    xl: 'w-48 h-48 text-8xl'
  };
  return sizes[size];
}

export function formatTimeAgo(date: Date): string {
  const now = new Date();
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  
  if (seconds < 60) return 'just now';
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  return `${Math.floor(seconds / 86400)}d ago`;
}

export function validateAge(age: string): boolean {
  const ageNum = parseInt(age);
  return !isNaN(ageNum) && ageNum >= 18 && ageNum <= 100;
}

export function validateBio(bio: string): boolean {
  return bio.trim().length >= 10 && bio.trim().length <= 500;
}
