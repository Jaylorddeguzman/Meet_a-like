// AI Profile Generation Service using Hugging Face Inference API
// Free tier: No credit card required, rate limited but sufficient for small apps

export type ProfileStyle = 'cute' | 'cool' | 'fun' | 'mysterious'
export type Gender = 'male' | 'female' | 'non-binary' | 'other'

interface GenerateProfileParams {
  name: string
  age: number
  gender: Gender
  style: ProfileStyle
}

interface GeneratedProfile {
  bio: string
  interests: string[]
  traits: string[]
  lookingFor: string
}

const HUGGINGFACE_API_KEY = process.env.HUGGINGFACE_API_KEY || ''

// Free alternative: You can also use Hugging Face without API key (slower, rate limited)
const API_URL = 'https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.2'

async function queryHuggingFace(prompt: string): Promise<string> {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  }
  
  // API key is optional but recommended for better rate limits
  if (HUGGINGFACE_API_KEY) {
    headers['Authorization'] = `Bearer ${HUGGINGFACE_API_KEY}`
  }

  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        inputs: prompt,
        parameters: {
          max_new_tokens: 300,
          temperature: 0.9,
          top_p: 0.95,
          return_full_text: false,
        },
      }),
    })

    if (!response.ok) {
      throw new Error(`HuggingFace API error: ${response.status}`)
    }

    const result = await response.json()
    return result[0]?.generated_text || ''
  } catch (error) {
    console.error('Error calling Hugging Face API:', error)
    // Fallback to template-based generation if API fails
    return ''
  }
}

function getStyleDescriptor(style: ProfileStyle): string {
  const descriptors = {
    cute: 'adorable, sweet, playful, warm-hearted',
    cool: 'confident, laid-back, trendy, charismatic',
    fun: 'energetic, spontaneous, adventurous, outgoing',
    mysterious: 'intriguing, thoughtful, enigmatic, deep',
  }
  return descriptors[style]
}

function generateFallbackProfile(params: GenerateProfileParams): GeneratedProfile {
  const { style, age, gender } = params
  
  const bioTemplates = {
    cute: [
      "I believe in spreading kindness and finding joy in little things. Love cozy coffee shops and good conversations! ☕",
      "Life's too short not to smile! I enjoy baking, cute cafes, and making people laugh. Let's share some happy moments! 🌸",
    ],
    cool: [
      "Living life on my own terms. Into music, streetwear, and good vibes. Let's see where this goes. 🎵",
      "Keeping it real and authentic. I appreciate art, good music, and deep conversations. No drama, just vibes. ✨",
    ],
    fun: [
      "Always up for an adventure! Whether it's trying new restaurants or spontaneous road trips, I'm in! 🚀",
      "Life is an adventure and I'm here for all of it! Love trying new things, meeting new people, and making memories. 🎉",
    ],
    mysterious: [
      "There's more than meets the eye. I enjoy philosophy, stargazing, and meaningful connections. Ask me anything. 🌙",
      "I find beauty in the unknown. Into books, art, and deep conversations about life. Let's explore together. 📚",
    ],
  }

  const interestsByStyle = {
    cute: ['Baking', 'Cute cafes', 'Anime', 'Crafts', 'Cooking', 'Photography', 'Plants'],
    cool: ['Music', 'Fashion', 'Art', 'Photography', 'Concerts', 'Skateboarding', 'Vinyl records'],
    fun: ['Travel', 'Dancing', 'Food adventures', 'Sports', 'Festivals', 'Karaoke', 'Hiking'],
    mysterious: ['Reading', 'Writing', 'Philosophy', 'Stargazing', 'Museums', 'Poetry', 'Psychology'],
  }

  const traitsByStyle = {
    cute: ['Kind', 'Optimistic', 'Affectionate', 'Playful', 'Caring', 'Cheerful'],
    cool: ['Confident', 'Authentic', 'Creative', 'Independent', 'Chill', 'Stylish'],
    fun: ['Adventurous', 'Energetic', 'Spontaneous', 'Outgoing', 'Enthusiastic', 'Bold'],
    mysterious: ['Thoughtful', 'Introspective', 'Curious', 'Deep', 'Observant', 'Enigmatic'],
  }

  const lookingForTemplates = {
    cute: "Someone kind and genuine who enjoys the simple pleasures in life",
    cool: "An authentic person who's confident in who they are",
    fun: "An adventurous soul who's ready to explore life together",
    mysterious: "A deep thinker who appreciates meaningful connections",
  }

  // Randomly select from templates
  const bioOptions = bioTemplates[style]
  const bio = bioOptions[Math.floor(Math.random() * bioOptions.length)]

  // Randomly select 4-6 interests
  const allInterests = interestsByStyle[style]
  const shuffled = allInterests.sort(() => 0.5 - Math.random())
  const interests = shuffled.slice(0, 4 + Math.floor(Math.random() * 3))

  // Select 4-5 traits
  const allTraits = traitsByStyle[style]
  const shuffledTraits = allTraits.sort(() => 0.5 - Math.random())
  const traits = shuffledTraits.slice(0, 4 + Math.floor(Math.random() * 2))

  return {
    bio,
    interests,
    traits,
    lookingFor: lookingForTemplates[style],
  }
}

