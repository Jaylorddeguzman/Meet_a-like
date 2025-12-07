import { NextRequest, NextResponse } from 'next/server';
import connectDB, { Notification } from '@/lib/mongodb';
import { getServerSession } from 'next-auth';

// GET - Get user notifications
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession();
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const unreadOnly = searchParams.get('unreadOnly') === 'true';

    if (!userId) {
      return NextResponse.json({ error: 'User ID required' }, { status: 400 });
    }

    const query: any = { userId };
    if (unreadOnly) {
      query.read = false;
    }

    const notifications = await Notification.find(query)
      .sort({ createdAt: -1 })
      .limit(50);

    const unreadCount = await Notification.countDocuments({ userId, read: false });

    return NextResponse.json({
      notifications,
      unreadCount
    });
  } catch (error) {
    console.error('Error fetching notifications:', error);
    return NextResponse.json(
      { error: 'Failed to fetch notifications' },
      { status: 500 }
    );
  }
}

// POST - Create new notification
export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const body = await request.json();
    const {
      userId,
      type,
      title,
      message,
      relatedUserId,
      relatedUserName,
      relatedUserCharacter,
      actionUrl,
      expiresAt
    } = body;

    const notification = await Notification.create({
      userId,
      type,
      title,
      message,
      relatedUserId,
      relatedUserName,
      relatedUserCharacter,
      actionUrl,
      expiresAt: expiresAt || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days default
    });

    return NextResponse.json(notification, { status: 201 });
  } catch (error) {
    console.error('Error creating notification:', error);
    return NextResponse.json(
      { error: 'Failed to create notification' },
      { status: 500 }
    );
  }
}

// PATCH - Mark notifications as read
export async function PATCH(request: NextRequest) {
  try {
    const session = await getServerSession();
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    const body = await request.json();
    const { notificationId, notificationIds, userId, markAllAsRead, read } = body;

    if (markAllAsRead && userId) {
      // Mark all notifications as read for user
      await Notification.updateMany(
        { userId, read: false },
        { read: true, readAt: new Date() }
      );
      return NextResponse.json({ message: 'All notifications marked as read' });
    }

    if (notificationId) {
      // Mark single notification as read
      await Notification.findByIdAndUpdate(
        notificationId,
        { read: read !== undefined ? read : true, readAt: new Date() }
      );
      return NextResponse.json({ message: 'Notification updated' });
    }

    if (notificationIds && notificationIds.length > 0) {
      // Mark specific notifications as read
      await Notification.updateMany(
        { _id: { $in: notificationIds } },
        { read: true, readAt: new Date() }
      );
      return NextResponse.json({ message: 'Notifications marked as read' });
    }

    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  } catch (error) {
    console.error('Error updating notifications:', error);
    return NextResponse.json(
      { error: 'Failed to update notifications' },
      { status: 500 }
    );
  }
}

// DELETE - Delete notification
export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession();
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    const body = await request.json();
    const notificationId = body.notificationId;

    if (!notificationId) {
      return NextResponse.json({ error: 'Notification ID required' }, { status: 400 });
    }

    await Notification.findByIdAndDelete(notificationId);

    return NextResponse.json({ message: 'Notification deleted' });
  } catch (error) {
    console.error('Error deleting notification:', error);
    return NextResponse.json(
      { error: 'Failed to delete notification' },
      { status: 500 }
    );
  }
}
