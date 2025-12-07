// instrumentation.ts is called once when the Next.js server starts
// This is the proper place to initialize server-side services

export async function register() {
  // Only run on server
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    // Initialize self-ping service to keep Render.com from sleeping
    const { initializeSelfPing } = await import('./lib/self-ping');
    initializeSelfPing();
  }
}