export async function generateAIProfile(
  params: GenerateProfileParams
): Promise<GeneratedProfile> {
  const { name, age, gender, style } = params
  const styleDesc = getStyleDescriptor(style)

  // Try AI generation first
  const prompt = `Create a dating profile for ${name}, a ${age}-year-old ${gender} with a ${style} personality (${styleDesc}).

Generate in this exact format:
BIO: [Write a 2-sentence engaging bio]
INTERESTS: [List 5 interests, comma-separated]
TRAITS: [List 5 personality traits, comma-separated]
LOOKING_FOR: [One sentence about ideal match]`

  try {
    const aiResponse = await queryHuggingFace(prompt)
    
    if (aiResponse) {
      // Parse AI response
      const bioMatch = aiResponse.match(/BIO:\s*(.+?)(?=\n|INTERESTS:|$)/i)
      const interestsMatch = aiResponse.match(/INTERESTS:\s*(.+?)(?=\n|TRAITS:|$)/i)
      const traitsMatch = aiResponse.match(/TRAITS:\s*(.+?)(?=\n|LOOKING_FOR:|$)/i)
      const lookingMatch = aiResponse.match(/LOOKING_FOR:\s*(.+?)$/i)

      if (bioMatch && interestsMatch && traitsMatch && lookingMatch) {
        return {
          bio: bioMatch[1].trim(),
          interests: interestsMatch[1].split(',').map(i => i.trim()).filter(Boolean),
          traits: traitsMatch[1].split(',').map(t => t.trim()).filter(Boolean),
          lookingFor: lookingMatch[1].trim(),
        }
      }
    }
  } catch (error) {
    console.error('AI generation failed, using fallback:', error)
  }

  // Fallback to template-based generation
  return generateFallbackProfile(params)
}

// Generate random avatar based on style
export function generateAvatar(style: ProfileStyle, gender: Gender): string {
  const avatars = {
    cute: {
      male: ['😊', '🥰', '😺', '🐶', '🐻', '🐼'],
      female: ['🥰', '😊', '🌸', '🦋', '🐰', '🌺'],
      'non-binary': ['😊', '🌟', '🦄', '🌈', '✨', '🌸'],
      other: ['😊', '🌟', '🦄', '🌈', '✨', '🌸'],
    },
    cool: {
      male: ['😎', '🎸', '🎵', '🔥', '⚡', '🌃'],
      female: ['😎', '💅', '👑', '🎨', '🔥', '✨'],
      'non-binary': ['😎', '🎨', '🌟', '⚡', '🎵', '🔮'],
      other: ['😎', '🎨', '🌟', '⚡', '🎵', '🔮'],
    },
    fun: {
      male: ['🎉', '🚀', '🎊', '🌟', '⚡', '🎯'],
      female: ['🎉', '💃', '🌈', '✨', '🎊', '🦋'],
      'non-binary': ['🎉', '🌈', '✨', '🚀', '🎨', '🌟'],
      other: ['🎉', '🌈', '✨', '🚀', '🎨', '🌟'],
    },
    mysterious: {
      male: ['🌙', '🔮', '🎭', '🌌', '👁️', '🦉'],
      female: ['🌙', '🔮', '✨', '🦇', '🌌', '🎭'],
      'non-binary': ['🌙', '🔮', '🌌', '✨', '🎭', '🦋'],
      other: ['🌙', '🔮', '🌌', '✨', '🎭', '🦋'],
    },
  }

  const options = avatars[style][gender] || avatars[style].other
  return options[Math.floor(Math.random() * options.length)]
}
