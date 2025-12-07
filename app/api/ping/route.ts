import { NextRequest, NextResponse } from 'next/server';

// This endpoint will be called by external cron services to keep the app awake
export async function GET(request: NextRequest) {
  try {
    // Verify the request is from a cron service (optional security)
    const authHeader = request.headers.get('authorization');
    const cronSecret = process.env.CRON_SECRET;
    
    // If CRON_SECRET is set, verify it matches
    if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json({ 
        error: 'Unauthorized' 
      }, { status: 401 });
    }

    // Perform a simple wake-up action
    const response = await fetch(`${process.env.NEXTAUTH_URL}/api/health`);
    const data = await response.json();

    return NextResponse.json({ 
      success: true,
      message: 'Ping successful',
      health: data,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Ping error:', error);
    return NextResponse.json({ 
      success: false,
      error: 'Ping failed' 
    }, { status: 500 });
  }
}
