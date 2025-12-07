import { NextRequest, NextResponse } from 'next/server';
import connectDB, { Block } from '@/lib/mongodb';
import { getServerSession } from 'next-auth';

// GET - Get blocked users
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession();
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({ error: 'User ID required' }, { status: 400 });
    }

    const blockedUsers = await Block.find({ blockerId: userId });

    return NextResponse.json(blockedUsers);
  } catch (error) {
    console.error('Error fetching blocked users:', error);
    return NextResponse.json(
      { error: 'Failed to fetch blocked users' },
      { status: 500 }
    );
  }
}

// POST - Block a user
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession();
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    const body = await request.json();
    const { blockerId, blockedUserId, reason } = body;

    if (!blockerId || !blockedUserId) {
      return NextResponse.json(
        { error: 'Blocker ID and blocked user ID required' },
        { status: 400 }
      );
    }

    // Check if already blocked
    const existing = await Block.findOne({ blockerId, blockedUserId });
    if (existing) {
      return NextResponse.json(
        { error: 'User already blocked' },
        { status: 400 }
      );
    }

    const block = await Block.create({
      blockerId,
      blockedUserId,
      reason
    });

    return NextResponse.json(block, { status: 201 });
  } catch (error) {
    console.error('Error blocking user:', error);
    return NextResponse.json(
      { error: 'Failed to block user' },
      { status: 500 }
    );
  }
}

// DELETE - Unblock a user
export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession();
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    const { searchParams } = new URL(request.url);
    const blockerId = searchParams.get('blockerId');
    const blockedUserId = searchParams.get('blockedUserId');

    if (!blockerId || !blockedUserId) {
      return NextResponse.json(
        { error: 'Blocker ID and blocked user ID required' },
        { status: 400 }
      );
    }

    await Block.findOneAndDelete({ blockerId, blockedUserId });

    return NextResponse.json({ message: 'User unblocked successfully' });
  } catch (error) {
    console.error('Error unblocking user:', error);
    return NextResponse.json(
      { error: 'Failed to unblock user' },
      { status: 500 }
    );
  }
}
