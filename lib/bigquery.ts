// BigQuery Analytics Integration for CharacterMatch Dating App
// Tracks user behavior, interactions, and engagement metrics

const projectId = process.env.BIGQUERY_PROJECT_ID || '';
const datasetId = process.env.BIGQUERY_DATASET || 'charactermatch_analytics';

let bigQueryClient: any = null;

// Only import and initialize BigQuery on the server side
if (typeof window === 'undefined' && projectId) {
  import('@google-cloud/bigquery').then(({ BigQuery }) => {
    bigQueryClient = new BigQuery({ projectId });
    console.log('✅ BigQuery client initialized');
  }).catch(() => {
    console.warn('⚠️ BigQuery import failed - analytics logging disabled');
  });
} else if (typeof window === 'undefined') {
  console.warn('⚠️ BigQuery not configured - analytics in mock mode');
}

// Helper to insert data
async function insertRows(tableName: string, rows: any[]) {
  if (!bigQueryClient) {
    console.log(`📊 [Mock Analytics] ${tableName}:`, rows);
    return;
  }

  try {
    await bigQueryClient.dataset(datasetId).table(tableName).insert(rows);
    console.log(`✅ Inserted ${rows.length} rows into ${tableName}`);
  } catch (error) {
    console.error(`❌ BigQuery insert error (${tableName}):`, error);
  }
}

// ============================================
// USER EVENTS TRACKING
// ============================================

export async function logUserSignup(userData: {
  userId: string;
  email: string;
  age: number;
  gender: string;
  style: string;
  location?: string;
}) {
  const row = {
    event_id: `signup_${userData.userId}_${Date.now()}`,
    event_type: 'signup',
    user_id: userData.userId,
    user_email: userData.email,
    user_age: userData.age,
    user_gender: userData.gender,
    user_style: userData.style,
    user_location: userData.location || 'unknown',
    timestamp: new Date().toISOString(),
    session_id: `session_${Date.now()}`,
    device_type: 'web',
    platform: 'web',
    properties: JSON.stringify({ source: 'google_oauth' }),
    created_at: new Date().toISOString(),
  };

  await insertRows('user_events', [row]);
}

export async function logUserLogin(userData: {
  userId: string;
  email: string;
}) {
  const row = {
    event_id: `login_${userData.userId}_${Date.now()}`,
    event_type: 'login',
    user_id: userData.userId,
    user_email: userData.email,
    timestamp: new Date().toISOString(),
    session_id: `session_${Date.now()}`,
    device_type: 'web',
    platform: 'web',
    created_at: new Date().toISOString(),
  };

  await insertRows('user_events', [row]);
}

export async function logProfileUpdate(userData: {
  userId: string;
  fieldsUpdated: string[];
}) {
  const row = {
    event_id: `profile_update_${userData.userId}_${Date.now()}`,
    event_type: 'profile_update',
    user_id: userData.userId,
    timestamp: new Date().toISOString(),
    properties: JSON.stringify({ fields: userData.fieldsUpdated }),
    created_at: new Date().toISOString(),
  };

  await insertRows('user_events', [row]);
}

// ============================================
// INTERACTION EVENTS TRACKING
// ============================================

export async function logProfileView(viewData: {
  viewerId: string;
  viewedUserId: string;
  viewDuration?: number;
  compatibilityScore?: number;
  distance?: number;
}) {
  const row = {
    event_id: `view_${viewData.viewerId}_${viewData.viewedUserId}_${Date.now()}`,
    event_type: 'profile_view',
    user_id: viewData.viewerId,
    target_user_id: viewData.viewedUserId,
    compatibility_score: viewData.compatibilityScore || null,
    distance_km: viewData.distance || null,
    timestamp: new Date().toISOString(),
    session_id: `session_${Date.now()}`,
    resulted_in_match: false,
    resulted_in_conversation: false,
    created_at: new Date().toISOString(),
  };

  await insertRows('interaction_events', [row]);
}

export async function logLike(likeData: {
  userId: string;
  likedUserId: string;
  compatibilityScore?: number;
  commonInterests?: string[];
  distance?: number;
}) {
  const row = {
    event_id: `like_${likeData.userId}_${likeData.likedUserId}_${Date.now()}`,
    event_type: 'like',
    user_id: likeData.userId,
    target_user_id: likeData.likedUserId,
    compatibility_score: likeData.compatibilityScore || null,
    common_interests: likeData.commonInterests || [],
    distance_km: likeData.distance || null,
    timestamp: new Date().toISOString(),
    session_id: `session_${Date.now()}`,
    resulted_in_match: false, // Will be updated if it becomes a match
    resulted_in_conversation: false,
    created_at: new Date().toISOString(),
  };

  await insertRows('interaction_events', [row]);
}

