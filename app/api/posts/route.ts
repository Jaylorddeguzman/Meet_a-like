import { NextResponse, NextRequest } from 'next/server';
import connectDB, { Post, User } from '@/lib/mongodb';

export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (userId) {
      const posts = await Post.find({ userId })
        .sort({ createdAt: -1 })
        .limit(50);
      return NextResponse.json(posts);
    }

    // Get all posts for feed
    const posts = await Post.find()
      .sort({ createdAt: -1 })
      .limit(100);

    return NextResponse.json(posts);
  } catch (error) {
    console.error('Error fetching posts:', error);
    return NextResponse.json({ error: 'Failed to fetch posts' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const body = await request.json();
    
    // Validation
    if (!body.userId || !body.text) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    if (body.text.length > 1000) {
      return NextResponse.json({ error: 'Post text too long (max 1000 characters)' }, { status: 400 });
    }

    // Get user info for the post
    const user = await User.findById(body.userId);
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const newPost = await Post.create({
      userId: body.userId,
      userName: user.name,
      userCharacter: user.character,
      text: body.text,
      likes: 0,
      likedBy: [],
      createdAt: new Date()
    });

    return NextResponse.json(newPost, { status: 201 });
  } catch (error) {
    console.error('Error creating post:', error);
    return NextResponse.json({ error: 'Failed to create post' }, { status: 500 });
  }
}

// Like/unlike post
export async function PATCH(request: NextRequest) {
  try {
    await connectDB();

    const body = await request.json();
    const { postId, userId, action } = body; // action: 'like' | 'unlike'
    
    if (!postId || !userId || !action) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const post = await Post.findById(postId);
    if (!post) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }

    if (action === 'like') {
      if (!post.likedBy.includes(userId)) {
        post.likedBy.push(userId);
        post.likes = post.likedBy.length;
      }
    } else if (action === 'unlike') {
      post.likedBy = post.likedBy.filter((id: string) => id !== userId);
      post.likes = post.likedBy.length;
    }

    await post.save();

    return NextResponse.json(post);
  } catch (error) {
    console.error('Error updating post:', error);
    return NextResponse.json({ error: 'Failed to update post' }, { status: 500 });
  }
}

// Delete post
export async function DELETE(request: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const postId = searchParams.get('postId');
    const userId = searchParams.get('userId');

    if (!postId || !userId) {
      return NextResponse.json({ error: 'Missing postId or userId' }, { status: 400 });
    }

    const post = await Post.findById(postId);
    if (!post) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }

    // Check if user owns the post
    if (post.userId !== userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    await Post.findByIdAndDelete(postId);

    return NextResponse.json({ message: 'Post deleted successfully' });
  } catch (error) {
    console.error('Error deleting post:', error);
    return NextResponse.json({ error: 'Failed to delete post' }, { status: 500 });
  }
}
/*
export async function DELETE(request: Request) {
  // Delete a post
  const { searchParams } = new URL(request.url);
  const postId = searchParams.get('id');
  
  // TODO: Implement in MongoDB
}
*/
