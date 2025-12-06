import React from 'react';
import { Character, CharacterSize } from '@/lib/types';
import { getCharacterSizeClasses } from '@/lib/utils';

interface CharacterAvatarProps {
  character: Character;
  size?: CharacterSize;
}

const CharacterAvatar: React.FC<CharacterAvatarProps> = ({ character, size = 'md' }) => {
  const sizeClasses = getCharacterSizeClasses(size);

  return (
    <div className={`${sizeClasses} rounded-full bg-gradient-to-br ${character.gradient} flex items-center justify-center shadow-lg`}>
      <span>{character.emoji}</span>
    </div>
  );
};

export default CharacterAvatar;
