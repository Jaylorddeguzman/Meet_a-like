# Database Optimization Strategy

## 🎯 Overview

This document outlines the optimized database architecture for **CharacterMatch** - a unique dating app where users are represented by **AI-generated cute character avatars** (emojis) instead of real photos. This creates a fun, low-pressure, personality-first dating experience!

The architecture leverages **MongoDB** for transactional data and **BigQuery** for analytics to ensure maximum performance and scalability.

---

## 💡 The Character-Based Concept

Unlike traditional dating apps that rely on photos, CharacterMatch uses:
- 🎨 **AI-generated emoji characters** that match user personality
- 🌈 **Colorful gradients** and customizable backgrounds
- ✨ **Accessories and moods** for personalization
- 💭 **Focus on bio, interests, and traits** rather than appearance

This approach:
✅ Reduces appearance-based judgment  
✅ Encourages personality-first connections  
✅ Creates a playful, low-pressure environment  
✅ Eliminates photo verification issues  
✅ Maintains user privacy  

---

## 📊 Database Distribution Strategy

### **MongoDB Atlas** - Operational Database (OLTP)
**Purpose**: Real-time transactional data that requires fast reads/writes and frequent updates

**Use Cases**:
- User authentication and sessions
- Profile CRUD operations
- Messaging and conversations
- Matches and likes
- Posts and social interactions
- User settings and preferences
- Notifications
- Block/report actions

**Why MongoDB?**:
✅ Fast document-based reads/writes  
✅ Flexible schema for evolving user profiles  
✅ Built-in indexing for quick queries  
✅ Real-time updates and low latency  
✅ Perfect for user-generated content  

---

### **BigQuery** - Analytics Database (OLAP)
**Purpose**: Historical data analysis, business intelligence, and complex aggregations

**Use Cases**:
- User behavior tracking and analytics
- Match success rate analysis
- Engagement metrics (time on app, interactions)
- A/B testing results
- Conversion funnels
- Popular features and content
- Geographic and demographic insights
- Revenue and growth metrics

**Why BigQuery?**:
✅ Handles massive datasets efficiently  
✅ Complex aggregation queries at scale  
✅ Cost-effective for large-scale analytics  
✅ No indexing required  
✅ Perfect for historical data and reporting  

---

## 🗃️ MongoDB Collections (Detailed)

### 1. **Users Collection**
**Purpose**: Core user profile and identity data

```typescript
{
  _id: ObjectId,
  email: string (unique, indexed),
  name: string,
  age: number,
  gender: 'male' | 'female' | 'non-binary' | 'other',
  style: 'cute' | 'cool' | 'fun' | 'mysterious',
  
  character: {
    emoji: string,
    gradient: string
  },
  
  bio: string,
  interests: string[],
  traits: string[],
  lookingFor: string,
  
  // NEW: Character Customization (NO REAL PHOTOS!)
  characterCustomization: {
    backgroundColor: string,
    pattern: 'solid' | 'gradient' | 'sparkles' | 'hearts',
    accessories: string[], // ['glasses', 'hat', 'flower', 'star']
    mood: 'happy' | 'playful' | 'chill' | 'romantic'
  },
  
  location: {
    city: string,
    state: string,
    country: string,
    coordinates: {
      lat: number,
      lng: number
    }
  },
  
  height: number,
  education: string,
  occupation: string,
  smoking: 'never' | 'socially' | 'regularly' | 'prefer-not-say',
  drinking: 'never' | 'socially' | 'regularly' | 'prefer-not-say',
  relationshipGoal: 'casual' | 'relationship' | 'marriage' | 'friendship' | 'not-sure',
  
  // Personality Expansion
  personalityType: string, // MBTI, Enneagram, etc.
  loveLanguage: string,
  zodiacSign: string,
  
  // Preferences
  preferences: {
    ageRange: { min: number, max: number },
    maxDistance: number,
    showMeGender: string[],
    dealbreakers: string[]
  },
  
  // Status & Verification
  isOnline: boolean,
  lastActiveAt: Date,
  isVerified: boolean,
  isPremium: boolean,
  premiumExpiresAt: Date,
  
  // Metadata
  isAIGenerated: boolean,
  profileCompleted: boolean,
  profileCompleteness: number, // 0-100%
  createdAt: Date,
  updatedAt: Date
}
```

