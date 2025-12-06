import { NextResponse } from 'next/server';
import { User } from '@/lib/types';
import { getUsers, getUserById, createUser } from '@/lib/data';
// import connectDB from '@/lib/mongodb'; // Uncomment when MongoDB is connected

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    // TODO: Uncomment when MongoDB connection is provided
    // await connectDB();

    if (id) {
      const user = await getUserById(parseInt(id));
      if (!user) {
        return NextResponse.json({ error: 'User not found' }, { status: 404 });
      }
      return NextResponse.json(user);
    }

    const users = await getUsers();
    return NextResponse.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // TODO: Add validation
    if (!body.name || !body.age || !body.gender || !body.style || !body.bio) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // TODO: Uncomment when MongoDB connection is provided
    // await connectDB();

    const newUser = await createUser(body);
    
    return NextResponse.json(newUser, { status: 201 });
  } catch (error) {
    console.error('Error creating user:', error);
    return NextResponse.json({ error: 'Failed to create user' }, { status: 500 });
  }
}

// TODO: Implement PUT and DELETE endpoints when needed
/*
export async function PUT(request: Request) {
  // Update user profile
}

export async function DELETE(request: Request) {
  // Delete user account
}
*/
