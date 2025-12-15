'use client';

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import {
  User,
  Shield,
  Bell,
  Heart,
  LogOut,
  ChevronRight,
  MapPin,
  Briefcase,
  GraduationCap,
  Cigarette,
  Wine,
  Lock,
  Eye,
  EyeOff,
  Trash2,
  Save,
  Palette,
  Sparkles
} from 'lucide-react';
import BottomNav from '@/components/BottomNav';
import { useTheme } from '@/contexts/ThemeContext';

type TabType = 'account' | 'privacy' | 'notifications' | 'preferences' | 'appearance';

const SettingsPage: React.FC = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { currentTheme, setTheme, themes } = useTheme();
  const [activeTab, setActiveTab] = useState<TabType>('appearance');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  // Account Settings
  const [name, setName] = useState('');
  const [bio, setBio] = useState('');
  const [age, setAge] = useState('');
  const [location, setLocation] = useState('');
  const [occupation, setOccupation] = useState('');
  const [education, setEducation] = useState('');

  // Privacy Settings
  const [profileVisibility, setProfileVisibility] = useState('public');
  const [showOnline, setShowOnline] = useState(true);
  const [showDistance, setShowDistance] = useState(true);
  const [allowMessages, setAllowMessages] = useState('everyone');

  // Notification Settings
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(true);
  const [matchNotifications, setMatchNotifications] = useState(true);
  const [messageNotifications, setMessageNotifications] = useState(true);
  const [likeNotifications, setLikeNotifications] = useState(true);

  // Preference Settings
  const [ageMin, setAgeMin] = useState(18);
  const [ageMax, setAgeMax] = useState(50);
  const [maxDistance, setMaxDistance] = useState(50);
  const [showMeGender, setShowMeGender] = useState<string[]>(['female']);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/');
    } else if (status === 'authenticated') {
      fetchUserSettings();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status]); // Only run when auth status changes, not on every session object change

  const fetchUserSettings = async () => {
    try {
      const response = await fetch('/api/settings');
      if (response.ok) {
        const data = await response.json();
        // Populate form fields with existing data
        setName(data.name || '');
        setBio(data.bio || '');
        setAge(data.age?.toString() || '');
        setLocation(data.location?.city || '');
        setOccupation(data.occupation || '');
        setEducation(data.education || '');
        
        // Privacy settings
        setProfileVisibility(data.privacy?.profileVisibility || 'public');
        setShowOnline(data.privacy?.showOnline ?? true);
        setShowDistance(data.privacy?.showDistance ?? true);
        setAllowMessages(data.privacy?.allowMessages || 'everyone');
        
        // Notification settings
        setEmailNotifications(data.notifications?.email ?? true);
        setPushNotifications(data.notifications?.push ?? true);
        setMatchNotifications(data.notifications?.matches ?? true);
        setMessageNotifications(data.notifications?.messages ?? true);
        setLikeNotifications(data.notifications?.likes ?? true);
        
        // Preferences
        if (data.preferences) {
          setAgeMin(data.preferences.ageRange?.min || 18);
          setAgeMax(data.preferences.ageRange?.max || 50);
          setMaxDistance(data.preferences.maxDistance || 50);
          setShowMeGender(data.preferences.showMeGender || ['female']);
        }
      }
    } catch (error) {
      console.error('Error fetching settings:', error);
    }
  };

  const saveSettings = async () => {
    setLoading(true);
    setMessage('');

    try {
      const settingsData: any = {};

      if (activeTab === 'appearance') {
        // Theme is already saved to localStorage, no API call needed
        setMessage('Theme saved successfully!');
        setTimeout(() => setMessage(''), 3000);
        setLoading(false);
        return;
      } else if (activeTab === 'account') {
        settingsData.name = name;
        settingsData.bio = bio;
        settingsData.age = parseInt(age);
        settingsData.location = { city: location };
        settingsData.occupation = occupation;
        settingsData.education = education;
      } else if (activeTab === 'privacy') {
        settingsData.privacy = {
          profileVisibility,
          showOnline,
          showDistance,
          allowMessages
        };
      } else if (activeTab === 'notifications') {
        settingsData.notifications = {
          email: emailNotifications,
          push: pushNotifications,
          matches: matchNotifications,
          messages: messageNotifications,
          likes: likeNotifications
        };
      } else if (activeTab === 'preferences') {
        settingsData.preferences = {
          ageRange: { min: ageMin, max: ageMax },
          maxDistance,
          showMeGender
        };
      }

      const response = await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settingsData)
      });

      if (response.ok) {
        setMessage('Settings saved successfully!');
        setTimeout(() => setMessage(''), 3000);
      } else {
        setMessage('Failed to save settings');
      }
    } catch (error) {
      console.error('Error saving settings:', error);
      setMessage('Error saving settings');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      try {
        const response = await fetch('/api/settings', {
          method: 'DELETE'
        });

        if (response.ok) {
          router.push('/');
        } else {
          setMessage('Failed to delete account');
        }
      } catch (error) {
        console.error('Error deleting account:', error);
        setMessage('Error deleting account');
      }
    }
  };

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-100 via-purple-100 to-blue-100 flex items-center justify-center">
        <div className="text-xl font-semibold text-purple-600">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-20 transition-all duration-500" style={{
      background: currentTheme.background,
      backgroundSize: '400% 400%',
      animation: currentTheme.backgroundAnimation,
    }}>
      <div className="max-w-4xl mx-auto p-4">
        {/* Header */}
        <div className="backdrop-blur-xl rounded-2xl shadow-lg p-6 mb-4" style={{
          background: currentTheme.cardBg,
          border: `1px solid ${currentTheme.cardBorder}`,
        }}>
          <h1 className="text-3xl font-bold" style={{ color: currentTheme.textPrimary }}>Settings</h1>
          <p className="mt-1" style={{ color: currentTheme.textSecondary }}>Manage your account and preferences</p>
        </div>

        {/* Tab Navigation */}
        <div className="backdrop-blur-xl rounded-2xl shadow-lg mb-4 overflow-x-auto" style={{
          background: currentTheme.cardBg,
          border: `1px solid ${currentTheme.cardBorder}`,
        }}>
          <div className="flex border-b" style={{ borderColor: currentTheme.cardBorder }}>
            <button
              onClick={() => setActiveTab('appearance')}
              className={`flex-1 py-4 px-6 font-semibold transition-colors whitespace-nowrap ${
                activeTab === 'appearance' ? 'border-b-2' : ''
              }`}
              style={{
                color: activeTab === 'appearance' ? currentTheme.accentColor : currentTheme.textSecondary,
                borderColor: activeTab === 'appearance' ? currentTheme.accentColor : 'transparent'
              }}
            >
              <Palette className="inline mr-2" size={20} />
              Appearance
            </button>
            <button
              onClick={() => setActiveTab('account')}
              className={`flex-1 py-4 px-6 font-semibold transition-colors whitespace-nowrap ${
                activeTab === 'account' ? 'border-b-2' : ''
              }`}
              style={{
                color: activeTab === 'account' ? currentTheme.accentColor : currentTheme.textSecondary,
                borderColor: activeTab === 'account' ? currentTheme.accentColor : 'transparent'
              }}
            >
              <User className="inline mr-2" size={20} />
              Account
            </button>
            <button
              onClick={() => setActiveTab('privacy')}
              className={`flex-1 py-4 px-6 font-semibold transition-colors whitespace-nowrap ${
                activeTab === 'privacy' ? 'border-b-2' : ''
              }`}
              style={{
                color: activeTab === 'privacy' ? currentTheme.accentColor : currentTheme.textSecondary,
                borderColor: activeTab === 'privacy' ? currentTheme.accentColor : 'transparent'
              }}
            >
              <Shield className="inline mr-2" size={20} />
              Privacy
            </button>
            <button
              onClick={() => setActiveTab('notifications')}
              className={`flex-1 py-4 px-6 font-semibold transition-colors whitespace-nowrap ${
                activeTab === 'notifications' ? 'border-b-2' : ''
              }`}
              style={{
                color: activeTab === 'notifications' ? currentTheme.accentColor : currentTheme.textSecondary,
                borderColor: activeTab === 'notifications' ? currentTheme.accentColor : 'transparent'
              }}
            >
              <Bell className="inline mr-2" size={20} />
              Notifications
            </button>
            <button
              onClick={() => setActiveTab('preferences')}
              className={`flex-1 py-4 px-6 font-semibold transition-colors whitespace-nowrap ${
                activeTab === 'preferences' ? 'border-b-2' : ''
              }`}
              style={{
                color: activeTab === 'preferences' ? currentTheme.accentColor : currentTheme.textSecondary,
                borderColor: activeTab === 'preferences' ? currentTheme.accentColor : 'transparent'
              }}
            >
              <Heart className="inline mr-2" size={20} />
              Preferences
            </button>
          </div>
        </div>

        {/* Tab Content */}
        <div className="backdrop-blur-xl rounded-2xl shadow-lg p-6 mb-4" style={{
          background: currentTheme.cardBg,
          border: `1px solid ${currentTheme.cardBorder}`,
        }}>
          {/* Appearance Tab */}
          {activeTab === 'appearance' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold mb-4" style={{ color: currentTheme.textPrimary }}>Choose Your Theme</h2>
              <p className="mb-6" style={{ color: currentTheme.textSecondary }}>
                Select a theme to personalize your experience. Each theme has unique colors and animations!
              </p>
              
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
                {themes.map((theme) => (
                  <button
                    key={theme.id}
                    onClick={() => setTheme(theme.id)}
                    className={`relative p-4 rounded-2xl transition-all duration-300 hover:scale-105 active:scale-95 ${
                      currentTheme.id === theme.id ? 'ring-4' : ''
                    }`}
                    style={{
                      background: theme.background,
                      backgroundSize: '400% 400%',
                      animation: theme.backgroundAnimation,
                      ringColor: currentTheme.id === theme.id ? theme.accentColor : 'transparent',
                      boxShadow: currentTheme.id === theme.id ? `0 0 30px ${theme.glowColor}` : 'none'
                    }}
                  >
                    {/* Theme Preview */}
                    <div className="aspect-square mb-2 rounded-xl flex items-center justify-center text-4xl" style={{
                      background: theme.cardBg,
                      border: `2px solid ${theme.cardBorder}`
                    }}>
                      {theme.emoji}
                    </div>
                    <div className="text-center">
                      <div className="font-bold text-sm mb-1" style={{ color: theme.textPrimary }}>
                        {theme.name}
                      </div>
                      {currentTheme.id === theme.id && (
                        <div className="text-xs font-semibold" style={{ 
                          color: theme.accentColor,
                          textShadow: `0 0 10px ${theme.glowColor}`
                        }}>
                          ✓ Active
                        </div>
                      )}
                    </div>
                  </button>
                ))}
              </div>

              <div className="mt-8 p-4 rounded-xl" style={{
                background: `${currentTheme.accentColor}22`,
                border: `1px solid ${currentTheme.accentColor}44`
              }}>
                <h3 className="font-bold mb-2 flex items-center gap-2" style={{ color: currentTheme.textPrimary }}>
                  <Sparkles className="w-5 h-5" style={{ color: currentTheme.accentColor }} />
                  Current Theme: {currentTheme.name}
                </h3>
                <p className="text-sm" style={{ color: currentTheme.textSecondary }}>
                  This theme features animated gradients with {currentTheme.name.toLowerCase()} colors. The background smoothly transitions through different shades, creating a dynamic and engaging experience.
                </p>
              </div>
            </div>
          )}

          {/* Account Tab */}
          {activeTab === 'account' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold mb-4" style={{ color: currentTheme.textPrimary }}>Account Information</h2>
              
              <div>
                <label className="block text-sm font-semibold mb-2" style={{ color: currentTheme.textPrimary }}>
                  Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-3 border-2 rounded-xl focus:outline-none"
                  style={{
                    background: `${currentTheme.cardBg}99`,
                    borderColor: currentTheme.cardBorder,
                    color: currentTheme.textPrimary
                  }}
                  placeholder="Your name"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2" style={{ color: currentTheme.textPrimary }}>
                  Bio
                </label>
                <textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  rows={4}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:outline-none"
                  placeholder="Tell us about yourself..."
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Age
                  </label>
                  <input
                    type="number"
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:outline-none"
                    placeholder="25"
                    min="18"
                    max="100"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    <MapPin className="inline mr-1" size={16} />
                    Location
                  </label>
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:outline-none"
                    placeholder="City, Country"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  <Briefcase className="inline mr-1" size={16} />
                  Occupation
                </label>
                <input
                  type="text"
                  value={occupation}
                  onChange={(e) => setOccupation(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:outline-none"
                  placeholder="Software Engineer"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  <GraduationCap className="inline mr-1" size={16} />
                  Education
                </label>
                <input
                  type="text"
                  value={education}
                  onChange={(e) => setEducation(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:outline-none"
                  placeholder="University Degree"
                />
              </div>
            </div>
          )}

          {/* Privacy Tab */}
          {activeTab === 'privacy' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Privacy Settings</h2>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Profile Visibility
                </label>
                <select
                  value={profileVisibility}
                  onChange={(e) => setProfileVisibility(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:outline-none"
                >
                  <option value="public">Public - Everyone can see your profile</option>
                  <option value="matches">Matches Only - Only your matches can see</option>
                  <option value="private">Private - Hidden from discovery</option>
                </select>
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                <div>
                  <div className="font-semibold text-gray-800">Show Online Status</div>
                  <div className="text-sm text-gray-600">Let others see when you're online</div>
                </div>
                <button
                  onClick={() => setShowOnline(!showOnline)}
                  className={`w-14 h-8 rounded-full transition-colors ${
                    showOnline ? 'bg-purple-500' : 'bg-gray-300'
                  }`}
                >
                  <div
                    className={`w-6 h-6 bg-white rounded-full shadow-md transform transition-transform ${
                      showOnline ? 'translate-x-7' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                <div>
                  <div className="font-semibold text-gray-800">Show Distance</div>
                  <div className="text-sm text-gray-600">Display your distance to others</div>
                </div>
                <button
                  onClick={() => setShowDistance(!showDistance)}
                  className={`w-14 h-8 rounded-full transition-colors ${
                    showDistance ? 'bg-purple-500' : 'bg-gray-300'
                  }`}
                >
                  <div
                    className={`w-6 h-6 bg-white rounded-full shadow-md transform transition-transform ${
                      showDistance ? 'translate-x-7' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Who Can Message You
                </label>
                <select
                  value={allowMessages}
                  onChange={(e) => setAllowMessages(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:outline-none"
                >
                  <option value="everyone">Everyone</option>
                  <option value="matches">Matches Only</option>
                  <option value="none">No One</option>
                </select>
              </div>
            </div>
          )}

          {/* Notifications Tab */}
          {activeTab === 'notifications' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Notification Settings</h2>

              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                <div>
                  <div className="font-semibold text-gray-800">Email Notifications</div>
                  <div className="text-sm text-gray-600">Receive updates via email</div>
                </div>
                <button
                  onClick={() => setEmailNotifications(!emailNotifications)}
                  className={`w-14 h-8 rounded-full transition-colors ${
                    emailNotifications ? 'bg-purple-500' : 'bg-gray-300'
                  }`}
                >
                  <div
                    className={`w-6 h-6 bg-white rounded-full shadow-md transform transition-transform ${
                      emailNotifications ? 'translate-x-7' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                <div>
                  <div className="font-semibold text-gray-800">Push Notifications</div>
                  <div className="text-sm text-gray-600">Get push notifications on your device</div>
                </div>
                <button
                  onClick={() => setPushNotifications(!pushNotifications)}
                  className={`w-14 h-8 rounded-full transition-colors ${
                    pushNotifications ? 'bg-purple-500' : 'bg-gray-300'
                  }`}
                >
                  <div
                    className={`w-6 h-6 bg-white rounded-full shadow-md transform transition-transform ${
                      pushNotifications ? 'translate-x-7' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                <div>
                  <div className="font-semibold text-gray-800">New Matches</div>
                  <div className="text-sm text-gray-600">Get notified about new matches</div>
                </div>
                <button
                  onClick={() => setMatchNotifications(!matchNotifications)}
                  className={`w-14 h-8 rounded-full transition-colors ${
                    matchNotifications ? 'bg-purple-500' : 'bg-gray-300'
                  }`}
                >
                  <div
                    className={`w-6 h-6 bg-white rounded-full shadow-md transform transition-transform ${
                      matchNotifications ? 'translate-x-7' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                <div>
                  <div className="font-semibold text-gray-800">Messages</div>
                  <div className="text-sm text-gray-600">Get notified about new messages</div>
                </div>
                <button
                  onClick={() => setMessageNotifications(!messageNotifications)}
                  className={`w-14 h-8 rounded-full transition-colors ${
                    messageNotifications ? 'bg-purple-500' : 'bg-gray-300'
                  }`}
                >
                  <div
                    className={`w-6 h-6 bg-white rounded-full shadow-md transform transition-transform ${
                      messageNotifications ? 'translate-x-7' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                <div>
                  <div className="font-semibold text-gray-800">Likes</div>
                  <div className="text-sm text-gray-600">Get notified when someone likes you</div>
                </div>
                <button
                  onClick={() => setLikeNotifications(!likeNotifications)}
                  className={`w-14 h-8 rounded-full transition-colors ${
                    likeNotifications ? 'bg-purple-500' : 'bg-gray-300'
                  }`}
                >
                  <div
                    className={`w-6 h-6 bg-white rounded-full shadow-md transform transition-transform ${
                      likeNotifications ? 'translate-x-7' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
            </div>
          )}

          {/* Preferences Tab */}
          {activeTab === 'preferences' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Dating Preferences</h2>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Age Range: {ageMin} - {ageMax}
                </label>
                <div className="flex gap-4 items-center">
                  <input
                    type="range"
                    min="18"
                    max="100"
                    value={ageMin}
                    onChange={(e) => setAgeMin(parseInt(e.target.value))}
                    className="flex-1"
                  />
                  <input
                    type="range"
                    min="18"
                    max="100"
                    value={ageMax}
                    onChange={(e) => setAgeMax(parseInt(e.target.value))}
                    className="flex-1"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Maximum Distance: {maxDistance} km
                </label>
                <input
                  type="range"
                  min="1"
                  max="500"
                  value={maxDistance}
                  onChange={(e) => setMaxDistance(parseInt(e.target.value))}
                  className="w-full"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Show Me
                </label>
                <div className="space-y-2">
                  {['male', 'female', 'non-binary', 'everyone'].map((gender) => (
                    <label key={gender} className="flex items-center p-3 bg-gray-50 rounded-xl cursor-pointer hover:bg-gray-100">
                      <input
                        type="checkbox"
                        checked={showMeGender.includes(gender)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setShowMeGender([...showMeGender, gender]);
                          } else {
                            setShowMeGender(showMeGender.filter(g => g !== gender));
                          }
                        }}
                        className="w-5 h-5 text-purple-600 rounded"
                      />
                      <span className="ml-3 font-medium text-gray-800 capitalize">{gender}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Message Display */}
          {message && (
            <div className={`mt-4 p-4 rounded-xl ${
              message.includes('success') 
                ? 'bg-green-100 text-green-800' 
                : 'bg-red-100 text-red-800'
            }`}>
              {message}
            </div>
          )}

          {/* Save Button */}
          <button
            onClick={saveSettings}
            disabled={loading}
            className="w-full mt-6 bg-gradient-to-r from-purple-500 to-pink-500 text-white py-4 rounded-xl font-bold hover:shadow-lg transition-all disabled:opacity-50"
          >
            <Save className="inline mr-2" size={20} />
            {loading ? 'Saving...' : 'Save Changes'}
          </button>
        </div>

        {/* Danger Zone */}
        <div className="bg-white rounded-2xl shadow-lg p-6 border-2 border-red-200">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Danger Zone</h2>
          <button
            onClick={handleDeleteAccount}
            className="w-full bg-red-500 text-white py-4 rounded-xl font-bold hover:bg-red-600 transition-colors"
          >
            <Trash2 className="inline mr-2" size={20} />
            Delete Account
          </button>
        </div>
      </div>

      <BottomNav />
    </div>
  );
};

export default SettingsPage;
