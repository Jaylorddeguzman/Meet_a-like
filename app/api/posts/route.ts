import { NextResponse } from 'next/server';
import { Post } from '@/lib/types';
import { getPosts, createPost } from '@/lib/data';
// import connectDB from '@/lib/mongodb'; // Uncomment when MongoDB is connected

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    // TODO: Uncomment when MongoDB connection is provided
    // await connectDB();

    const posts = await getPosts();
    
    // Filter by userId if provided
    if (userId) {
      const filteredPosts = posts.filter(p => p.userId === parseInt(userId));
      return NextResponse.json(filteredPosts);
    }

    return NextResponse.json(posts);
  } catch (error) {
    console.error('Error fetching posts:', error);
    return NextResponse.json({ error: 'Failed to fetch posts' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Validation
    if (!body.userId || !body.text) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    if (body.text.length > 1000) {
      return NextResponse.json({ error: 'Post text too long' }, { status: 400 });
    }

    // TODO: Uncomment when MongoDB connection is provided
    // await connectDB();

    const newPost: Post = {
      userId: body.userId,
      text: body.text,
      likes: 0,
    };

    const createdPost = await createPost(newPost);

    return NextResponse.json(createdPost, { status: 201 });
  } catch (error) {
    console.error('Error creating post:', error);
    return NextResponse.json({ error: 'Failed to create post' }, { status: 500 });
  }
}

// TODO: Implement like/unlike functionality
/*
export async function PATCH(request: Request) {
  // Update post likes
  const body = await request.json();
  const { postId, action } = body; // action: 'like' | 'unlike'
  
  // TODO: Implement in MongoDB
}
*/

// TODO: Implement delete post
/*
export async function DELETE(request: Request) {
  // Delete a post
  const { searchParams } = new URL(request.url);
  const postId = searchParams.get('id');
  
  // TODO: Implement in MongoDB
}
*/
