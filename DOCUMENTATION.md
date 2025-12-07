# CharacterMatch Dating App - Technical Documentation

## Overview
CharacterMatch is a modern dating application built with Next.js 14, featuring Google OAuth authentication, AI-powered profile generation, and real-time matching capabilities. The app uses MongoDB Atlas for data persistence and integrates with Hugging Face's AI models for intelligent profile creation.

## Technology Stack

### Frontend
- **Next.js 14.2.33** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS 3.4.14** - Utility-first styling
- **React Context API** - State management

### Backend
- **Next.js API Routes** - Serverless API endpoints
- **MongoDB Atlas** - Cloud database
- **Mongoose 8.7.2** - ODM for MongoDB
- **NextAuth.js** - Authentication framework

### External Services
- **Google OAuth 2.0** - User authentication
- **Hugging Face API** - AI profile generation (Mistral-7B-Instruct)
- **MongoDB Atlas** - Database hosting

## Project Structure

```
dating_app/
├── app/
│   ├── api/                      # API routes
│   │   ├── auth/
│   │   │   └── [...nextauth]/    # NextAuth configuration
│   │   ├── profile/              # Profile management
│   │   ├── users/                # User CRUD operations
│   │   ├── posts/                # Post management
│   │   ├── messages/             # Messaging system
│   │   ├── matches/              # Match algorithm
│   │   └── test-connection/      # Database connectivity test
│   ├── feed/                     # Main feed page
│   ├── messages/                 # Messages interface
│   ├── profile/[id]/             # User profile pages
│   └── profile-setup/            # Onboarding flow
├── components/                   # React components
│   ├── AuthProvider.tsx          # NextAuth session provider
│   ├── BottomNav.tsx             # Navigation bar
│   ├── CharacterAvatar.tsx       # Avatar display
│   ├── PostCard.tsx              # Post display card
│   └── ProfileSetup.tsx          # Multi-step profile form
├── contexts/
│   └── UserContext.tsx           # User state management
├── lib/
│   ├── mongodb.ts                # Database connection & schemas
│   ├── mongodb-client.ts         # MongoDB client for NextAuth
│   ├── ai-profile-generator.ts   # AI profile generation
│   ├── data.ts                   # Mock data utilities
│   ├── types.ts                  # TypeScript definitions
│   └── utils.ts                  # Helper functions
└── .env.local                    # Environment variables
```

## Core Features

### 1. Authentication System
**Location**: `app/api/auth/[...nextauth]/route.ts`

- Google OAuth integration via NextAuth.js
- MongoDB session persistence
- Automatic user creation on first login
- Session management with JWT tokens

**Key Configuration**:
```typescript
providers: [
  GoogleProvider({
    clientId: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  })
]
```

### 2. AI Profile Generation
**Location**: `lib/ai-profile-generator.ts`

- Integrates Hugging Face's Mistral-7B-Instruct model
- Generates personalized bios based on:
  - User's name and age
  - Selected personality style (Adventurous, Intellectual, Romantic, Creative)
  - Gender preference
- Fallback template system for offline/API failures
- Avatar generation based on style and gender

**API Endpoint**: `POST /api/profile/generate`

### 3. Database Schema
**Location**: `lib/mongodb.ts`

#### Collections:

**Users Collection**
```typescript
{
  email: string (unique, indexed)
  name: string
  age: number
  gender: string
  preferredStyle: string
  bio: string
  avatar: string
  interests: string[]
  location: string
  createdAt: Date
}
```

**Posts Collection**
```typescript
{
  userId: string (indexed)
  content: string
  imageUrl: string
  likes: string[] (array of user IDs)
  comments: Comment[]
  createdAt: Date
}
```

**Messages Collection**
```typescript
{
  conversationId: string (indexed)
  senderId: string
  receiverId: string
  content: string
  read: boolean
  createdAt: Date
}
```

