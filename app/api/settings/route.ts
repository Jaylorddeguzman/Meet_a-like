import { NextRequest, NextResponse } from 'next/server';
import connectDB, { UserSettings } from '@/lib/mongodb';
import { getServerSession } from 'next-auth';

// GET - Get user settings
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession();
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    // Get userId from query params
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({ error: 'User ID required' }, { status: 400 });
    }

    // Get settings or create default if doesn't exist
    let settings = await UserSettings.findOne({ userId });

    if (!settings) {
      // Create default settings
      settings = await UserSettings.create({
        userId,
        privacy: {
          showOnlineStatus: true,
          showDistance: true,
          showAge: true,
          showLastActive: true,
          profileVisibility: 'everyone'
        },
        notifications: {
          email: {
            matches: true,
            messages: true,
            likes: true,
            promotions: false
          },
          push: {
            matches: true,
            messages: true,
            likes: true
          }
        },
        discovery: {
          pauseProfile: false,
          incognitoMode: false,
          globalMode: false
        },
        account: {
          language: 'en',
          emailVerified: false,
          phoneVerified: false
        }
      });
    }

    return NextResponse.json(settings);
  } catch (error) {
    console.error('Error fetching settings:', error);
    return NextResponse.json(
      { error: 'Failed to fetch settings' },
      { status: 500 }
    );
  }
}

// PATCH - Update user settings
export async function PATCH(request: NextRequest) {
  try {
    const session = await getServerSession();
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    const body = await request.json();
    const { userId, settings } = body;

    if (!userId) {
      return NextResponse.json({ error: 'User ID required' }, { status: 400 });
    }

    // Update settings
    const updatedSettings = await UserSettings.findOneAndUpdate(
      { userId },
      { 
        ...settings,
        updatedAt: new Date()
      },
      { 
        new: true,
        upsert: true
      }
    );

    return NextResponse.json(updatedSettings);
  } catch (error) {
    console.error('Error updating settings:', error);
    return NextResponse.json(
      { error: 'Failed to update settings' },
      { status: 500 }
    );
  }
}

// PUT - Update user settings (alternative)
export async function PUT(request: NextRequest) {
  return PATCH(request);
}

// DELETE - Delete user account
export async function DELETE(request: NextRequest) {
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

    // Delete all user data
    await UserSettings.deleteOne({ userId });
    
    return NextResponse.json({ 
      success: true,
      message: 'Account deleted successfully' 
    });
  } catch (error) {
    console.error('Error deleting account:', error);
    return NextResponse.json(
      { error: 'Failed to delete account' },
      { status: 500 }
    );
  }
}
