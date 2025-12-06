# Setup Guide for CharacterMatch Dating App

## Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Set Up Environment Variables

Copy `.env.example` to `.env.local`:
```bash
cp .env.example .env.local
```

### 3. Configure Google OAuth

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project or select existing one
3. Enable Google+ API
4. Go to "Credentials" → "Create Credentials" → "OAuth 2.0 Client ID"
5. Configure OAuth consent screen (add your app name, email, etc.)
6. For Application type, choose "Web application"
7. Add authorized redirect URIs:
   - `http://localhost:3000/api/auth/callback/google` (for development)
   - `https://yourdomain.com/api/auth/callback/google` (for production)
8. Copy the Client ID and Client Secret to your `.env.local`:
   ```
   GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com
   GOOGLE_CLIENT_SECRET=your-client-secret
   ```

### 4. Generate NextAuth Secret

Run this command to generate a secure secret:
```bash
openssl rand -base64 32
```

Add it to `.env.local`:
```
NEXTAUTH_SECRET=your-generated-secret
```

### 5. Set Up MongoDB

**Option A: Local MongoDB**
```bash
# Install MongoDB locally
# Start MongoDB service
mongod
```

**Option B: MongoDB Atlas (Recommended - Free Tier)**
1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free account
3. Create a cluster (free M0 tier)
4. Create a database user
5. Whitelist your IP (or use 0.0.0.0/0 for development)
6. Get connection string and add to `.env.local`:
   ```
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/charactermatch
   ```

### 6. (Optional) Set Up Hugging Face for AI Generation

The app works without an API key but rate limits are better with one:

1. Go to [Hugging Face](https://huggingface.co/settings/tokens)
2. Create a free account
3. Generate a new token (Read access is enough)
4. Add to `.env.local`:
   ```
   HUGGINGFACE_API_KEY=hf_your_token_here
   ```

**Note:** The app has a fallback template-based profile generator if the API fails or is unavailable.

### 7. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## How It Works

### Authentication Flow
1. User clicks "Continue with Google"
2. Google OAuth authentication
3. User is redirected to profile setup page
4. After completing setup, user can access the app

### AI Profile Generation
1. User enters: name, age, gender, style preference
2. Option to generate AI profile (enabled by default)
3. AI creates unique:
   - Bio (2-sentence engaging description)
   - Interests (4-6 relevant hobbies)
   - Personality traits (4-5 characteristics)
   - Looking for statement (ideal match)
   - Character avatar (emoji based on style)
4. User can regenerate or proceed

### AI Generation Options

**Primary: Hugging Face (Free)**
- Uses Mistral-7B-Instruct model
- Completely free
- No credit card required
- Better with API key, works without
- Falls back to templates if unavailable

**Fallback: Template-based**
- Smart templates based on style preference
- Randomized selection for variety
- Always available
- No API required

## Features Implemented

✅ Google OAuth authentication
✅ MongoDB integration for user profiles
✅ AI-powered profile generation
✅ Template-based fallback generation
✅ Multi-step profile setup
✅ Character avatar assignment
✅ Style-based personality traits
✅ Responsive UI design

## Next Steps to Complete the App

1. **Update Feed Page** - Load real users from MongoDB instead of mock data
2. **Update Profile Pages** - Fetch user data from database
3. **Implement Messaging** - Real-time chat functionality
4. **Add Matching Algorithm** - Find compatible users based on traits
5. **Image Uploads** - Allow profile photos
6. **Post System** - Let users create and interact with posts

## Troubleshooting

### "Error: NEXTAUTH_SECRET is not set"
Generate a secret with `openssl rand -base64 32` and add to `.env.local`

### "MongoDB connection failed"
- Check your MongoDB URI is correct
- For Atlas, ensure IP is whitelisted
- Verify database user credentials

### "Google OAuth not working"
- Verify redirect URIs match exactly
- Check OAuth consent screen is configured
- Ensure Google+ API is enabled

### "AI generation not working"
- The app will automatically fall back to template generation
- To use AI: Get free Hugging Face API key
- Check console for specific error messages

## Environment Variables Reference

```env
# Required
MONGODB_URI=                  # MongoDB connection string
NEXTAUTH_URL=                 # Your app URL (http://localhost:3000 for dev)
NEXTAUTH_SECRET=              # Random secret (generate with openssl)
GOOGLE_CLIENT_ID=             # From Google Cloud Console
GOOGLE_CLIENT_SECRET=         # From Google Cloud Console

# Optional but recommended
HUGGINGFACE_API_KEY=          # For better AI generation (free)

# Optional (for analytics)
BIGQUERY_PROJECT_ID=          
BIGQUERY_DATASET=             
GOOGLE_APPLICATION_CREDENTIALS=
```

## Database Collections

The app creates these MongoDB collections:

- `users` - User profiles with AI-generated data
- `accounts` - NextAuth OAuth accounts
- `sessions` - NextAuth sessions
- `posts` - User posts (when implemented)
- `messages` - Chat messages (when implemented)

## Free Services Used

1. **MongoDB Atlas** - Free M0 tier (512MB storage)
2. **Hugging Face** - Free API access for AI models
3. **Google OAuth** - Free authentication
4. **Vercel/Render** - Free hosting options
