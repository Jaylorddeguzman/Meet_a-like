import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import connectDB, { User, Post, Match, Report as ReportModel } from '@/lib/mongodb';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession();
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // TODO: Implement proper admin role checking
    // For now, check if email matches admin email
    // You should implement a proper role system in your User model
    const isAdmin = session.user.email === 'admin@example.com';
    
    if (!isAdmin) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    await connectDB();

    // Get statistics
    const totalUsers = await User.countDocuments();
    const activeUsers = await User.countDocuments({ 
      lastActiveAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) }
    });
    const suspendedUsers = await User.countDocuments({ status: 'suspended' });
    
    const totalReports = await ReportModel.countDocuments();
    const pendingReports = await ReportModel.countDocuments({ status: 'pending' });
    
    const totalPosts = await Post.countDocuments();
    const flaggedPosts = await Post.countDocuments({ reportCount: { $gt: 0 } });

    return NextResponse.json({
      totalUsers,
      activeUsers,
      suspendedUsers,
      totalReports,
      pendingReports,
      totalPosts,
      flaggedPosts
    });
  } catch (error) {
    console.error('Error fetching admin stats:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
