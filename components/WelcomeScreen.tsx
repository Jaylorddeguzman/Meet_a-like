'use client';

import React, { useState } from 'react';
import { Heart, Sparkles, MessageCircle, Users, ArrowRight, X } from 'lucide-react';

interface WelcomeScreenProps {
  onComplete: () => void;
}

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onComplete }) => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      icon: Heart,
      title: "Welcome to CharacterMatch! 💕",
      description: "Where personality meets connection through unique character avatars",
      color: "from-pink-500 to-rose-500",
      bgGradient: "from-pink-50 to-rose-50"
    },
    {
      icon: Sparkles,
      title: "AI-Powered Profiles ✨",
      description: "Create your unique character with AI-generated personalities, bios, and interests tailored just for you",
      color: "from-purple-500 to-indigo-500",
      bgGradient: "from-purple-50 to-indigo-50"
    },
    {
      icon: Users,
      title: "Smart Matching 🎯",
      description: "Our algorithm finds compatible matches based on interests, traits, and personality styles",
      color: "from-blue-500 to-cyan-500",
      bgGradient: "from-blue-50 to-cyan-50"
    },
    {
      icon: MessageCircle,
      title: "Connect & Chat 💬",
      description: "Swipe through profiles, match with people you like, and start meaningful conversations",
      color: "from-green-500 to-emerald-500",
      bgGradient: "from-green-50 to-emerald-50"
    }
  ];

  const handleNext = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(currentSlide + 1);
    } else {
      onComplete();
    }
  };

  const handleSkip = () => {
    onComplete();
  };

  const currentSlideData = slides[currentSlide];
  const Icon = currentSlideData.icon;

  return (
    <div className={`min-h-screen bg-gradient-to-br ${currentSlideData.bgGradient} flex items-center justify-center p-4 transition-all duration-500`}>
      <div className="max-w-md w-full">
        {/* Skip Button */}
        <div className="flex justify-end mb-4">
          <button
            onClick={handleSkip}
            className="flex items-center gap-1 text-gray-600 hover:text-gray-800 font-semibold transition"
          >
            Skip <X size={18} />
          </button>
        </div>

        {/* Main Card */}
        <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl p-8 space-y-6 transform transition-all duration-500 animate-slideIn">
          {/* Icon */}
          <div className="flex justify-center">
            <div className={`bg-gradient-to-r ${currentSlideData.color} p-6 rounded-full shadow-lg animate-bounce-slow`}>
              <Icon className="w-16 h-16 text-white" strokeWidth={2} />
            </div>
          </div>

          {/* Title */}
          <h1 className={`text-3xl font-bold text-center bg-gradient-to-r ${currentSlideData.color} bg-clip-text text-transparent`}>
            {currentSlideData.title}
          </h1>

          {/* Description */}
          <p className="text-gray-700 text-center text-lg leading-relaxed">
            {currentSlideData.description}
          </p>

          {/* Progress Dots */}
          <div className="flex justify-center gap-2 pt-4">
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`h-2 rounded-full transition-all duration-300 ${
                  index === currentSlide 
                    ? `w-8 bg-gradient-to-r ${currentSlideData.color}` 
                    : 'w-2 bg-gray-300 hover:bg-gray-400'
                }`}
              />
            ))}
          </div>

          {/* Navigation Button */}
          <button
            onClick={handleNext}
            className={`w-full bg-gradient-to-r ${currentSlideData.color} text-white font-bold py-4 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center gap-2 group`}
          >
            {currentSlide < slides.length - 1 ? (
              <>
                Next
                <ArrowRight className="group-hover:translate-x-1 transition-transform" size={20} />
              </>
            ) : (
              <>
                Get Started
                <Heart className="group-hover:scale-110 transition-transform" size={20} fill="white" />
              </>
            )}
          </button>
        </div>

        {/* Fun Facts at Bottom */}
        <div className="mt-6 text-center text-sm text-gray-600">
          {currentSlide === 0 && "🎨 Choose from 4 unique personality styles"}
          {currentSlide === 1 && "🤖 AI generates unique bios and interests"}
          {currentSlide === 2 && "💯 Get compatibility scores with each match"}
          {currentSlide === 3 && "🚀 Start your journey to finding your match!"}
        </div>
      </div>

      <style jsx>{`
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes bounce-slow {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-10px);
          }
        }

        .animate-slideIn {
          animation: slideIn 0.5s ease-out;
        }

        .animate-bounce-slow {
          animation: bounce-slow 3s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default WelcomeScreen;