export async function logMatch(matchData: {
  user1Id: string;
  user2Id: string;
  compatibilityScore?: number;
  commonInterests?: string[];
  distance?: number;
}) {
  const row = {
    event_id: `match_${matchData.user1Id}_${matchData.user2Id}_${Date.now()}`,
    event_type: 'match',
    user_id: matchData.user1Id,
    target_user_id: matchData.user2Id,
    compatibility_score: matchData.compatibilityScore || null,
    common_interests: matchData.commonInterests || [],
    distance_km: matchData.distance || null,
    timestamp: new Date().toISOString(),
    session_id: `session_${Date.now()}`,
    resulted_in_match: true,
    resulted_in_conversation: false,
    created_at: new Date().toISOString(),
  };

  await insertRows('interaction_events', [row]);
}

export async function logMessage(messageData: {
  senderId: string;
  receiverId: string;
  isFirstMessage?: boolean;
}) {
  const row = {
    event_id: `message_${messageData.senderId}_${messageData.receiverId}_${Date.now()}`,
    event_type: 'message',
    user_id: messageData.senderId,
    target_user_id: messageData.receiverId,
    timestamp: new Date().toISOString(),
    session_id: `session_${Date.now()}`,
    resulted_in_match: false,
    resulted_in_conversation: true,
    created_at: new Date().toISOString(),
  };

  await insertRows('interaction_events', [row]);
}

// ============================================
// POST ANALYTICS TRACKING
// ============================================

export async function logPostCreated(postData: {
  postId: string;
  userId: string;
  text: string;
  hasImages: boolean;
  wordCount: number;
}) {
  const row = {
    post_id: postData.postId,
    user_id: postData.userId,
    post_text: postData.text.substring(0, 500), // Limit for BigQuery
    has_images: postData.hasImages,
    word_count: postData.wordCount,
    sentiment_score: null, // Can be added later with sentiment analysis
    total_likes: 0,
    total_comments: 0,
    total_views: 0,
    engagement_rate: 0,
    shares: 0,
    reach: 0,
    posted_at: new Date().toISOString(),
    created_at: new Date().toISOString(),
  };

  await insertRows('post_analytics', [row]);
}

export async function updatePostEngagement(postData: {
  postId: string;
  totalLikes: number;
  totalComments: number;
  totalViews: number;
}) {
  // Note: BigQuery doesn't support updates easily
  // For now, we'll insert a new row with updated stats
  // In production, you'd use merge or scheduled aggregation queries
  console.log('📊 [Mock] Post engagement update:', postData);
}

// ============================================
// MATCH ANALYTICS TRACKING
// ============================================

export async function logMatchAnalytics(matchData: {
  matchId: string;
  user1Id: string;
  user1Age: number;
  user1Gender: string;
  user1Style: string;
  user2Id: string;
  user2Age: number;
  user2Gender: string;
  user2Style: string;
  compatibilityScore: number;
  commonInterests: string[];
  distance: number;
}) {
  const row = {
    match_id: matchData.matchId,
    user_1_id: matchData.user1Id,
    user_1_age: matchData.user1Age,
    user_1_gender: matchData.user1Gender,
    user_1_style: matchData.user1Style,
    user_2_id: matchData.user2Id,
    user_2_age: matchData.user2Age,
    user_2_gender: matchData.user2Gender,
    user_2_style: matchData.user2Style,
    compatibility_score: matchData.compatibilityScore,
    common_interests: matchData.commonInterests,
    distance_km: matchData.distance,
    first_message_time_seconds: null,
    total_messages: 0,
    conversation_lasted_days: 0,
    exchanged_contact: false,
    met_in_person: false,
    still_active: true,
    matched_at: new Date().toISOString(),
    created_at: new Date().toISOString(),
  };

  await insertRows('match_analytics', [row]);
}

// ============================================
// DAILY ENGAGEMENT METRICS
// ============================================

export async function logDailyMetrics(metrics: {
  date: string;
  dailyActiveUsers: number;
  weeklyActiveUsers: number;
  monthlyActiveUsers: number;
  avgSessionDuration: number;
  totalSessions: number;
  avgSessionsPerUser: number;
  totalLikes: number;
  totalMatches: number;
  totalMessages: number;
  totalProfileViews: number;
  totalPosts: number;
  signups: number;
  profileCompletions: number;
  firstMatchRate: number;
}) {
  const row = {
    date: metrics.date,
    daily_active_users: metrics.dailyActiveUsers,
    weekly_active_users: metrics.weeklyActiveUsers,
    monthly_active_users: metrics.monthlyActiveUsers,
    avg_session_duration_minutes: metrics.avgSessionDuration,
    total_sessions: metrics.totalSessions,
    avg_sessions_per_user: metrics.avgSessionsPerUser,
    total_likes: metrics.totalLikes,
    total_matches: metrics.totalMatches,
    total_messages: metrics.totalMessages,
    total_profile_views: metrics.totalProfileViews,
    total_posts: metrics.totalPosts,
    signups: metrics.signups,
    profile_completions: metrics.profileCompletions,
    first_match_rate: metrics.firstMatchRate,
    created_at: new Date().toISOString(),
  };

  await insertRows('engagement_metrics', [row]);
}

export default bigQueryClient;
