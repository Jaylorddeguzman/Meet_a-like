import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import connectDB, { Report as ReportModel } from '@/lib/mongodb';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession();
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const isAdmin = session.user.email === 'admin@example.com';
    
    if (!isAdmin) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    await connectDB();

    const reports = await ReportModel.find()
      .sort({ createdAt: -1 })
      .limit(100)
      .lean();

    const formattedReports = reports.map((report: any) => ({
      id: report._id.toString(),
      reporterId: report.reporterId,
      reporterName: report.reporterName || 'Anonymous',
      reportedUserId: report.reportedUserId,
      reportedUserName: report.reportedUserName,
      reportedPostId: report.reportedPostId,
      type: report.type,
      reason: report.reason,
      description: report.description || '',
      status: report.status || 'pending',
      createdAt: report.createdAt
    }));

    return NextResponse.json({ reports: formattedReports });
  } catch (error) {
    console.error('Error fetching reports:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const session = await getServerSession();
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const isAdmin = session.user.email === 'admin@example.com';
    
    if (!isAdmin) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { reportId, action } = await request.json();

    if (!reportId || !action) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    await connectDB();

    const status = action === 'approve' ? 'approved' : 'rejected';

    await ReportModel.findByIdAndUpdate(reportId, { 
      status,
      resolvedAt: new Date()
    });

    return NextResponse.json({ 
      success: true,
      message: `Report ${status} successfully` 
    });
  } catch (error) {
    console.error('Error updating report:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
