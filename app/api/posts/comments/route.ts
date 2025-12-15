import { NextRequest, NextResponse } from 'next/server';
import connectDB, { Post, User } from '@/lib/mongodb';

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const body = await request.json();
    const { postId, userId, text } = body;

    if (!postId || !userId || !text) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const post = await Post.findById(postId);
    if (!post) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }

    // Optionally look up the user to populate userName/character
    let user = null;
    try {
      user = await User.findById(userId);
    } catch (e) {
      user = null;
    }

    const comment = {
      userId,
      userName: user?.name || 'Unknown',
      userCharacter: user?.character || null,
      text,
      createdAt: new Date()
    } as any;

    post.comments = post.comments || [];
    post.comments.push(comment);

    await post.save();

    return NextResponse.json({ comment }, { status: 201 });
  } catch (error) {
    console.error('Error adding comment:', error);
    return NextResponse.json({ error: 'Failed to add comment' }, { status: 500 });
  }
}
