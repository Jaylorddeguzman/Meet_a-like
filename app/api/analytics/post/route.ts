import { NextResponse } from 'next/server';
import { logPostCreated } from '@/lib/bigquery';

export async function POST(request: Request) {
  try {
    const postData = await request.json();
    
    // Log to BigQuery (mock for now)
    await logPostCreated(postData);
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error logging post:', error);
    return NextResponse.json({ error: 'Failed to log post' }, { status: 500 });
  }
}
