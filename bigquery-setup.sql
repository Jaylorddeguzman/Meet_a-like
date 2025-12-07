-- CharacterMatch Dating App - BigQuery Table Setup
-- Run these queries in your BigQuery console to create analytics tables

-- 1. CREATE DATASET
CREATE SCHEMA IF NOT EXISTS `charactermatch_analytics`
OPTIONS(
  location="US",
  description="Analytics data for CharacterMatch dating app"
);

-- 2. USER EVENTS TABLE
CREATE TABLE IF NOT EXISTS `charactermatch_analytics.user_events` (
  event_id STRING NOT NULL,
  event_type STRING NOT NULL,
  user_id STRING NOT NULL,
  user_email STRING,
  user_age INT64,
  user_gender STRING,
  user_style STRING,
  user_location STRING,
  timestamp TIMESTAMP NOT NULL,
  session_id STRING,
  device_type STRING,
  platform STRING,
  properties JSON,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP()
)
PARTITION BY DATE(timestamp)
CLUSTER BY user_id, event_type
OPTIONS(
  description="Tracks all user events: signup, login, profile updates"
);

-- 3. INTERACTION EVENTS TABLE
CREATE TABLE IF NOT EXISTS `charactermatch_analytics.interaction_events` (
  event_id STRING NOT NULL,
  event_type STRING NOT NULL,
  user_id STRING NOT NULL,
  target_user_id STRING NOT NULL,
  compatibility_score FLOAT64,
  common_interests ARRAY<STRING>,
  distance_km FLOAT64,
  timestamp TIMESTAMP NOT NULL,
  session_id STRING,
  resulted_in_match BOOL DEFAULT FALSE,
  resulted_in_conversation BOOL DEFAULT FALSE,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP()
)
PARTITION BY DATE(timestamp)
CLUSTER BY user_id, event_type
OPTIONS(
  description="Tracks user interactions: likes, matches, messages, profile views"
);

-- 4. MATCH ANALYTICS TABLE
CREATE TABLE IF NOT EXISTS `charactermatch_analytics.match_analytics` (
  match_id STRING NOT NULL,
  user_1_id STRING NOT NULL,
  user_1_age INT64,
  user_1_gender STRING,
  user_1_style STRING,
  user_2_id STRING NOT NULL,
  user_2_age INT64,
  user_2_gender STRING,
  user_2_style STRING,
  compatibility_score FLOAT64,
  common_interests ARRAY<STRING>,
  distance_km FLOAT64,
  first_message_time_seconds INT64,
  total_messages INT64 DEFAULT 0,
  conversation_lasted_days INT64 DEFAULT 0,
  exchanged_contact BOOL DEFAULT FALSE,
  met_in_person BOOL DEFAULT FALSE,
  still_active BOOL DEFAULT TRUE,
  matched_at TIMESTAMP NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP()
)
PARTITION BY DATE(matched_at)
CLUSTER BY user_1_id, compatibility_score
OPTIONS(
  description="Detailed match analytics for success rate analysis"
);

-- 5. POST ANALYTICS TABLE
CREATE TABLE IF NOT EXISTS `charactermatch_analytics.post_analytics` (
  post_id STRING NOT NULL,
  user_id STRING NOT NULL,
  post_text STRING,
  has_images BOOL DEFAULT FALSE,
  word_count INT64,
  sentiment_score FLOAT64,
  total_likes INT64 DEFAULT 0,
  total_comments INT64 DEFAULT 0,
  total_views INT64 DEFAULT 0,
  engagement_rate FLOAT64 DEFAULT 0.0,
  shares INT64 DEFAULT 0,
  reach INT64 DEFAULT 0,
  posted_at TIMESTAMP NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP()
)
PARTITION BY DATE(posted_at)
CLUSTER BY user_id, engagement_rate
OPTIONS(
  description="Post performance and engagement tracking"
);

