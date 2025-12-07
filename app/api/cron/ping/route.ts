import { NextResponse } from 'next/server';

// Simple ping endpoint to prevent Render.com from sleeping
export async function GET() {
  return NextResponse.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    message: 'Service is alive'
  });
}