**Indexes**:
- `{ email: 1 }` - Unique, for login
- `{ profileCompleted: 1, isOnline: 1 }` - For feed queries
- `{ 'location.coordinates': '2dsphere' }` - Geospatial queries
- `{ lastActiveAt: -1 }` - For active users

---

### 2. **Posts Collection**
**Purpose**: Social feed content

```typescript
{
  _id: ObjectId,
  userId: ObjectId (indexed),
  userName: string,
  userCharacter: { emoji: string, gradient: string },
  
  text: string,
  images: string[], // URLs
  
  likes: number,
  likedBy: ObjectId[], // User IDs who liked
  
  comments: [
    {
      userId: ObjectId,
      userName: string,
      text: string,
      createdAt: Date
    }
  ],
  
  visibility: 'public' | 'matches' | 'private',
  
  createdAt: Date,
  updatedAt: Date
}
```

**Indexes**:
- `{ userId: 1, createdAt: -1 }` - User's posts
- `{ createdAt: -1 }` - Feed chronological order
- `{ likedBy: 1 }` - User's liked posts

---

### 3. **Messages Collection**
**Purpose**: Direct messaging between users

```typescript
{
  _id: ObjectId,
  conversationId: ObjectId (indexed),
  
  senderId: ObjectId,
  receiverId: ObjectId,
  
  text: string,
  images: string[],
  
  read: boolean,
  readAt: Date,
  
  // NEW: Message Features
  replyTo: ObjectId, // Reference to another message
  isDeleted: boolean,
  deletedFor: ObjectId[], // User IDs who deleted
  
  createdAt: Date
}
```

**Indexes**:
- `{ conversationId: 1, createdAt: -1 }` - Conversation messages
- `{ receiverId: 1, read: 1 }` - Unread messages
- `{ senderId: 1, receiverId: 1 }` - Message search

---

### 4. **Conversations Collection**
**Purpose**: Message thread tracking

```typescript
{
  _id: ObjectId,
  participants: ObjectId[] (indexed),
  
  lastMessage: string,
  lastMessageAt: Date,
  lastMessageBy: ObjectId,
  
  unreadCount: {
    [userId: string]: number
  },
  
  // NEW: Conversation Features
  isArchived: boolean,
  archivedBy: ObjectId[],
  mutedBy: ObjectId[],
  
  createdAt: Date,
  updatedAt: Date
}
```

**Indexes**:
- `{ participants: 1, lastMessageAt: -1 }` - User's conversations
- `{ participants: 1, lastMessageAt: -1 }` - Active conversations

---

### 5. **Matches Collection**
**Purpose**: Like and match tracking

```typescript
{
  _id: ObjectId,
  userId: ObjectId (indexed),
  likedUserId: ObjectId (indexed),
  
  isMatch: boolean, // true if reciprocal
  matchedAt: Date,
  
  // NEW: Match Quality
  compatibilityScore: number, // 0-100
  commonInterests: string[],
  
  // Status
  status: 'pending' | 'matched' | 'passed' | 'blocked',
  
  createdAt: Date
}
```

**Indexes**:
- `{ userId: 1, status: 1 }` - User's matches
- `{ userId: 1, likedUserId: 1 }` - Unique constraint
- `{ likedUserId: 1, status: 1 }` - Incoming likes

---

### 6. **ProfileViews Collection**
**Purpose**: Track who viewed whose profile

```typescript
{
  _id: ObjectId,
  viewerId: ObjectId (indexed),
  viewedUserId: ObjectId (indexed),
  
  viewDuration: number, // seconds
  deviceType: string,
  
  createdAt: Date
}
```

**Indexes**:
- `{ viewedUserId: 1, createdAt: -1 }` - Who viewed my profile
- `{ viewerId: 1, createdAt: -1 }` - My viewing history

---

### 7. **Notifications Collection** (NEW)
**Purpose**: User notifications and alerts

```typescript
{
  _id: ObjectId,
  userId: ObjectId (indexed),
  
  type: 'match' | 'message' | 'like' | 'profile_view' | 'system',
  
  title: string,
  message: string,
  
  relatedUserId: ObjectId,
  relatedUserName: string,
  relatedUserAvatar: string,
  
  actionUrl: string,
  
  read: boolean,
  readAt: Date,
  
  createdAt: Date,
  expiresAt: Date
}
```

**Indexes**:
- `{ userId: 1, read: 1, createdAt: -1 }` - User's notifications
- `{ expiresAt: 1 }` - TTL index for auto-cleanup

