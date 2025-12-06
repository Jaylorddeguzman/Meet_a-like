import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';
import connectDB, { User } from '@/lib/mongodb';

export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const email = searchParams.get('email');

    if (id) {
      const user = await User.findById(id);
      if (!user) {
        return NextResponse.json({ error: 'User not found' }, { status: 404 });
      }
      return NextResponse.json(user);
    }

    if (email) {
      const user = await User.findOne({ email });
      if (!user) {
        return NextResponse.json({ error: 'User not found' }, { status: 404 });
      }
      return NextResponse.json(user);
    }

    // Get all users with completed profiles (for feed/browsing)
    const users = await User.find({ profileCompleted: true })
      .select('-email') // Don't expose emails
      .sort({ createdAt: -1 })
      .limit(50);

    return NextResponse.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const body = await request.json();
    
    // Validation
    if (!body.name || !body.age || !body.gender || !body.style) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Check if user already exists
    if (body.email) {
      const existingUser = await User.findOne({ email: body.email });
      if (existingUser) {
        return NextResponse.json({ error: 'User already exists' }, { status: 409 });
      }
    }

    const newUser = await User.create({
      ...body,
      createdAt: new Date(),
      updatedAt: new Date()
    });
    
    return NextResponse.json(newUser, { status: 201 });
  } catch (error) {
    console.error('Error creating user:', error);
    return NextResponse.json({ error: 'Failed to create user' }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    await connectDB();

    const body = await request.json();
    const { id, email, ...updateData } = body;

    if (!id && !email) {
      return NextResponse.json({ error: 'User ID or email required' }, { status: 400 });
    }

    const query = id ? { _id: id } : { email };
    const updatedUser = await User.findOneAndUpdate(
      query,
      { ...updateData, updatedAt: new Date() },
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error('Error updating user:', error);
    return NextResponse.json({ error: 'Failed to update user' }, { status: 500 });
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
