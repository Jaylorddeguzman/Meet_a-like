import { NextResponse, NextRequest } from 'next/server';
import connectDB, { Match, User } from '@/lib/mongodb';

// Get matches for a user
export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({ error: 'userId required' }, { status: 400 });
    }

    // Get all matches where both users liked each other
    const matches = await Match.find({
      $or: [
        { userId: userId, isMatch: true },
        { likedUserId: userId, isMatch: true }
      ]
    });

    // Get user details for matches
    const matchedUserIds = matches.map(m => 
      m.userId === userId ? m.likedUserId : m.userId
    );

    const matchedUsers = await User.find({
      _id: { $in: matchedUserIds }
    }).select('-email');

    return NextResponse.json(matchedUsers);
  } catch (error) {
    console.error('Error fetching matches:', error);
    return NextResponse.json({ error: 'Failed to fetch matches' }, { status: 500 });
  }
}

// Like a user
export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const body = await request.json();
    const { userId, likedUserId } = body;

    if (!userId || !likedUserId) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    if (userId === likedUserId) {
      return NextResponse.json({ error: 'Cannot like yourself' }, { status: 400 });
    }

    // Check if already liked
    const existingLike = await Match.findOne({ userId, likedUserId });
    if (existingLike) {
      return NextResponse.json({ message: 'Already liked', match: existingLike });
    }

    // Check if the other user has liked this user
    const reciprocalLike = await Match.findOne({
      userId: likedUserId,
      likedUserId: userId
    });

    const isMatch = !!reciprocalLike;

    // Create the like
    const like = await Match.create({
      userId,
      likedUserId,
      isMatch,
      createdAt: new Date()
    });

    // If it's a match, update the reciprocal like as well
    if (isMatch && reciprocalLike) {
      await Match.findByIdAndUpdate(reciprocalLike._id, { isMatch: true });
    }

    return NextResponse.json({
      like,
      isMatch,
      message: isMatch ? "It's a match!" : 'Like sent'
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating like:', error);
    return NextResponse.json({ error: 'Failed to create like' }, { status: 500 });
  }
}

// Unlike a user
export async function DELETE(request: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const likedUserId = searchParams.get('likedUserId');

    if (!userId || !likedUserId) {
      return NextResponse.json({ error: 'Missing required parameters' }, { status: 400 });
    }

    // Remove the like
    const deleted = await Match.findOneAndDelete({ userId, likedUserId });

    if (!deleted) {
      return NextResponse.json({ error: 'Like not found' }, { status: 404 });
    }

    // Update reciprocal like if it exists
    await Match.findOneAndUpdate(
      { userId: likedUserId, likedUserId: userId },
      { isMatch: false }
    );

    return NextResponse.json({ message: 'Like removed successfully' });
  } catch (error) {
    console.error('Error removing like:', error);
    return NextResponse.json({ error: 'Failed to remove like' }, { status: 500 });
  }
}