---

### 8. **UserSettings Collection** (NEW)
**Purpose**: User preferences and privacy settings

```typescript
{
  _id: ObjectId,
  userId: ObjectId (unique, indexed),
  
  // Privacy Settings
  privacy: {
    showOnlineStatus: boolean,
    showDistance: boolean,
    showAge: boolean,
    showLastActive: boolean,
    profileVisibility: 'everyone' | 'matches' | 'hidden'
  },
  
  // Notification Preferences
  notifications: {
    email: {
      matches: boolean,
      messages: boolean,
      likes: boolean,
      promotions: boolean
    },
    push: {
      matches: boolean,
      messages: boolean,
      likes: boolean
    }
  },
  
  // Discovery Settings
  discovery: {
    pauseProfile: boolean,
    incognitoMode: boolean,
    globalMode: boolean
  },
  
  // Account Settings
  account: {
    language: string,
    timezone: string,
    emailVerified: boolean,
    phoneVerified: boolean
  },
  
  updatedAt: Date
}
```

**Indexes**:
- `{ userId: 1 }` - Unique, fast lookup

---

### 9. **Blocks Collection** (NEW)
**Purpose**: Track blocked users

```typescript
{
  _id: ObjectId,
  blockerId: ObjectId (indexed),
  blockedUserId: ObjectId (indexed),
  
  reason: string,
  
  createdAt: Date
}
```

**Indexes**:
- `{ blockerId: 1, blockedUserId: 1 }` - Unique constraint
- `{ blockedUserId: 1 }` - Check if user is blocked

---

### 10. **Reports Collection** (NEW)
**Purpose**: User reports and moderation

```typescript
{
  _id: ObjectId,
  reporterId: ObjectId (indexed),
  reportedUserId: ObjectId (indexed),
  
  category: 'spam' | 'harassment' | 'inappropriate' | 'fake' | 'other',
  description: string,
  
  status: 'pending' | 'reviewed' | 'resolved' | 'dismissed',
  
  reviewedBy: ObjectId,
  reviewedAt: Date,
  resolution: string,
  
  createdAt: Date
}
```

**Indexes**:
- `{ status: 1, createdAt: -1 }` - Pending reports
- `{ reportedUserId: 1 }` - User's report history

---

## 📈 BigQuery Tables (Analytics)

### 1. **user_events** Table
**Purpose**: Track all user actions and behaviors

```sql
CREATE TABLE analytics.user_events (
  event_id STRING,
  event_type STRING, -- 'signup', 'login', 'logout', 'profile_update'
  user_id STRING,
  user_email STRING,
  
  -- User Demographics
  user_age INT64,
  user_gender STRING,
  user_style STRING,
  user_location STRING,
  
  -- Event Details
  timestamp TIMESTAMP,
  session_id STRING,
  device_type STRING,
  platform STRING, -- 'web', 'ios', 'android'
  
  -- Additional Properties
  properties JSON,
  
  -- Metadata
  created_at TIMESTAMP
);
```

**Partitioned By**: `DATE(timestamp)`  
**Clustered By**: `user_id`, `event_type`

---

### 2. **interaction_events** Table
**Purpose**: Track user interactions (likes, messages, views)

```sql
CREATE TABLE analytics.interaction_events (
  event_id STRING,
  event_type STRING, -- 'like', 'match', 'message', 'profile_view'
  
  user_id STRING,
  target_user_id STRING,
  
  -- Interaction Context
  compatibility_score FLOAT64,
  common_interests ARRAY<STRING>,
  distance_km FLOAT64,
  
  -- Timestamps
  timestamp TIMESTAMP,
  session_id STRING,
  
  -- Result
  resulted_in_match BOOL,
  resulted_in_conversation BOOL,
  
  created_at TIMESTAMP
);
```

**Partitioned By**: `DATE(timestamp)`  
**Clustered By**: `user_id`, `event_type`

---

### 3. **match_analytics** Table
**Purpose**: Analyze match success and patterns

```sql
CREATE TABLE analytics.match_analytics (
  match_id STRING,
  
  user_1_id STRING,
  user_1_age INT64,
  user_1_gender STRING,
  user_1_style STRING,
  
  user_2_id STRING,
  user_2_age INT64,
  user_2_gender STRING,
  user_2_style STRING,
  
  -- Match Metrics
  compatibility_score FLOAT64,
  common_interests ARRAY<STRING>,
  distance_km FLOAT64,
  
  -- Engagement
  first_message_time_seconds INT64,
  total_messages INT64,
  conversation_lasted_days INT64,
  
  -- Success Indicators
  exchanged_contact BOOL,
  met_in_person BOOL,
  still_active BOOL,
  
  matched_at TIMESTAMP,
  created_at TIMESTAMP
);
```

