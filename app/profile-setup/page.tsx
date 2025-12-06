'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { Sparkles, Loader2 } from 'lucide-react';
import { Gender, ProfileStyle } from '@/lib/types';

export default function ProfileSetupPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [generatingAI, setGeneratingAI] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    gender: '' as Gender,
    style: '' as ProfileStyle,
    generateAI: true,
  });

  const [aiProfile, setAiProfile] = useState<any>(null);

  const handleNext = () => {
    if (step === 1 && formData.name && formData.age) {
      setStep(2);
    } else if (step === 2 && formData.gender && formData.style) {
      if (formData.generateAI) {
        handleGenerateAIProfile();
      } else {
        setStep(3);
      }
    }
  };

  const handleGenerateAIProfile = async () => {
    setGeneratingAI(true);
    try {
      const response = await fetch('/api/profile/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const data = await response.json();
        setAiProfile(data);
        setStep(3);
      } else {
        console.error('Failed to generate AI profile');
      }
    } catch (error) {
      console.error('Error generating AI profile:', error);
    } finally {
      setGeneratingAI(false);
    }
  };

  const handleComplete = async () => {
    setLoading(true);
    try {
      const profileData = {
        name: formData.name,
        age: formData.age,
        gender: formData.gender,
        style: formData.style,
        ...aiProfile,
        isAIGenerated: formData.generateAI,
      };

      const response = await fetch('/api/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profileData),
      });

      if (response.ok) {
        router.push('/feed');
      } else {
        console.error('Failed to save profile');
      }
    } catch (error) {
      console.error('Error saving profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const styles: { value: ProfileStyle; label: string; emoji: string; description: string }[] = [
    { value: 'cute', label: 'Cute', emoji: '🥰', description: 'Sweet and adorable' },
    { value: 'cool', label: 'Cool', emoji: '😎', description: 'Confident and stylish' },
    { value: 'fun', label: 'Fun', emoji: '🎉', description: 'Energetic and adventurous' },
    { value: 'mysterious', label: 'Mysterious', emoji: '🌙', description: 'Intriguing and deep' },
  ];

  const genders: { value: Gender; label: string }[] = [
    { value: 'male', label: 'Male' },
    { value: 'female', label: 'Female' },
    { value: 'non-binary', label: 'Non-binary' },
    { value: 'other', label: 'Other' },
  ];

  if (generatingAI) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-100 via-purple-100 to-blue-100 flex items-center justify-center p-4">
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl p-12 text-center space-y-6 max-w-md">
          <Sparkles className="w-16 h-16 mx-auto text-purple-500 animate-pulse" />
          <h2 className="text-2xl font-bold text-gray-800">Creating Your Unique Profile</h2>
          <p className="text-gray-600">AI is generating your personality traits, bio, and interests...</p>
          <Loader2 className="w-8 h-8 mx-auto text-purple-500 animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 via-purple-100 to-blue-100 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl p-8 space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent">
            Set Up Your Profile
          </h1>
          <p className="text-gray-600">Welcome, {session?.user?.name}! Let's create your character.</p>
          <div className="flex justify-center gap-2 mt-4">
            <div className={`h-2 w-16 rounded-full ${step >= 1 ? 'bg-purple-500' : 'bg-gray-300'}`} />
            <div className={`h-2 w-16 rounded-full ${step >= 2 ? 'bg-purple-500' : 'bg-gray-300'}`} />
            <div className={`h-2 w-16 rounded-full ${step >= 3 ? 'bg-purple-500' : 'bg-gray-300'}`} />
          </div>
        </div>

        {/* Step 1: Basic Info */}
        {step === 1 && (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Display Name
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-purple-500 focus:outline-none transition-colors"
                placeholder="How should we call you?"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Age
              </label>
              <input
                type="number"
                value={formData.age}
                onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-purple-500 focus:outline-none transition-colors"
                placeholder="Your age"
                min="18"
                max="100"
              />
            </div>

            <button
              onClick={handleNext}
              disabled={!formData.name || !formData.age}
              className="w-full bg-gradient-to-r from-pink-500 to-purple-500 text-white font-semibold py-4 rounded-xl hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Continue
            </button>
          </div>
        )}

        {/* Step 2: Gender & Style */}
        {step === 2 && (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Gender
              </label>
              <div className="grid grid-cols-2 gap-3">
                {genders.map((g) => (
                  <button
                    key={g.value}
                    onClick={() => setFormData({ ...formData, gender: g.value })}
                    className={`p-4 rounded-xl border-2 transition-all ${
                      formData.gender === g.value
                        ? 'border-purple-500 bg-purple-50'
                        : 'border-gray-200 hover:border-purple-300'
                    }`}
                  >
                    <p className="font-semibold text-gray-800">{g.label}</p>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Choose Your Style
              </label>
              <div className="grid grid-cols-2 gap-3">
                {styles.map((s) => (
                  <button
                    key={s.value}
                    onClick={() => setFormData({ ...formData, style: s.value })}
                    className={`p-4 rounded-xl border-2 transition-all ${
                      formData.style === s.value
                        ? 'border-purple-500 bg-purple-50'
                        : 'border-gray-200 hover:border-purple-300'
                    }`}
                  >
                    <div className="text-3xl mb-2">{s.emoji}</div>
                    <p className="font-semibold text-gray-800">{s.label}</p>
                    <p className="text-xs text-gray-600">{s.description}</p>
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-3 p-4 bg-purple-50 rounded-xl">
              <input
                type="checkbox"
                checked={formData.generateAI}
                onChange={(e) => setFormData({ ...formData, generateAI: e.target.checked })}
                className="w-5 h-5 text-purple-500 rounded focus:ring-purple-500"
              />
              <div className="flex-1">
                <p className="font-semibold text-gray-800 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-purple-500" />
                  Generate AI Profile
                </p>
                <p className="text-xs text-gray-600">Let AI create unique traits and bio for you</p>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setStep(1)}
                className="flex-1 bg-gray-200 text-gray-700 font-semibold py-4 rounded-xl hover:bg-gray-300 transition-all"
              >
                Back
              </button>
              <button
                onClick={handleNext}
                disabled={!formData.gender || !formData.style}
                className="flex-1 bg-gradient-to-r from-pink-500 to-purple-500 text-white font-semibold py-4 rounded-xl hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {formData.generateAI ? 'Generate Profile' : 'Continue'}
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Review */}
        {step === 3 && aiProfile && (
          <div className="space-y-6">
            <div className="text-center">
              <div className={`inline-block bg-gradient-to-r ${aiProfile.character.gradient} p-6 rounded-full mb-4`}>
                <span className="text-6xl">{aiProfile.character.emoji}</span>
              </div>
              <h2 className="text-2xl font-bold text-gray-800">{formData.name}</h2>
              <p className="text-gray-600">{formData.age} • {formData.gender}</p>
            </div>

            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-gray-800 mb-2">Bio</h3>
                <p className="text-gray-700 bg-gray-50 p-4 rounded-xl">{aiProfile.bio}</p>
              </div>

              <div>
                <h3 className="font-semibold text-gray-800 mb-2">Personality Traits</h3>
                <div className="flex flex-wrap gap-2">
                  {aiProfile.traits.map((trait: string, i: number) => (
                    <span key={i} className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm">
                      {trait}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-gray-800 mb-2">Interests</h3>
                <div className="flex flex-wrap gap-2">
                  {aiProfile.interests.map((interest: string, i: number) => (
                    <span key={i} className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm">
                      {interest}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-gray-800 mb-2">Looking For</h3>
                <p className="text-gray-700 bg-gray-50 p-4 rounded-xl">{aiProfile.lookingFor}</p>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleGenerateAIProfile}
                className="flex-1 bg-gray-200 text-gray-700 font-semibold py-4 rounded-xl hover:bg-gray-300 transition-all flex items-center justify-center gap-2"
              >
                <Sparkles className="w-5 h-5" />
                Regenerate
              </button>
              <button
                onClick={handleComplete}
                disabled={loading}
                className="flex-1 bg-gradient-to-r from-pink-500 to-purple-500 text-white font-semibold py-4 rounded-xl hover:shadow-lg transition-all disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Complete'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
