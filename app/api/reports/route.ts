import { NextRequest, NextResponse } from 'next/server';
import connectDB, { Report } from '@/lib/mongodb';
import { getServerSession } from 'next-auth';

// GET - Get reports (for admin/moderation)
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession();
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status') || 'pending';
    const reportedUserId = searchParams.get('reportedUserId');

    const query: any = { status };
    if (reportedUserId) {
      query.reportedUserId = reportedUserId;
    }

    const reports = await Report.find(query)
      .sort({ createdAt: -1 })
      .limit(100);

    return NextResponse.json(reports);
  } catch (error) {
    console.error('Error fetching reports:', error);
    return NextResponse.json(
      { error: 'Failed to fetch reports' },
      { status: 500 }
    );
  }
}

// POST - Submit a report
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession();
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    const body = await request.json();
    const {
      reporterId,
      reportedUserId,
      category,
      description
    } = body;

    if (!reporterId || !reportedUserId || !category) {
      return NextResponse.json(
        { error: 'Reporter ID, reported user ID, and category required' },
        { status: 400 }
      );
    }

    const report = await Report.create({
      reporterId,
      reportedUserId,
      category,
      description,
      status: 'pending'
    });

    // TODO: Send notification to moderation team

    return NextResponse.json(report, { status: 201 });
  } catch (error) {
    console.error('Error submitting report:', error);
    return NextResponse.json(
      { error: 'Failed to submit report' },
      { status: 500 }
    );
  }
}

// PATCH - Update report status (for moderation)
export async function PATCH(request: NextRequest) {
  try {
    const session = await getServerSession();
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    const body = await request.json();
    const { reportId, status, resolution, reviewedBy } = body;

    if (!reportId || !status) {
      return NextResponse.json(
        { error: 'Report ID and status required' },
        { status: 400 }
      );
    }

    const report = await Report.findByIdAndUpdate(
      reportId,
      {
        status,
        resolution,
        reviewedBy,
        reviewedAt: new Date()
      },
      { new: true }
    );

    return NextResponse.json(report);
  } catch (error) {
    console.error('Error updating report:', error);
    return NextResponse.json(
      { error: 'Failed to update report' },
      { status: 500 }
    );
  }
}