**Partitioned By**: `DATE(matched_at)`  
**Clustered By**: `user_1_id`, `compatibility_score`

---

### 4. **engagement_metrics** Table
**Purpose**: Daily engagement and retention metrics

```sql
CREATE TABLE analytics.engagement_metrics (
  date DATE,
  
  -- User Metrics
  daily_active_users INT64,
  weekly_active_users INT64,
  monthly_active_users INT64,
  
  -- Engagement
  avg_session_duration_minutes FLOAT64,
  total_sessions INT64,
  avg_sessions_per_user FLOAT64,
  
  -- Actions
  total_likes INT64,
  total_matches INT64,
  total_messages INT64,
  total_profile_views INT64,
  total_posts INT64,
  
  -- Conversion
  signups INT64,
  profile_completions INT64,
  first_match_rate FLOAT64,
  
  created_at TIMESTAMP
);
```

**Partitioned By**: `date`

---

### 5. **post_analytics** Table
**Purpose**: Track post performance and content insights

```sql
CREATE TABLE analytics.post_analytics (
  post_id STRING,
  user_id STRING,
  
  -- Content
  post_text STRING,
  has_images BOOL,
  word_count INT64,
  sentiment_score FLOAT64,
  
  -- Performance
  total_likes INT64,
  total_comments INT64,
  total_views INT64,
  engagement_rate FLOAT64,
  
  -- Virality
  shares INT64,
  reach INT64,
  
  posted_at TIMESTAMP,
  created_at TIMESTAMP
);
```

**Partitioned By**: `DATE(posted_at)`  
**Clustered By**: `user_id`, `engagement_rate`

---

## 🔄 Data Flow & Synchronization

### MongoDB → BigQuery (Daily Sync)

**Strategy**: Batch export historical data to BigQuery for analysis

```typescript
// Run nightly at 2 AM
async function syncToBigQuery() {
  const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000);
  
  // 1. Export user events
  const userEvents = await User.find({ 
    createdAt: { $gte: yesterday } 
  });
  await bigQuery.insert('user_events', transformUserEvents(userEvents));
  
  // 2. Export interactions
  const interactions = await Match.find({ 
    createdAt: { $gte: yesterday } 
  });
  await bigQuery.insert('interaction_events', transformInteractions(interactions));
  
  // 3. Calculate daily metrics
  const metrics = await calculateDailyMetrics(yesterday);
  await bigQuery.insert('engagement_metrics', metrics);
}
```

---

## 🚀 Performance Optimizations

### MongoDB Optimizations

1. **Connection Pooling**
   - Max pool size: 10 connections
   - Reuse connections across requests

2. **Indexes**
   - All frequently queried fields indexed
   - Compound indexes for complex queries
   - 2dsphere index for location queries

3. **Query Optimization**
   - Use projections to limit returned fields
   - Implement pagination (limit/skip)
   - Use aggregation pipeline for complex queries

4. **Caching Strategy**
   - Cache user profiles (Redis/Memory)
   - Cache feed posts (5 min TTL)
   - Invalidate on updates

### BigQuery Optimizations

1. **Partitioning**
   - All tables partitioned by date
   - Reduces query costs by 90%

2. **Clustering**
   - Cluster by user_id and event_type
   - Faster filtered queries

3. **Cost Control**
   - Query only needed columns
   - Use LIMIT for exploration
   - Schedule heavy queries during off-peak

---

## 📊 Sample Queries

### MongoDB Queries

```typescript
// Get potential matches for user
const matches = await User.find({
  _id: { $ne: userId },
  profileCompleted: true,
  'location.coordinates': {
    $near: {
      $geometry: userLocation,
      $maxDistance: 50000 // 50km
    }
  },
  age: { 
    $gte: preferences.ageRange.min, 
    $lte: preferences.ageRange.max 
  }
}).limit(20);

// Get unread message count
const unreadCount = await Message.countDocuments({
  receiverId: userId,
  read: false
});

// Get user's active conversations
const conversations = await Conversation.find({
  participants: userId
}).sort({ lastMessageAt: -1 }).limit(20);
```

