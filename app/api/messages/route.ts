import { NextResponse, NextRequest } from 'next/server';
import connectDB, { Message, Conversation } from '@/lib/mongodb';

// Get messages for a conversation
export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const otherUserId = searchParams.get('otherUserId');

    if (!userId) {
      return NextResponse.json({ error: 'userId required' }, { status: 400 });
    }

    if (otherUserId) {
      // Get messages between two specific users
      const messages = await Message.find({
        $or: [
          { senderId: userId, receiverId: otherUserId },
          { senderId: otherUserId, receiverId: userId }
        ]
      }).sort({ createdAt: 1 });

      // Mark messages as read
      await Message.updateMany(
        { senderId: otherUserId, receiverId: userId, read: false },
        { read: true }
      );

      return NextResponse.json(messages);
    }

    // Get all conversations for user
    const conversations = await Conversation.find({
      participants: userId
    }).sort({ lastMessageAt: -1 });

    return NextResponse.json(conversations);
  } catch (error) {
    console.error('Error fetching messages:', error);
    return NextResponse.json({ error: 'Failed to fetch messages' }, { status: 500 });
  }
}

// Send a message
export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const body = await request.json();
    const { senderId, receiverId, text } = body;

    if (!senderId || !receiverId || !text) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    if (text.length > 1000) {
      return NextResponse.json({ error: 'Message too long (max 1000 characters)' }, { status: 400 });
    }

    // Create message
    const message = await Message.create({
      senderId,
      receiverId,
      text,
      read: false,
      createdAt: new Date()
    });

    // Update or create conversation
    const participants = [senderId, receiverId].sort();
    await Conversation.findOneAndUpdate(
      { participants: { $all: participants } },
      {
        participants,
        lastMessage: text.substring(0, 100),
        lastMessageAt: new Date()
      },
      { upsert: true, new: true }
    );

    return NextResponse.json(message, { status: 201 });
  } catch (error) {
    console.error('Error sending message:', error);
    return NextResponse.json({ error: 'Failed to send message' }, { status: 500 });
  }
}

// Mark messages as read
export async function PATCH(request: NextRequest) {
  try {
    await connectDB();

    const body = await request.json();
    const { userId, otherUserId } = body;

    if (!userId || !otherUserId) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    await Message.updateMany(
      { senderId: otherUserId, receiverId: userId, read: false },
      { read: true }
    );

    return NextResponse.json({ message: 'Messages marked as read' });
  } catch (error) {
    console.error('Error marking messages as read:', error);
    return NextResponse.json({ error: 'Failed to update messages' }, { status: 500 });
  }
}
