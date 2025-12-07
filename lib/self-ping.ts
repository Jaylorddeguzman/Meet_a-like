import cron from 'node-cron';

// Self-ping function to keep Render.com service alive
export function initializeSelfPing() {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || process.env.NEXTAUTH_URL;
  
  if (!appUrl) {
    console.warn('⚠️ No app URL configured for self-ping. Service may sleep on Render.');
    return;
  }

  // Ping every 14 minutes to prevent Render's free tier from sleeping (sleeps after 15 min of inactivity)
  cron.schedule('*/14 * * * *', async () => {
    try {
      const pingUrl = `${appUrl}/api/cron/ping`;
      console.log(`🏓 Self-ping started at ${new Date().toISOString()}`);
      
      const response = await fetch(pingUrl, {
        method: 'GET',
        headers: {
          'User-Agent': 'SelfPing/1.0'
        }
      });

      if (response.ok) {
        const data = await response.json();
        console.log(`✅ Self-ping successful:`, data);
      } else {
        console.error(`❌ Self-ping failed with status: ${response.status}`);
      }
    } catch (error) {
      console.error('❌ Self-ping error:', error);
    }
  });

  console.log('✅ Self-ping service initialized - will ping every 14 minutes');
}