-- 6. ENGAGEMENT METRICS TABLE
CREATE TABLE IF NOT EXISTS `charactermatch_analytics.engagement_metrics` (
  date DATE NOT NULL,
  daily_active_users INT64 DEFAULT 0,
  weekly_active_users INT64 DEFAULT 0,
  monthly_active_users INT64 DEFAULT 0,
  avg_session_duration_minutes FLOAT64 DEFAULT 0.0,
  total_sessions INT64 DEFAULT 0,
  avg_sessions_per_user FLOAT64 DEFAULT 0.0,
  total_likes INT64 DEFAULT 0,
  total_matches INT64 DEFAULT 0,
  total_messages INT64 DEFAULT 0,
  total_profile_views INT64 DEFAULT 0,
  total_posts INT64 DEFAULT 0,
  signups INT64 DEFAULT 0,
  profile_completions INT64 DEFAULT 0,
  first_match_rate FLOAT64 DEFAULT 0.0,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP()
)
PARTITION BY date
OPTIONS(
  description="Daily aggregated engagement and activity metrics"
);

-- VERIFY TABLES CREATED
SELECT 
  table_name,
  ddl
FROM 
  `charactermatch_analytics.INFORMATION_SCHEMA.TABLES`
WHERE 
  table_type = 'BASE TABLE'
ORDER BY 
  table_name;

-- SAMPLE QUERIES FOR TESTING

-- 1. User Growth Over Time
SELECT 
  DATE(timestamp) as signup_date,
  COUNT(*) as new_users,
  COUNT(DISTINCT user_gender) as gender_diversity,
  COUNT(DISTINCT user_style) as style_diversity
FROM `charactermatch_analytics.user_events`
WHERE event_type = 'signup'
GROUP BY signup_date
ORDER BY signup_date DESC
LIMIT 30;

-- 2. Match Success Rate by Compatibility Score
SELECT
  FLOOR(compatibility_score / 10) * 10 AS score_range,
  COUNT(*) AS total_matches,
  AVG(total_messages) AS avg_messages,
  COUNTIF(total_messages > 10) AS successful_matches,
  ROUND(COUNTIF(total_messages > 10) / COUNT(*) * 100, 2) AS success_rate_pct
FROM `charactermatch_analytics.match_analytics`
WHERE matched_at >= TIMESTAMP_SUB(CURRENT_TIMESTAMP(), INTERVAL 30 DAY)
GROUP BY score_range
ORDER BY score_range;

-- 3. Most Active Users
SELECT
  user_id,
  COUNT(*) as total_interactions,
  COUNTIF(event_type = 'profile_view') as views,
  COUNTIF(event_type = 'like') as likes,
  COUNTIF(event_type = 'message') as messages
FROM `charactermatch_analytics.interaction_events`
WHERE timestamp >= TIMESTAMP_SUB(CURRENT_TIMESTAMP(), INTERVAL 7 DAY)
GROUP BY user_id
ORDER BY total_interactions DESC
LIMIT 20;

-- 4. Popular Profile Styles
SELECT
  user_style,
  COUNT(DISTINCT user_id) as total_users,
  AVG(compatibility_score) as avg_compatibility,
  COUNTIF(resulted_in_match) as total_matches
FROM `charactermatch_analytics.interaction_events`
WHERE event_type = 'like'
  AND timestamp >= TIMESTAMP_SUB(CURRENT_TIMESTAMP(), INTERVAL 30 DAY)
GROUP BY user_style
ORDER BY total_users DESC;

-- 5. Daily Engagement Trend
SELECT
  date,
  daily_active_users,
  total_matches,
  total_messages,
  ROUND(first_match_rate * 100, 2) as first_match_rate_pct
FROM `charactermatch_analytics.engagement_metrics`
WHERE date >= DATE_SUB(CURRENT_DATE(), INTERVAL 30 DAY)
ORDER BY date DESC;

-- 6. Post Engagement Analysis
SELECT
  DATE(posted_at) as post_date,
  COUNT(*) as total_posts,
  AVG(total_likes) as avg_likes,
  AVG(total_comments) as avg_comments,
  AVG(engagement_rate) as avg_engagement_rate
FROM `charactermatch_analytics.post_analytics`
WHERE posted_at >= TIMESTAMP_SUB(CURRENT_TIMESTAMP(), INTERVAL 30 DAY)
GROUP BY post_date
ORDER BY post_date DESC;

-- DONE! 🎉
-- Your BigQuery analytics tables are ready to use!
