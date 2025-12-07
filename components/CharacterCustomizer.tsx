'use client';

import React, { useState, useEffect } from 'react';
import { Palette, Sparkles, Heart, Star, Smile, RefreshCw, Save, X } from 'lucide-react';
import CharacterAvatar from './CharacterAvatar';
import { Character, CharacterCustomization } from '@/lib/types';

interface CharacterCustomizerProps {
  initialCharacter: Character;
  initialCustomization?: CharacterCustomization;
  onSave: (character: Character, customization: CharacterCustomization) => void;
  onClose?: () => void;
}

const CharacterCustomizer: React.FC<CharacterCustomizerProps> = ({
  initialCharacter,
  initialCustomization,
  onSave,
  onClose
}) => {
  const [character, setCharacter] = useState<Character>(initialCharacter);
  const [customization, setCustomization] = useState<CharacterCustomization>(
    initialCustomization || {
      backgroundColor: '#FFB6D9',
      pattern: 'gradient',
      accessories: [],
      mood: 'happy'
    }
  );

  // Character emojis grouped by category
  const characterCategories = {
    people: ['😊', '🥰', '😎', '🤗', '😇', '🥳', '😏', '🤓', '🧐', '🥸', '🤠', '👑'],
    animals: ['🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼', '🐨', '🐯', '🦁', '🐮'],
    fantasy: ['🦄', '🐉', '🧚', '🧜', '🧙', '🧛', '🧞', '🦸', '🦹', '👼', '💫', '✨'],
    nature: ['🌸', '🌺', '🌻', '🌹', '🌷', '🌼', '🍀', '🌿', '🍃', '🌈', '⭐', '💎']
  };

  const gradients = [
    { name: 'Pink Dream', value: 'linear-gradient(135deg, #FFB6D9 0%, #D896FF 100%)' },
    { name: 'Ocean Blue', value: 'linear-gradient(135deg, #A8E6FF 0%, #6B9FFF 100%)' },
    { name: 'Sunset', value: 'linear-gradient(135deg, #FFD3A5 0%, #FD6585 100%)' },
    { name: 'Forest', value: 'linear-gradient(135deg, #A8E6CF 0%, #56AB91 100%)' },
    { name: 'Purple Haze', value: 'linear-gradient(135deg, #E6B3FF 0%, #9D84FF 100%)' },
    { name: 'Mint Fresh', value: 'linear-gradient(135deg, #C2FFD9 0%, #7FFFD4 100%)' },
    { name: 'Peachy', value: 'linear-gradient(135deg, #FFDAB9 0%, #FFB6C1 100%)' },
    { name: 'Lavender', value: 'linear-gradient(135deg, #E6E6FA 0%, #DDA0DD 100%)' }
  ];

  const solidColors = [
    '#FFB6D9', '#A8E6FF', '#FFD3A5', '#A8E6CF', 
    '#E6B3FF', '#FFE4B5', '#FFB3BA', '#BAE1FF',
    '#C2FFD9', '#FFC8F0', '#D4A5A5', '#B5EAD7'
  ];

  const patterns = [
    { name: 'Solid', value: 'solid' as const, icon: '⬛' },
    { name: 'Gradient', value: 'gradient' as const, icon: '🌈' },
    { name: 'Sparkles', value: 'sparkles' as const, icon: '✨' },
    { name: 'Hearts', value: 'hearts' as const, icon: '💕' }
  ];

  const accessories = [
    { id: 'crown', emoji: '👑', name: 'Crown' },
    { id: 'glasses', emoji: '👓', name: 'Glasses' },
    { id: 'hat', emoji: '🎩', name: 'Top Hat' },
    { id: 'bow', emoji: '🎀', name: 'Bow' },
    { id: 'flower', emoji: '🌸', name: 'Flower' },
    { id: 'star', emoji: '⭐', name: 'Star' },
    { id: 'heart', emoji: '💖', name: 'Heart' },
    { id: 'sparkle', emoji: '✨', name: 'Sparkle' }
  ];

  const moods = [
    { value: 'happy' as const, emoji: '😊', name: 'Happy' },
    { value: 'playful' as const, emoji: '😜', name: 'Playful' },
    { value: 'chill' as const, emoji: '😎', name: 'Chill' },
    { value: 'romantic' as const, emoji: '🥰', name: 'Romantic' }
  ];

  const [activeCategory, setActiveCategory] = useState<keyof typeof characterCategories>('people');

  const handleCharacterSelect = (emoji: string) => {
    setCharacter({
      ...character,
      emoji
    });
  };

  const handleGradientSelect = (gradient: string) => {
    setCharacter({
      ...character,
      gradient
    });
    setCustomization({
      ...customization,
      backgroundColor: gradient
    });
  };

  const handleColorSelect = (color: string) => {
    setCustomization({
      ...customization,
      backgroundColor: color
    });
  };

  const handlePatternSelect = (pattern: CharacterCustomization['pattern']) => {
    setCustomization({
      ...customization,
      pattern
    });
  };

  const toggleAccessory = (accessoryId: string) => {
    const current = customization.accessories || [];
    if (current.includes(accessoryId)) {
      setCustomization({
        ...customization,
        accessories: current.filter(a => a !== accessoryId)
      });
    } else {
      setCustomization({
        ...customization,
        accessories: [...current, accessoryId]
      });
    }
  };

  const handleMoodSelect = (mood: CharacterCustomization['mood']) => {
    setCustomization({
      ...customization,
      mood
    });
  };

  const randomizeCharacter = () => {
    const allEmojis = Object.values(characterCategories).flat();
    const randomEmoji = allEmojis[Math.floor(Math.random() * allEmojis.length)];
    const randomGradient = gradients[Math.floor(Math.random() * gradients.length)];
    const randomPattern = patterns[Math.floor(Math.random() * patterns.length)];
    const randomMood = moods[Math.floor(Math.random() * moods.length)];

    setCharacter({
      emoji: randomEmoji,
      gradient: randomGradient.value
    });

    setCustomization({
      backgroundColor: randomGradient.value,
      pattern: randomPattern.value,
      mood: randomMood.value,
      accessories: []
    });
  };

  const handleSave = () => {
    onSave(character, customization);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-purple-500 to-pink-500 text-white p-6 rounded-t-3xl flex items-center justify-between z-10">
          <div>
            <h2 className="text-3xl font-bold">Customize Your Character</h2>
            <p className="text-purple-100 mt-1">Make your avatar unique and stand out!</p>
          </div>
          {onClose && (
            <button
              onClick={onClose}
              className="p-2 hover:bg-white hover:bg-opacity-20 rounded-full transition-colors"
            >
              <X size={24} />
            </button>
          )}
        </div>

        <div className="p-6">
          {/* Preview Section */}
          <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-8 mb-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4 text-center">Preview</h3>
            <div className="flex justify-center items-center">
              <div className="relative">
                <CharacterAvatar
                  character={character}
                  customization={customization}
                  size={120}
                />
                {/* Accessories overlay */}
                {customization.accessories && customization.accessories.length > 0 && (
                  <div className="absolute -top-4 -right-4 flex gap-1">
                    {customization.accessories.slice(0, 2).map(accId => {
                      const acc = accessories.find(a => a.id === accId);
                      return acc ? (
                        <span key={accId} className="text-2xl">{acc.emoji}</span>
                      ) : null;
                    })}
                  </div>
                )}
              </div>
            </div>
            <button
              onClick={randomizeCharacter}
              className="mt-4 w-full bg-white text-purple-600 py-3 rounded-xl font-semibold hover:shadow-lg transition-all flex items-center justify-center gap-2"
            >
              <RefreshCw size={20} />
              Randomize
            </button>
          </div>

          {/* Character Selection */}
          <div className="mb-6">
            <h3 className="text-xl font-bold text-gray-800 mb-3 flex items-center gap-2">
              <Smile size={24} className="text-purple-500" />
              Choose Character
            </h3>
            
            {/* Category Tabs */}
            <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
              {Object.keys(characterCategories).map(category => (
                <button
                  key={category}
                  onClick={() => setActiveCategory(category as keyof typeof characterCategories)}
                  className={`px-4 py-2 rounded-lg font-semibold whitespace-nowrap transition-colors ${
                    activeCategory === category
                      ? 'bg-purple-500 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </button>
              ))}
            </div>

            {/* Character Grid */}
            <div className="grid grid-cols-6 gap-3">
              {characterCategories[activeCategory].map(emoji => (
                <button
                  key={emoji}
                  onClick={() => handleCharacterSelect(emoji)}
                  className={`text-4xl p-4 rounded-xl hover:scale-110 transition-transform ${
                    character.emoji === emoji
                      ? 'bg-purple-100 ring-2 ring-purple-500'
                      : 'bg-gray-100 hover:bg-gray-200'
                  }`}
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>

          {/* Background Style */}
          <div className="mb-6">
            <h3 className="text-xl font-bold text-gray-800 mb-3 flex items-center gap-2">
              <Palette size={24} className="text-purple-500" />
              Background Style
            </h3>

            {/* Pattern Selection */}
            <div className="mb-4">
              <p className="text-sm font-semibold text-gray-600 mb-2">Pattern</p>
              <div className="grid grid-cols-4 gap-3">
                {patterns.map(pattern => (
                  <button
                    key={pattern.value}
                    onClick={() => handlePatternSelect(pattern.value)}
                    className={`p-4 rounded-xl font-semibold transition-all ${
                      customization.pattern === pattern.value
                        ? 'bg-purple-500 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    <div className="text-2xl mb-1">{pattern.icon}</div>
                    <div className="text-xs">{pattern.name}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Gradient Selection */}
            <div className="mb-4">
              <p className="text-sm font-semibold text-gray-600 mb-2">Gradients</p>
              <div className="grid grid-cols-4 gap-3">
                {gradients.map(gradient => (
                  <button
                    key={gradient.name}
                    onClick={() => handleGradientSelect(gradient.value)}
                    className={`h-16 rounded-xl transition-all ${
                      customization.backgroundColor === gradient.value
                        ? 'ring-4 ring-purple-500 scale-105'
                        : 'hover:scale-105'
                    }`}
                    style={{ background: gradient.value }}
                    title={gradient.name}
                  />
                ))}
              </div>
            </div>

            {/* Solid Colors */}
            <div>
              <p className="text-sm font-semibold text-gray-600 mb-2">Solid Colors</p>
              <div className="grid grid-cols-6 gap-3">
                {solidColors.map(color => (
                  <button
                    key={color}
                    onClick={() => handleColorSelect(color)}
                    className={`h-12 rounded-xl transition-all ${
                      customization.backgroundColor === color
                        ? 'ring-4 ring-purple-500 scale-105'
                        : 'hover:scale-105'
                    }`}
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Accessories */}
          <div className="mb-6">
            <h3 className="text-xl font-bold text-gray-800 mb-3 flex items-center gap-2">
              <Star size={24} className="text-purple-500" />
              Accessories
            </h3>
            <div className="grid grid-cols-4 gap-3">
              {accessories.map(accessory => (
                <button
                  key={accessory.id}
                  onClick={() => toggleAccessory(accessory.id)}
                  className={`p-4 rounded-xl transition-all ${
                    customization.accessories?.includes(accessory.id)
                      ? 'bg-purple-100 ring-2 ring-purple-500'
                      : 'bg-gray-100 hover:bg-gray-200'
                  }`}
                >
                  <div className="text-3xl mb-1">{accessory.emoji}</div>
                  <div className="text-xs font-semibold text-gray-700">{accessory.name}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Mood */}
          <div className="mb-6">
            <h3 className="text-xl font-bold text-gray-800 mb-3 flex items-center gap-2">
              <Heart size={24} className="text-purple-500" />
              Mood
            </h3>
            <div className="grid grid-cols-4 gap-3">
              {moods.map(mood => (
                <button
                  key={mood.value}
                  onClick={() => handleMoodSelect(mood.value)}
                  className={`p-4 rounded-xl transition-all ${
                    customization.mood === mood.value
                      ? 'bg-purple-500 text-white'
                      : 'bg-gray-100 hover:bg-gray-200'
                  }`}
                >
                  <div className="text-3xl mb-1">{mood.emoji}</div>
                  <div className="text-sm font-semibold">{mood.name}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Save Button */}
          <button
            onClick={handleSave}
            className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-4 rounded-xl font-bold hover:shadow-lg transition-all flex items-center justify-center gap-2"
          >
            <Save size={24} />
            Save Character
          </button>
        </div>
      </div>
    </div>
  );
};

export default CharacterCustomizer;
