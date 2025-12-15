import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import clientPromise from '@/lib/mongodb-client'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const {
      name,
      age,
      gender,
      style,
      bio,
      interests,
      traits,
      lookingFor,
      character,
      isAIGenerated,
    } = body

    // Validate required fields
    if (!name || !age || !gender || !style || !character) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Connect to MongoDB
    const client = await clientPromise
    const db = client.db('charactermatch')
    const usersCollection = db.collection('users')

    // Update or create user profile
    const result = await usersCollection.findOneAndUpdate(
      { email: session.user.email },
      {
        $set: {
          name,
          age: parseInt(age),
          gender,
          style,
          bio: bio || '',
          interests: interests || [],
          traits: traits || [],
          lookingFor: lookingFor || '',
          character,
          isAIGenerated: isAIGenerated || false,
          profileCompleted: true,
          updatedAt: new Date(),
        },
        $setOnInsert: {
          email: session.user.email,
          image: session.user.image,
          createdAt: new Date(),
        },
      },
      {
        upsert: true,
        returnDocument: 'after',
      }
    )

    return NextResponse.json({
      success: true,
      user: result,
    })
  } catch (error) {
    console.error('Error saving profile:', error)
    return NextResponse.json(
      { error: 'Failed to save profile' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Connect to MongoDB
    const client = await clientPromise
    const db = client.db('charactermatch')
    const usersCollection = db.collection('users')

    // Check if requesting specific user by userId
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')

    let user
    if (userId) {
      // Fetch specific user by ID or email
      const { ObjectId } = require('mongodb')
      try {
        // Try to find by MongoDB _id
        user = await usersCollection.findOne({ _id: new ObjectId(userId) })
      } catch (e) {
        // If not a valid ObjectId, try as numeric id or email
        user = await usersCollection.findOne({ 
          $or: [
            { id: parseInt(userId) },
            { email: userId }
          ]
        })
      }
    } else {
      // Get current user's profile
      user = await usersCollection.findOne({ email: session.user.email })
    }

    if (!user) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 })
    }

    return NextResponse.json({ user })
  } catch (error) {
    console.error('Error fetching profile:', error)
    return NextResponse.json(
      { error: 'Failed to fetch profile' },
      { status: 500 }
    )
  }
}