**Conversations Collection**
```typescript
{
  participants: string[] (indexed)
  lastMessage: string
  lastMessageAt: Date
  createdAt: Date
}
```

**Matches Collection**
```typescript
{
  userId: string (indexed)
  likedUserId: string
  matched: boolean (true if reciprocal like)
  createdAt: Date
}
```

**ProfileViews Collection**
```typescript
{
  viewerId: string
  viewedUserId: string (indexed)
  viewedAt: Date
}
```

### 4. API Endpoints

#### Authentication
- `GET/POST /api/auth/[...nextauth]` - NextAuth handlers
- `GET /api/auth/session` - Get current session

#### Profile Management
- `POST /api/profile` - Create/update user profile
- `GET /api/profile?userId=xxx` - Get user profile
- `POST /api/profile/generate` - Generate AI profile

#### User Operations
- `GET /api/users` - Get all users or filter by id/email
- `POST /api/users` - Create new user
- `PATCH /api/users` - Update user profile

#### Posts
- `GET /api/posts` - Get all posts or by user
- `POST /api/posts` - Create new post
- `PATCH /api/posts` - Like/unlike post
- `DELETE /api/posts` - Delete post (owner only)

#### Messaging
- `GET /api/messages?conversationId=xxx` - Get messages
- `GET /api/messages?userId=xxx` - Get user's conversations
- `POST /api/messages` - Send message
- `PATCH /api/messages` - Mark messages as read

#### Matching
- `GET /api/matches?userId=xxx` - Get user's matches
- `POST /api/matches` - Like a user (creates match if reciprocal)
- `DELETE /api/matches` - Unlike a user

#### Diagnostics
- `GET /api/test-connection` - Test database connectivity

## User Flow

### 1. Sign Up / Login
1. User clicks "Sign in with Google" on landing page
2. Google OAuth flow authenticates user
3. NextAuth creates session and stores in MongoDB
4. New users redirected to profile setup

### 2. Profile Setup (3 Steps)
**Location**: `app/profile-setup/page.tsx`

- **Step 1**: Enter name and age
- **Step 2**: Select gender and personality style
- **Step 3**: AI generates and displays profile preview

### 3. Main Feed
**Location**: `app/feed/page.tsx`

- Displays posts from all users
- Like/comment functionality
- Create new posts
- Navigate to user profiles

### 4. Profile Pages
**Location**: `app/profile/[id]/page.tsx`

- View user profile details
- See user's posts
- Message user
- Like user (for matching)

### 5. Messaging
**Location**: `app/messages/page.tsx`

- View all conversations
- Real-time messaging interface
- Read receipts

## Environment Variables

Required variables in `.env.local`:

```env
# MongoDB
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/charactermatch

# NextAuth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key

# Google OAuth
GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-client-secret

# Hugging Face (Optional)
HUGGING_FACE_API_KEY=your-api-key

# Google API (Optional)
GOOGLE_API_KEY=your-google-api-key
```

## Database Connection

### MongoDB Atlas Setup
1. Cluster: `cluster0.8btbegt.mongodb.net`
2. Database: `charactermatch`
3. IP Whitelist configured for development
4. Retry logic implemented for connection failures

### Connection Manager
**Location**: `lib/mongodb.ts`

```typescript
export async function connectDB() {
  if (mongoose.connection.readyState >= 1) return;
  
  await mongoose.connect(process.env.MONGODB_URI!, {
    maxPoolSize: 10,
    serverSelectionTimeoutMS: 5000,
  });
}
```

## AI Profile Generation

### How It Works
1. User completes basic info (name, age, gender, style)
2. Frontend calls `POST /api/profile/generate`
3. Backend constructs prompt for AI model
4. Hugging Face API generates personalized bio
5. If API fails, uses template-based fallback
6. Avatar selected based on style and gender

