import { NextResponse } from 'next/server';
import { logUserSignup } from '@/lib/bigquery';

export async function POST(request: Request) {
  try {
    const userData = await request.json();
    
    // Log to BigQuery (mock for now)
    await logUserSignup(userData);
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error logging signup:', error);
    return NextResponse.json({ error: 'Failed to log signup' }, { status: 500 });
  }
}
