import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import connectDB, { User as UserModel } from '@/lib/mongodb';
import { findBestMatches } from '@/lib/matching-algorithm';
import { User } from '@/lib/types';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession();
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '20');

    // Get current user
    const currentUser = await UserModel.findOne({ email: session.user.email });
    
    if (!currentUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Get all potential matches
    const allUsers = await UserModel.find({
      email: { $ne: session.user.email },
      profileCompleted: true
    }).lean();

    // Convert to User type
    const candidates: User[] = allUsers.map((user: any) => ({
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      age: user.age,
      gender: user.gender,
      style: user.style,
      character: user.character,
      characterCustomization: user.characterCustomization,
      bio: user.bio,
      interests: user.interests || [],
      traits: user.traits || [],
      lookingFor: user.lookingFor,
      location: user.location,
      height: user.height,
      education: user.education,
      occupation: user.occupation,
      smoking: user.smoking,
      drinking: user.drinking,
      relationshipGoal: user.relationshipGoal,
      personalityType: user.personalityType,
      loveLanguage: user.loveLanguage,
      zodiacSign: user.zodiacSign,
      preferences: user.preferences,
      isOnline: user.isOnline,
      lastActiveAt: user.lastActiveAt,
      isVerified: user.isVerified,
      isPremium: user.isPremium,
      isAIGenerated: user.isAIGenerated,
      profileCompleted: user.profileCompleted,
      profileCompleteness: user.profileCompleteness,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt
    }));

    const currentUserTyped: User = {
      id: currentUser._id.toString(),
      name: currentUser.name,
      email: currentUser.email,
      age: currentUser.age,
      gender: currentUser.gender,
      style: currentUser.style,
      character: currentUser.character,
      characterCustomization: currentUser.characterCustomization,
      bio: currentUser.bio,
      interests: currentUser.interests || [],
      traits: currentUser.traits || [],
      lookingFor: currentUser.lookingFor,
      location: currentUser.location,
      height: currentUser.height,
      education: currentUser.education,
      occupation: currentUser.occupation,
      smoking: currentUser.smoking,
      drinking: currentUser.drinking,
      relationshipGoal: currentUser.relationshipGoal,
      personalityType: currentUser.personalityType,
      loveLanguage: currentUser.loveLanguage,
      zodiacSign: currentUser.zodiacSign,
      preferences: currentUser.preferences,
      isOnline: currentUser.isOnline,
      lastActiveAt: currentUser.lastActiveAt,
      isVerified: currentUser.isVerified,
      isPremium: currentUser.isPremium,
      isAIGenerated: currentUser.isAIGenerated,
      profileCompleted: currentUser.profileCompleted,
      profileCompleteness: currentUser.profileCompleteness,
      createdAt: currentUser.createdAt,
      updatedAt: currentUser.updatedAt
    };

    // Find best matches using the algorithm
    const matches = findBestMatches(currentUserTyped, candidates, limit);

    // Get full user data for top matches
    const topMatches = matches.map(match => {
      const user = candidates.find(u => u.id === match.userId);
      return {
        user,
        matchScore: match.score,
        matchBreakdown: match.breakdown,
        reasons: match.reasons
      };
    });

    return NextResponse.json({
      matches: topMatches,
      total: matches.length
    });
  } catch (error) {
    console.error('Error discovering matches:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