### Prompt Template
```
Generate a dating profile bio for {name}, a {age}-year-old {gender}.
Style: {style} (Adventurous/Intellectual/Romantic/Creative)
Keep it 2-3 sentences, engaging and authentic.
```

### Fallback System
If AI generation fails, uses pre-written templates matching the personality style:
- **Adventurous**: Travel, outdoor activities, spontaneity
- **Intellectual**: Books, deep conversations, learning
- **Romantic**: Meaningful connections, thoughtful gestures
- **Creative**: Art, self-expression, imagination

## Security Features

### Authentication
- Google OAuth 2.0 for secure login
- JWT session tokens
- Server-side session validation
- Protected API routes

### Database
- IP whitelist on MongoDB Atlas
- Connection encryption (SSL/TLS)
- Input validation on all endpoints
- User ownership verification for deletions

### API Protection
- Session checks on sensitive endpoints
- CORS configuration
- Rate limiting (to be implemented)
- Environment variable security

## Performance Optimizations

### Database
- Indexes on frequently queried fields (email, userId, conversationId)
- Connection pooling (max 10 connections)
- Cached database connection in serverless environment

### Frontend
- Next.js App Router for optimal routing
- Server Components for initial rendering
- Client Components only where needed
- Image optimization with Next.js Image component

### API
- Efficient queries with selective field projection
- Pagination support (to be implemented)
- Caching headers (to be implemented)

## Testing

### Database Connection Test
**Endpoint**: `GET /api/test-connection`

Tests:
- MongoDB connection status
- Document count verification
- BigQuery configuration check

Returns JSON with connection details and any errors.

## Deployment

### Current Status
- Development: `http://localhost:3000`
- Repository: `github.com/Jaylorddeguzman/Meet_a-like`
- Branch: `main`

### Deployment Checklist (Render)
- [ ] Add Render IP to MongoDB Atlas whitelist
- [ ] Configure environment variables in Render
- [ ] Set build command: `npm install && npm run build`
- [ ] Set start command: `npm start`
- [ ] Configure custom domain (optional)
- [ ] Enable auto-deploy from GitHub

## Known Issues & Future Improvements

### Current Limitations
1. Feed page uses mock data (needs database integration)
2. Profile pages need database integration
3. No real-time messaging (WebSocket needed)
4. No image upload functionality
5. No pagination on lists

### Planned Features
- [ ] Real-time notifications
- [ ] Image upload with cloud storage
- [ ] Advanced matching algorithm
- [ ] User blocking/reporting
- [ ] Email notifications
- [ ] Profile verification
- [ ] Video profiles
- [ ] Location-based matching
- [ ] Swipe interface

## Development Commands

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Test database connection
curl http://localhost:3000/api/test-connection
```

## Troubleshooting

### MongoDB Connection Issues
- Verify IP is whitelisted in MongoDB Atlas
- Check MONGODB_URI in .env.local
- Ensure network connectivity
- Check MongoDB Atlas cluster status

### Authentication Issues
- Verify Google OAuth credentials
- Check NEXTAUTH_URL matches current domain
- Clear browser cookies and try again
- Verify NEXTAUTH_SECRET is set

### AI Generation Issues
- Check HUGGING_FACE_API_KEY is valid
- Fallback templates will be used if API fails
- Monitor API rate limits

## Support & Maintenance

### Monitoring
- Check MongoDB Atlas metrics dashboard
- Monitor Next.js build logs
- Track API endpoint performance
- Monitor Hugging Face API usage

### Regular Maintenance
- Update dependencies monthly
- Review and rotate API keys quarterly
- Clean up old sessions/data
- Backup database regularly

## License & Credits
- Built with Next.js, React, and MongoDB
- AI powered by Hugging Face (Mistral-7B-Instruct)
- Icons and styling with Tailwind CSS
- Authentication by NextAuth.js

---

**Last Updated**: December 6, 2025  
**Version**: 1.0.0  
**Developer**: GitHub Copilot Assistant
