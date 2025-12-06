'use client';

import React, { useState } from 'react';
import { SetupForm } from '@/lib/types';
import { validateAge, validateBio } from '@/lib/utils';

interface ProfileSetupProps {
  onComplete: (formData: SetupForm) => void;
}

const ProfileSetup: React.FC<ProfileSetupProps> = ({ onComplete }) => {
  const [setupForm, setSetupForm] = useState<SetupForm>({
    name: '',
    age: '',
    gender: '',
    style: '',
    bio: ''
  });

  const handleSubmit = () => {
    if (!setupForm.name || !setupForm.age || !setupForm.gender || !setupForm.style || !setupForm.bio) {
      alert('Please fill in all fields!');
      return;
    }

    if (!validateAge(setupForm.age)) {
      alert('Please enter a valid age (18-100)');
      return;
    }

    if (!validateBio(setupForm.bio)) {
      alert('Bio must be between 10 and 500 characters');
      return;
    }

    onComplete(setupForm);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 via-purple-100 to-blue-100 p-4 flex items-center justify-center">
      <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-md w-full">
        <h1 className="text-4xl font-bold text-center mb-2 bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent">
          CharacterMatch
        </h1>
        <p className="text-center text-gray-600 mb-6">Find your perfect match through characters!</p>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold mb-2 text-gray-700">Name</label>
            <input 
              value={setupForm.name}
              onChange={(e) => setSetupForm({...setupForm, name: e.target.value})}
              className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-purple-400 focus:outline-none" 
              placeholder="Your name" 
            />
          </div>
          
          <div>
            <label className="block text-sm font-semibold mb-2 text-gray-700">Age</label>
            <input 
              type="number"
              value={setupForm.age}
              onChange={(e) => setSetupForm({...setupForm, age: e.target.value})}
              className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-purple-400 focus:outline-none" 
              placeholder="25" 
            />
          </div>
          
          <div>
            <label className="block text-sm font-semibold mb-2 text-gray-700">Gender</label>
            <select 
              value={setupForm.gender}
              onChange={(e) => setSetupForm({...setupForm, gender: e.target.value})}
              className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-purple-400 focus:outline-none"
            >
              <option value="">Select...</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Non-binary">Non-binary</option>
              <option value="Other">Other</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-semibold mb-2 text-gray-700">Style Preference</label>
            <select 
              value={setupForm.style}
              onChange={(e) => setSetupForm({...setupForm, style: e.target.value})}
              className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-purple-400 focus:outline-none"
            >
              <option value="">Select your vibe...</option>
              <option value="cute">Cute & Cuddly 🐱</option>
              <option value="cool">Cool & Bold 🦁</option>
              <option value="fun">Fun & Quirky 🦄</option>
              <option value="mysterious">Mysterious & Deep 🦉</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-semibold mb-2 text-gray-700">Bio</label>
            <textarea 
              value={setupForm.bio}
              onChange={(e) => setSetupForm({...setupForm, bio: e.target.value})}
              className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-purple-400 focus:outline-none" 
              rows={3}
              placeholder="Tell us about yourself..."
            ></textarea>
          </div>
          
          <button 
            onClick={handleSubmit}
            className="w-full bg-gradient-to-r from-pink-500 to-purple-500 text-white font-bold py-3 rounded-xl hover:shadow-lg transform hover:scale-105 transition"
          >
            Create Profile ✨
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfileSetup;
