import React from 'react';
import { Character, CharacterSize, CharacterCustomization } from '@/lib/types';
import { getCharacterSizeClasses } from '@/lib/utils';

interface CharacterAvatarProps {
  character: Character;
  customization?: CharacterCustomization;
  size?: CharacterSize | number;
}

const CharacterAvatar: React.FC<CharacterAvatarProps> = ({ character, customization, size = 'md' }) => {
  const sizeClasses = typeof size === 'number' ? '' : getCharacterSizeClasses(size);
  const sizeStyle = typeof size === 'number' ? { width: `${size}px`, height: `${size}px`, fontSize: `${size * 0.6}px` } : {};
  
  const background = customization?.backgroundColor || character.gradient;
  const bgStyle = background.includes('gradient') ? { background } : { backgroundColor: background };

  return (
    <div 
      className={`${sizeClasses} rounded-full flex items-center justify-center shadow-lg`}
      style={{ ...bgStyle, ...sizeStyle }}
    >
      <span>{character.emoji}</span>
    </div>
  );
};

export default CharacterAvatar;
