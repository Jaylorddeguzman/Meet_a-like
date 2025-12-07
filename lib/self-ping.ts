// Server-side self-ping to keep Render.com from sleeping
// Uses setInterval instead of node-cron for reliability

let pingInterval: NodeJS.Timeout | null = null;

export function initializeSelfPing() {
  // Only run in production
  if (process.env.NODE_ENV !== 'production') {
    console.log('Self-ping disabled in development');
    return;
  }

  const appUrl = process.env.NEXTAUTH_URL || process.env.NEXT_PUBLIC_APP_URL;
  
  if (!appUrl) {
    console.warn('⚠️ No app URL configured for self-ping. Service may sleep on Render.');
    return;
  }

  // Clear any existing interval
  if (pingInterval) {
    clearInterval(pingInterval);
  }

  console.log('✅ Initializing self-ping service for:', appUrl);

  // Ping every 10 minutes (600000ms) to prevent Render's free tier from sleeping
  // Render sleeps after 15 minutes of inactivity
  pingInterval = setInterval(async () => {
    try {
      console.log(`🏓 Self-ping started at ${new Date().toISOString()}`);
      
      const response = await fetch(`${appUrl}/api/health`, {
        method: 'GET',
        headers: {
          'User-Agent': 'Self-Ping-Service/1.0',
          'X-Ping-Source': 'internal'
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        console.log('✅ Self-ping successful:', data.timestamp);
      } else {
        console.error('❌ Self-ping failed with status:', response.status);
      }
    } catch (error) {
      console.error('❌ Self-ping error:', error);
    }
  }, 600000); // 10 minutes

  // Initial ping after 2 minutes to confirm setup
  setTimeout(async () => {
    try {
      console.log('🏓 Sending initial self-ping...');
      const response = await fetch(`${appUrl}/api/health`, {
        method: 'GET',
        headers: {
          'User-Agent': 'Self-Ping-Service/1.0',
          'X-Ping-Source': 'internal-initial'
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        console.log('✅ Initial self-ping successful:', data.timestamp);
      }
    } catch (error) {
      console.error('❌ Initial self-ping failed:', error);
    }
  }, 120000); // 2 minutes

  console.log('✅ Self-ping service started (pinging every 10 minutes)');
}

export function stopSelfPing() {
  if (pingInterval) {
    clearInterval(pingInterval);
    pingInterval = null;
    console.log('Self-ping service stopped');
  }
}

// Auto-start when module is loaded on server in production
if (typeof window === 'undefined' && process.env.NODE_ENV === 'production') {
  initializeSelfPing();
}
