import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    // Simple health check endpoint
    return NextResponse.json({ 
      status: 'ok',
      timestamp: new Date().toISOString(),
      message: 'Server is awake'
    });
  } catch (error) {
    return NextResponse.json({ 
      status: 'error',
      message: 'Health check failed' 
    }, { status: 500 });
  }
}
