'use client';

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import {
  Shield,
  Users,
  Flag,
  FileText,
  Ban,
  CheckCircle,
  XCircle,
  Eye,
  Trash2,
  Search,
  Filter,
  AlertTriangle,
  BarChart3
} from 'lucide-react';

type TabType = 'overview' | 'users' | 'reports' | 'posts';
type ReportStatus = 'pending' | 'approved' | 'rejected';
type UserStatus = 'active' | 'suspended' | 'banned';

interface Report {
  id: string;
  reporterId: string;
  reporterName: string;
  reportedUserId?: string;
  reportedUserName?: string;
  reportedPostId?: string;
  type: 'user' | 'post' | 'message';
  reason: string;
  description: string;
  status: ReportStatus;
  createdAt: Date;
}

interface AdminUser {
  id: string;
  name: string;
  email: string;
  status: UserStatus;
  reportCount: number;
  joinedAt: Date;
  lastActive: Date;
}

interface AdminPost {
  id: string;
  userId: string;
  userName: string;
  content: string;
  reportCount: number;
  createdAt: Date;
}

interface Stats {
  totalUsers: number;
  activeUsers: number;
  suspendedUsers: number;
  totalReports: number;
  pendingReports: number;
  totalPosts: number;
  flaggedPosts: number;
}

