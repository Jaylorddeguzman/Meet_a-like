// BigQuery configuration will be provided later
// Note: BigQuery client is only initialized server-side to avoid bundling issues
const projectId = process.env.BIGQUERY_PROJECT_ID || '';
const datasetId = process.env.BIGQUERY_DATASET || 'analytics';

let bigQueryClient: any = null;

// Only import and initialize BigQuery on the server side
if (typeof window === 'undefined' && projectId) {
  // Dynamic import to avoid bundling BigQuery in client code
  import('@google-cloud/bigquery').then(({ BigQuery }) => {
    bigQueryClient = new BigQuery({
      projectId,
    });
    console.log('✅ BigQuery client initialized');
  }).catch(() => {
    console.warn('⚠️ BigQuery import failed - analytics logging disabled');
  });
} else if (typeof window === 'undefined') {
  console.warn('⚠️ BigQuery not configured - analytics logging disabled');
}

// TODO: Implement analytics logging functions when BigQuery connection is provided
export async function logUserSignup(userData: any) {
  if (!bigQueryClient) {
    console.log('📊 [Mock] User signup logged:', userData.name);
    return;
  }

  // TODO: Insert row into BigQuery users_events table
  /*
  const table = bigQueryClient.dataset(datasetId).table('user_events');
  await table.insert([{
    event_type: 'signup',
    user_id: userData.id,
    timestamp: new Date().toISOString(),
    properties: JSON.stringify(userData)
  }]);
  */
}

export async function logPostCreated(postData: any) {
  if (!bigQueryClient) {
    console.log('📊 [Mock] Post created logged:', postData.text.substring(0, 30));
    return;
  }

  // TODO: Insert row into BigQuery post_events table
  /*
  const table = bigQueryClient.dataset(datasetId).table('post_events');
  await table.insert([{
    event_type: 'post_created',
    user_id: postData.userId,
    post_id: postData.id,
    timestamp: new Date().toISOString(),
    properties: JSON.stringify(postData)
  }]);
  */
}

export async function logProfileView(viewerId: number, profileId: number) {
  if (!bigQueryClient) {
    console.log(`📊 [Mock] Profile view logged: ${viewerId} viewed ${profileId}`);
    return;
  }

  // TODO: Insert row into BigQuery interaction_events table
  /*
  const table = bigQueryClient.dataset(datasetId).table('interaction_events');
  await table.insert([{
    event_type: 'profile_view',
    viewer_id: viewerId,
    profile_id: profileId,
    timestamp: new Date().toISOString()
  }]);
  */
}

export default bigQueryClient;