### BigQuery Queries

```sql
-- Match success rate by compatibility score
SELECT
  FLOOR(compatibility_score / 10) * 10 AS score_bucket,
  COUNT(*) AS total_matches,
  AVG(total_messages) AS avg_messages,
  SUM(CASE WHEN total_messages > 10 THEN 1 ELSE 0 END) / COUNT(*) AS success_rate
FROM analytics.match_analytics
WHERE matched_at >= DATE_SUB(CURRENT_DATE(), INTERVAL 30 DAY)
GROUP BY score_bucket
ORDER BY score_bucket;

-- Daily active users trend
SELECT
  date,
  daily_active_users,
  weekly_active_users,
  monthly_active_users,
  avg_session_duration_minutes
FROM analytics.engagement_metrics
WHERE date >= DATE_SUB(CURRENT_DATE(), INTERVAL 90 DAY)
ORDER BY date;

-- Most popular profile styles
SELECT
  user_style,
  COUNT(DISTINCT user_id) AS users,
  AVG(total_messages) AS avg_engagement
FROM analytics.interaction_events
JOIN analytics.user_events USING (user_id)
WHERE event_type = 'match'
GROUP BY user_style
ORDER BY users DESC;
```

---

## 🎯 Implementation Priority

### Phase 1: Core Enhancements (Week 1-2)
1. ✅ Enhanced User schema (photos, location, preferences)
2. ✅ UserSettings collection and API
3. ✅ Notifications collection
4. ✅ Blocks and Reports collections

### Phase 2: BigQuery Integration (Week 3-4)
1. ⚠️ Set up BigQuery tables
2. ⚠️ Implement event tracking
3. ⚠️ Build data pipeline
4. ⚠️ Create analytics dashboard

### Phase 3: Advanced Features (Week 5-6)
1. ⚠️ Photo upload system
2. ⚠️ Matching algorithm
3. ⚠️ Real-time notifications
4. ⚠️ User analytics dashboard

---

## 🔒 Data Security & Privacy

### MongoDB Security
- ✅ IP whitelist enabled
- ✅ TLS/SSL encryption
- ✅ Role-based access control
- ⚠️ Regular backups (daily)
- ⚠️ Data encryption at rest

### BigQuery Security
- ⚠️ Dataset-level permissions
- ⚠️ Column-level security for PII
- ⚠️ Audit logs enabled
- ⚠️ Data retention policies

### GDPR Compliance
- ⚠️ User data export API
- ⚠️ Right to be forgotten (delete account)
- ⚠️ Consent management
- ⚠️ Data anonymization for analytics

---

## 📈 Scaling Considerations

### When to Scale MongoDB
- > 100,000 active users
- > 10 million documents
- > 1000 queries/second

**Scaling Options**:
1. Upgrade MongoDB Atlas tier
2. Enable sharding
3. Add read replicas
4. Implement caching layer

### When to Scale BigQuery
- > 1TB of data
- > 100 concurrent queries
- Complex queries taking > 10 seconds

**Scaling Options**:
1. Optimize queries (clustering, partitioning)
2. Use materialized views
3. Implement query caching
4. Schedule heavy analytics

---

## 💰 Cost Estimates

### MongoDB Atlas (Free → Paid)
- **M0 (Free)**: 512MB, perfect for < 1000 users
- **M10 ($57/month)**: 10GB, up to 10,000 users
- **M20 ($134/month)**: 20GB, up to 50,000 users

### BigQuery (Pay-as-you-go)
- **Storage**: $0.02/GB/month
- **Queries**: $5/TB processed
- **Streaming Inserts**: $0.05/GB

**Estimated Costs** (10,000 active users):
- Storage: ~5GB = $0.10/month
- Queries: ~100GB/month = $0.50/month
- **Total: < $1/month** 🎉

---

## 🎉 Summary

| Feature | MongoDB | BigQuery |
|---------|---------|----------|
| **Purpose** | Real-time operations | Historical analytics |
| **Data Type** | Transactional (OLTP) | Analytical (OLAP) |
| **Query Speed** | Milliseconds | Seconds |
| **Data Volume** | < 100GB | Unlimited |
| **Cost** | Fixed monthly | Pay per query |
| **Best For** | User profiles, messaging | Trends, insights, BI |

**Recommendation**: Use both databases for optimal performance and cost efficiency! 🚀