const AdminModerationPanel: React.FC = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  // Data states
  const [stats, setStats] = useState<Stats>({
    totalUsers: 0,
    activeUsers: 0,
    suspendedUsers: 0,
    totalReports: 0,
    pendingReports: 0,
    totalPosts: 0,
    flaggedPosts: 0
  });
  const [reports, setReports] = useState<Report[]>([]);
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [posts, setPosts] = useState<AdminPost[]>([]);

  // Check if user is admin (you'll need to implement proper admin role checking)
  const isAdmin = session?.user?.email === 'admin@example.com'; // Replace with proper admin check

  useEffect(() => {
    if (status === 'unauthenticated' || !isAdmin) {
      router.push('/');
    } else if (status === 'authenticated') {
      fetchData();
    }
  }, [status, isAdmin, router]);

  const fetchData = async () => {
    setLoading(true);
    try {
      // Fetch stats
      const statsResponse = await fetch('/api/admin/stats');
      if (statsResponse.ok) {
        const statsData = await statsResponse.json();
        setStats(statsData);
      }

      // Fetch reports
      const reportsResponse = await fetch('/api/admin/reports');
      if (reportsResponse.ok) {
        const reportsData = await reportsResponse.json();
        setReports(reportsData.reports || []);
      }

      // Fetch users
      const usersResponse = await fetch('/api/admin/users');
      if (usersResponse.ok) {
        const usersData = await usersResponse.json();
        setUsers(usersData.users || []);
      }

      // Fetch flagged posts
      const postsResponse = await fetch('/api/admin/posts');
      if (postsResponse.ok) {
        const postsData = await postsResponse.json();
        setPosts(postsData.posts || []);
      }
    } catch (error) {
      console.error('Error fetching admin data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleReportAction = async (reportId: string, action: 'approve' | 'reject') => {
    try {
      const response = await fetch('/api/admin/reports', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reportId, action })
      });

      if (response.ok) {
        fetchData();
      }
    } catch (error) {
      console.error('Error handling report:', error);
    }
  };

  const handleUserAction = async (userId: string, action: 'suspend' | 'ban' | 'activate') => {
    if (!confirm(`Are you sure you want to ${action} this user?`)) return;

    try {
      const response = await fetch('/api/admin/users', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, action })
      });

      if (response.ok) {
        fetchData();
      }
    } catch (error) {
      console.error('Error handling user action:', error);
    }
  };

  const handleDeletePost = async (postId: string) => {
    if (!confirm('Are you sure you want to delete this post?')) return;

    try {
      const response = await fetch(`/api/admin/posts?postId=${postId}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        fetchData();
      }
    } catch (error) {
      console.error('Error deleting post:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
        <div className="text-xl font-semibold text-gray-600">Loading admin panel...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
                <Shield className="text-blue-600" size={36} />
                Admin Moderation Panel
              </h1>
              <p className="text-gray-600 mt-1">Manage users, content, and reports</p>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="bg-white rounded-2xl shadow-lg mb-6">
          <div className="flex border-b border-gray-200">
            <button
              onClick={() => setActiveTab('overview')}
              className={`flex-1 py-4 px-6 font-semibold transition-colors ${
                activeTab === 'overview'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <BarChart3 className="inline mr-2" size={20} />
              Overview
            </button>
            <button
              onClick={() => setActiveTab('users')}
              className={`flex-1 py-4 px-6 font-semibold transition-colors ${
                activeTab === 'users'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <Users className="inline mr-2" size={20} />
              Users
            </button>
            <button
              onClick={() => setActiveTab('reports')}
              className={`flex-1 py-4 px-6 font-semibold transition-colors ${
                activeTab === 'reports'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <Flag className="inline mr-2" size={20} />
              Reports
              {stats.pendingReports > 0 && (
                <span className="ml-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                  {stats.pendingReports}
                </span>
              )}
            </button>
            <button
              onClick={() => setActiveTab('posts')}
              className={`flex-1 py-4 px-6 font-semibold transition-colors ${
                activeTab === 'posts'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <FileText className="inline mr-2" size={20} />
              Posts
            </button>
          </div>
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm font-semibold">Total Users</p>
                    <p className="text-3xl font-bold text-gray-800 mt-2">{stats.totalUsers}</p>
                  </div>
                  <Users className="text-blue-500" size={40} />
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-lg p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm font-semibold">Active Users</p>
                    <p className="text-3xl font-bold text-green-600 mt-2">{stats.activeUsers}</p>
                  </div>
                  <CheckCircle className="text-green-500" size={40} />
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-lg p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm font-semibold">Pending Reports</p>
                    <p className="text-3xl font-bold text-red-600 mt-2">{stats.pendingReports}</p>
                  </div>
                  <AlertTriangle className="text-red-500" size={40} />
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-lg p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm font-semibold">Flagged Posts</p>
                    <p className="text-3xl font-bold text-orange-600 mt-2">{stats.flaggedPosts}</p>
                  </div>
                  <FileText className="text-orange-500" size={40} />
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Recent Reports</h3>
              <div className="space-y-3">
                {reports.slice(0, 5).map(report => (
                  <div key={report.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                    <div>
                      <p className="font-semibold text-gray-800">
                        {report.reporterName} reported {report.type}
                      </p>
                      <p className="text-sm text-gray-600">{report.reason}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                      report.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      report.status === 'approved' ? 'bg-green-100 text-green-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {report.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Users Tab */}
        {activeTab === 'users' && (
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-gray-800">User Management</h3>
              <div className="flex gap-3">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="text"
                    placeholder="Search users..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 pr-4 py-2 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none"
                  />
                </div>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b-2 border-gray-200">
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Name</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Email</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Status</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Reports</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users
                    .filter(user => 
                      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                      user.email.toLowerCase().includes(searchQuery.toLowerCase())
                    )
                    .map(user => (
                      <tr key={user.id} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-3 px-4 font-semibold text-gray-800">{user.name}</td>
                        <td className="py-3 px-4 text-gray-600">{user.email}</td>
                        <td className="py-3 px-4">
                          <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                            user.status === 'active' ? 'bg-green-100 text-green-800' :
                            user.status === 'suspended' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {user.status}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          {user.reportCount > 0 && (
                            <span className="text-red-600 font-semibold">{user.reportCount}</span>
                          )}
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex gap-2">
                            {user.status === 'active' && (
                              <>
                                <button
                                  onClick={() => handleUserAction(user.id, 'suspend')}
                                  className="text-yellow-600 hover:text-yellow-800 p-2 hover:bg-yellow-50 rounded-lg transition-colors"
                                  title="Suspend"
                                >
                                  <Ban size={18} />
                                </button>
                                <button
                                  onClick={() => handleUserAction(user.id, 'ban')}
                                  className="text-red-600 hover:text-red-800 p-2 hover:bg-red-50 rounded-lg transition-colors"
                                  title="Ban"
                                >
                                  <XCircle size={18} />
                                </button>
                              </>
                            )}
                            {(user.status === 'suspended' || user.status === 'banned') && (
                              <button
                                onClick={() => handleUserAction(user.id, 'activate')}
                                className="text-green-600 hover:text-green-800 p-2 hover:bg-green-50 rounded-lg transition-colors"
                                title="Activate"
                              >
                                <CheckCircle size={18} />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Reports Tab */}
        {activeTab === 'reports' && (
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h3 className="text-2xl font-bold text-gray-800 mb-6">Reports Management</h3>
            
            <div className="space-y-4">
              {reports.map(report => (
                <div key={report.id} className="border-2 border-gray-200 rounded-xl p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h4 className="text-lg font-bold text-gray-800">
                        {report.type.charAt(0).toUpperCase() + report.type.slice(1)} Report
                      </h4>
                      <p className="text-sm text-gray-600 mt-1">
                        Reported by {report.reporterName} • {new Date(report.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                      report.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      report.status === 'approved' ? 'bg-green-100 text-green-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {report.status}
                    </span>
                  </div>

                  <div className="mb-4">
                    <p className="font-semibold text-gray-700">Reason: {report.reason}</p>
                    <p className="text-gray-600 mt-2">{report.description}</p>
                  </div>

                  {report.status === 'pending' && (
                    <div className="flex gap-3">
                      <button
                        onClick={() => handleReportAction(report.id, 'approve')}
                        className="flex-1 bg-green-500 text-white py-2 rounded-xl font-semibold hover:bg-green-600 transition-colors flex items-center justify-center gap-2"
                      >
                        <CheckCircle size={20} />
                        Approve & Take Action
                      </button>
                      <button
                        onClick={() => handleReportAction(report.id, 'reject')}
                        className="flex-1 bg-red-500 text-white py-2 rounded-xl font-semibold hover:bg-red-600 transition-colors flex items-center justify-center gap-2"
                      >
                        <XCircle size={20} />
                        Reject Report
                      </button>
                    </div>
                  )}
                </div>
              ))}

              {reports.length === 0 && (
                <div className="text-center py-12 text-gray-500">
                  <Flag size={48} className="mx-auto mb-3 text-gray-300" />
                  <p className="font-semibold">No reports to review</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Posts Tab */}
        {activeTab === 'posts' && (
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h3 className="text-2xl font-bold text-gray-800 mb-6">Flagged Posts</h3>
            
            <div className="space-y-4">
              {posts.map(post => (
                <div key={post.id} className="border-2 border-gray-200 rounded-xl p-6">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <p className="font-semibold text-gray-800">{post.userName}</p>
                      <p className="text-sm text-gray-600">{new Date(post.createdAt).toLocaleDateString()}</p>
                    </div>
                    <span className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm font-semibold">
                      {post.reportCount} reports
                    </span>
                  </div>

                  <p className="text-gray-700 mb-4">{post.content}</p>

                  <div className="flex gap-3">
                    <button
                      onClick={() => handleDeletePost(post.id)}
                      className="bg-red-500 text-white px-6 py-2 rounded-xl font-semibold hover:bg-red-600 transition-colors flex items-center gap-2"
                    >
                      <Trash2 size={18} />
                      Delete Post
                    </button>
                  </div>
                </div>
              ))}

              {posts.length === 0 && (
                <div className="text-center py-12 text-gray-500">
                  <FileText size={48} className="mx-auto mb-3 text-gray-300" />
                  <p className="font-semibold">No flagged posts</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminModerationPanel;
