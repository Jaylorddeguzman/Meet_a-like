# CharacterMatch Dating App

A modern, fully-featured dating application built with Next.js 14, TypeScript, and Tailwind CSS. Users are represented by customizable character avatars (emojis) in a colorful, engaging social feed.

## 🚀 Features

- **Character-Based Profiles**: Users choose from 4 style preferences (Cute, Cool, Fun, Mysterious) and get assigned unique emoji avatars
- **Social Feed**: Post updates, view other users' posts, and interact with the community
- **Profile System**: Detailed user profiles with bios, interests, and character avatars
- **Messaging Interface**: Connect and chat with other users
- **Responsive Design**: Beautiful gradient-based UI with Tailwind CSS
- **State Persistence**: User sessions and posts saved to localStorage
- **Database Ready**: MongoDB and BigQuery integration placeholders ready for connection

## 📋 Prerequisites

- Node.js 18.17.0 or higher
- npm or yarn package manager

## 🛠️ Installation

1. **Install dependencies**:
```bash
npm install
```

2. **Set up environment variables**:
Copy `.env.example` to `.env.local` and configure:
```bash
cp .env.example .env.local
```

3. **Run the development server**:
```bash
npm run dev
```

4. **Open your browser**:
Navigate to [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
dating_app/
├── app/                      # Next.js App Router
│   ├── api/                  # API routes
│   │   ├── users/           # User endpoints
│   │   └── posts/           # Post endpoints
│   ├── feed/                # Main feed page
│   ├── profile/[id]/        # Dynamic profile pages
│   ├── messages/            # Messages page
│   ├── layout.tsx           # Root layout
│   ├── page.tsx             # Home/setup page
│   └── globals.css          # Global styles
├── components/              # Reusable React components
│   ├── CharacterAvatar.tsx
│   ├── BottomNav.tsx
│   ├── PostCard.tsx
│   └── ProfileSetup.tsx
├── contexts/                # React Context providers
│   └── UserContext.tsx
├── lib/                     # Utilities and data
│   ├── types.ts            # TypeScript interfaces
│   ├── data.ts             # Sample data & DB placeholders
│   ├── utils.ts            # Helper functions
│   ├── mongodb.ts          # MongoDB connection
│   └── bigquery.ts         # BigQuery analytics
├── public/                  # Static assets
├── package.json
├── next.config.js
├── tailwind.config.ts
├── tsconfig.json
└── render.yaml             # Render deployment config
```

## 🎨 Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **State Management**: React Context + localStorage
- **Database (Ready)**: MongoDB with Mongoose
- **Analytics (Ready)**: Google BigQuery

## 🔌 Database Integration

The app is ready for database integration. When you're ready to connect:

### MongoDB Setup

1. Update `.env.local` with your MongoDB connection string:
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/charactermatch
```

2. Uncomment database connection code in:
   - `lib/mongodb.ts` - Schema definitions
   - `app/api/users/route.ts` - User API endpoints
   - `app/api/posts/route.ts` - Post API endpoints

### BigQuery Setup

1. Add BigQuery credentials to `.env.local`:
```env
BIGQUERY_PROJECT_ID=your-project-id
BIGQUERY_DATASET=analytics
GOOGLE_APPLICATION_CREDENTIALS=./service-account.json
```

2. Uncomment BigQuery logging in `lib/bigquery.ts`

## 🚀 Deployment to Render

1. **Push code to GitHub**

2. **Connect to Render**:
   - Go to [render.com](https://render.com)
   - Click "New +" → "Web Service"
   - Connect your GitHub repository

3. **Configure Environment Variables** in Render dashboard:
   - `NODE_ENV=production`
   - `MONGODB_URI=<your-mongodb-uri>`
   - `BIGQUERY_PROJECT_ID=<your-project-id>`
   - `NEXT_PUBLIC_APP_URL=<your-render-url>`

4. **Deploy**: Render will automatically build and deploy using `render.yaml`

## 📝 Build Commands

```bash
# Development
npm run dev

# Production build
npm run build

# Start production server
npm start

# Linting
npm run lint
```

## 🎯 Next Steps

1. ✅ Basic app structure complete
2. ⏳ Connect MongoDB database
3. ⏳ Connect BigQuery analytics
4. ⏳ Implement real-time messaging
5. ⏳ Add image upload functionality
6. ⏳ Implement matching algorithm
7. ⏳ Add authentication (NextAuth.js)

## 📄 License

This project is private and proprietary.

## 🤝 Contributing

This is a private project. Contact the team for contribution guidelines.
