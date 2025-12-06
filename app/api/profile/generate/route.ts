import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { generateAIProfile, generateAvatar, Gender, ProfileStyle } from '@/lib/ai-profile-generator'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { name, age, gender, style } = body

    if (!name || !age || !gender || !style) {
      return NextResponse.json(
        { error: 'Missing required fields: name, age, gender, style' },
        { status: 400 }
      )
    }

    // Generate AI profile
    const profile = await generateAIProfile({
      name,
      age: parseInt(age),
      gender: gender as Gender,
      style: style as ProfileStyle,
    })

    // Generate avatar
    const avatar = generateAvatar(style as ProfileStyle, gender as Gender)

    // Get gradient for style
    const gradients: Record<ProfileStyle, string> = {
      cute: 'from-pink-400 via-purple-300 to-blue-300',
      cool: 'from-blue-500 via-purple-500 to-pink-500',
      fun: 'from-yellow-400 via-orange-400 to-red-400',
      mysterious: 'from-purple-600 via-indigo-600 to-blue-600',
    }

    return NextResponse.json({
      bio: profile.bio,
      interests: profile.interests,
      traits: profile.traits,
      lookingFor: profile.lookingFor,
      character: {
        emoji: avatar,
        gradient: gradients[style as ProfileStyle],
      },
    })
  } catch (error) {
    console.error('Error generating AI profile:', error)
    return NextResponse.json(
      { error: 'Failed to generate profile' },
      { status: 500 }
    )
  }
}
