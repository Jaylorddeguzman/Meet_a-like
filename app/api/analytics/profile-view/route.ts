import { NextResponse } from 'next/server';
import { logProfileView } from '@/lib/bigquery';

export async function POST(request: Request) {
  try {
    const { viewerId, profileId } = await request.json();
    
    // Log to BigQuery (mock for now)
    await logProfileView(viewerId, profileId);
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error logging profile view:', error);
    return NextResponse.json({ error: 'Failed to log profile view' }, { status: 500 });
  }
}
