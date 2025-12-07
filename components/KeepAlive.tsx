'use client';

import { useEffect } from 'react';

/**
 * KeepAlive component pings the server periodically to prevent Render.com from sleeping
 * This runs in the browser and keeps the app active while users are browsing
 */
const KeepAlive: React.FC = () => {
  useEffect(() => {
    // Only run in production
    if (process.env.NODE_ENV !== 'production') {
      return;
    }

    // Ping every 5 minutes (300000ms)
    const interval = setInterval(async () => {
      try {
        const response = await fetch('/api/health');
        const data = await response.json();
        console.log('Keep-alive ping:', data);
      } catch (error) {
        console.error('Keep-alive ping failed:', error);
      }
    }, 300000); // 5 minutes

    // Initial ping after 1 minute
    const timeout = setTimeout(async () => {
      try {
        await fetch('/api/health');
      } catch (error) {
        console.error('Initial keep-alive ping failed:', error);
      }
    }, 60000);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, []);

  return null; // This component doesn't render anything
};

export default KeepAlive;
