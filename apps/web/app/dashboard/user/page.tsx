'use client'
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { LifecycleOverviewCard, IssueLifecycleCard } from "./components/IssueLifecycleCard";

// ============================================
// TYPES - Match these with your Prisma schema
// ============================================

type UserProfile = {
  id: string;
  name: string;
  email: string;
  phone: string;
  gender: 'MALE' | 'FEMALE' | 'OTHER' | 'PREFER_NOT_TO_SAY';
  userType: 'STUDENT' | 'WARDEN' | 'ADMIN' | 'STAFF';
  isActive: boolean;
  createdAt: string;
  seat?: {
    seatNo: number;
    room: {
      roomNo: number;
      floor: {
        number: number;
        block: {
          name: string;
          building: {
            name: string;
          };
        };
      };
    };
  };
};

type Issue = {
  id: string;
  title: string;
  description: string;
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'EMERGENCY';
  status: 'REPORTED' | 'ASSIGNED' | 'IN_PROGRESS' | 'RESOLVED' | 'CLOSED';
  createdAt: string;
  images: string[];
};

type Announcement = {
  id: string;
  title: string;
  content: string;
  createdAt: string;
};

// Issue Categories
const ISSUE_CATEGORIES = [
  'Plumbing',
  'Electrical',
  'Cleanliness',
  'Internet',
  'Furniture',
  'AC/Cooling',
  'Other'
] as const;

type IssueCategory = typeof ISSUE_CATEGORIES[number];

// Priority and Status Colors
const priorityColors: Record<Issue['priority'], string> = {
  LOW: 'bg-green-100 text-green-800',
  MEDIUM: 'bg-yellow-100 text-yellow-800',
  HIGH: 'bg-orange-100 text-orange-800',
  EMERGENCY: 'bg-red-100 text-red-800'
};

const statusColors: Record<Issue['status'], string> = {
  REPORTED: 'bg-blue-100 text-blue-800',
  ASSIGNED: 'bg-purple-100 text-purple-800',
  IN_PROGRESS: 'bg-yellow-100 text-yellow-800',
  RESOLVED: 'bg-green-100 text-green-800',
  CLOSED: 'bg-gray-100 text-gray-800'
};

// ============================================
// MAIN COMPONENT
// ============================================
// Mock data for testing (remove when backend is connected)
const MOCK_USER: UserProfile = {
  id: '1',
  name: 'John Doe',
  email: 'john.doe@example.com',
  phone: '9876543210',
  gender: 'MALE',
  userType: 'STUDENT',
  isActive: true,
  createdAt: new Date().toISOString(),
  seat: {
    seatNo: 1,
    room: {
      roomNo: 101,
      floor: {
        number: 1,
        block: {
          name: 'Block A',
          building: {
            name: 'Main Hostel'
          }
        }
      }
    }
  }
};

const MOCK_ISSUES: Issue[] = [
  {
    id: '1',
    title: '[Plumbing] Leaking tap in bathroom',
    description: 'The tap in the bathroom is leaking continuously',
    priority: 'MEDIUM',
    status: 'REPORTED',
    createdAt: new Date().toISOString(),
    images: []
  }
];

const MOCK_ANNOUNCEMENTS: Announcement[] = [
  {
    id: '1',
    title: 'Water Supply Maintenance',
    content: 'Water supply will be interrupted on Sunday from 10 AM to 2 PM for maintenance work.',
    createdAt: new Date().toISOString()
  }
];

// Set to true to use mock data for testing UI without backend
const USE_MOCK_DATA = true;
const UserDashboard = () => {
  const router = useRouter();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [issues, setIssues] = useState<Issue[]>([]);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'report' | 'status' | 'announcements'>('overview');

  // Report Issue Form State
  const [issueForm, setIssueForm] = useState({
    title: '',
    category: '' as IssueCategory | '',
    priority: 'MEDIUM' as Issue['priority'],
    description: '',
    images: [] as File[]
  });
  const [submitting, setSubmitting] = useState(false);

  // ============================================
  // API FUNCTIONS - Connect to your backend
  // ============================================

  const fetchProfile = async () => {
    try {
      // TODO: Update endpoint to match your backend
      const response = await fetch('/api/user/profile', {
        credentials: 'include',
      });
      if (!response.ok) {
        router.push('/authentication');
        return;
      }
      const data = await response.json();
      setUser(data);
    } catch (error) {
      console.error('Failed to fetch profile:', error);
      router.push('/authentication');
    }
  };

  const fetchIssues = async () => {
    try {
      // TODO: Update endpoint to match your backend
      const response = await fetch('/api/issues/my-issues', {
        credentials: 'include',
      });
      if (response.ok) {
        const data = await response.json();
        setIssues(data.issues || []);
      }
    } catch (error) {
      console.error('Failed to fetch issues:', error);
    }
  };

  const fetchAnnouncements = async () => {
    try {
      // TODO: Update endpoint to match your backend
      const response = await fetch('/api/announcements', {
        credentials: 'include',
      });
      if (response.ok) {
        const data = await response.json();
        setAnnouncements(data.announcements || []);
      }
    } catch (error) {
      console.error('Failed to fetch announcements:', error);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      
      if (USE_MOCK_DATA) {
        // Use mock data for testing
        setUser(MOCK_USER);
        setIssues(MOCK_ISSUES);
        setAnnouncements(MOCK_ANNOUNCEMENTS);
        setLoading(false);
        return;
      }
      
      // Fetch from actual API
      await Promise.all([fetchProfile(), fetchIssues(), fetchAnnouncements()]);
      setLoading(false);
    };
    loadData();
  }, []);

  const handleSubmitIssue = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!issueForm.title || !issueForm.category || !issueForm.description) {
      alert('Please fill all required fields');
      return;
    }

    setSubmitting(true);
    try {
      const formData = new FormData();
      formData.append('title', `[${issueForm.category}] ${issueForm.title}`);
      formData.append('description', issueForm.description);
      formData.append('priority', issueForm.priority);

      issueForm.images.forEach((image, index) => {
        formData.append(`image_${index}`, image);
      });

      // TODO: Update endpoint to match your backend
      const response = await fetch('/api/issues', {
        method: 'POST',
        credentials: 'include',
        body: formData,
      });

      if (response.ok) {
        alert('Issue reported successfully!');
        setIssueForm({ title: '', category: '', priority: 'MEDIUM', description: '', images: [] });
        fetchIssues();
        setActiveTab('status');
      } else {
        const error = await response.json();
        alert(error.message || 'Failed to report issue');
      }
    } catch (error) {
      console.error('Failed to submit issue:', error);
      alert('Failed to report issue. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      setIssueForm(prev => ({
        ...prev,
        images: [...prev.images, ...filesArray].slice(0, 5)
      }));
    }
  };

  const removeImage = (index: number) => {
    setIssueForm(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const handleLogout = async () => {
    try {
      // TODO: Update endpoint to match your backend
      await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include',
      });
      router.push('/authentication');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  // ============================================
  // LOADING STATE
  // ============================================

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  // ============================================
  // MAIN RENDER
  // ============================================

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation Bar */}
      <nav className="bg-white shadow-md border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            {/* Left - Logo */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-cyan-500 rounded-lg flex items-center justify-center shadow-md">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <span className="text-lg font-bold text-gray-800 hidden sm:block">HIMS</span>
            </div>

            {/* Center - Heading */}
            <div className="flex-1 text-center px-4">
              <h1 className="text-sm sm:text-lg md:text-xl font-semibold text-gray-800 truncate">
                Welcome to the Hostel Issue Management System
              </h1>
            </div>

            {/* Right - Logout Button */}
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 border border-red-200 rounded-lg hover:bg-red-100 transition-colors font-medium"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 py-8">

        {/* ============================================ */}
        {/* PROFILE SECTION WITH PROFILE PIC */}
        {/* ============================================ */}
        <div className="bg-white rounded-xl border shadow-sm p-6 mb-8">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
            {/* Profile Picture */}
            <div className="shrink-0">
              <div className="w-28 h-28 md:w-36 md:h-36 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-4xl md:text-5xl font-bold shadow-lg border-4 border-white">
                {user?.name?.charAt(0)?.toUpperCase() || 'U'}
              </div>
            </div>

            {/* User Basic Details */}
            <div className="flex-1 text-center md:text-left">
              <h2 className="text-2xl font-bold text-gray-900 mb-1">{user?.name || 'Student Name'}</h2>
              <p className="text-gray-500 mb-4">{user?.email || 'email@example.com'}</p>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-xs text-gray-500 uppercase tracking-wide">Phone</p>
                  <p className="font-medium text-gray-900">{user?.phone || 'N/A'}</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-xs text-gray-500 uppercase tracking-wide">Gender</p>
                  <p className="font-medium text-gray-900 capitalize">
                    {user?.gender?.toLowerCase().replace('_', ' ') || 'N/A'}
                  </p>
                </div>
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-xs text-gray-500 uppercase tracking-wide">Room</p>
                  <p className="font-medium text-gray-900">
                    {user?.seat
                      ? `${user.seat.room.floor.block.name} - Room ${user.seat.room.roomNo}`
                      : 'Not Assigned'}
                  </p>
                </div>
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-xs text-gray-500 uppercase tracking-wide">Status</p>
                  <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${user?.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                    {user?.isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ============================================ */}
        {/* ACTION CARDS - Report Issues, View Status, Announcements, Lifecycle */}
        {/* ============================================ */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">

          {/* Card 1: Report Issue */}
          <div
            className={`bg-white rounded-xl border shadow-sm p-6 cursor-pointer transition-all hover:shadow-lg ${activeTab === 'report' ? 'ring-2 ring-blue-500' : ''}`}
            onClick={() => router.push('/dashboard/user/report-issue')}
          >
            <div className="w-14 h-14 rounded-xl bg-red-100 flex items-center justify-center mb-4">
              <svg className="w-7 h-7 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Report Issue</h3>
            <p className="text-sm text-gray-500 mb-4">
              Report maintenance issues: plumbing, electrical, cleanliness, internet, furniture, etc.
            </p>
            <button className="w-full px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium">
              Report New Issue
            </button>
          </div>

          {/* Card 2: View Status */}
          <div
            className={`bg-white rounded-xl border shadow-sm p-6 cursor-pointer transition-all hover:shadow-lg ${activeTab === 'status' ? 'ring-2 ring-blue-500' : ''}`}
            onClick={() => setActiveTab('status')}
          >
            <div className="w-14 h-14 rounded-xl bg-blue-100 flex items-center justify-center mb-4">
              <svg className="w-7 h-7 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">View Status</h3>
            <p className="text-sm text-gray-500 mb-4">
              Track the status of your reported issues and see updates from maintenance.
            </p>
            <div className="flex items-center justify-between bg-blue-50 rounded-lg p-3">
              <span className="text-3xl font-bold text-blue-600">{issues.length}</span>
              <span className="text-sm text-blue-600 font-medium">Total Issues</span>
            </div>
          </div>

          {/* Card 3: Issue Lifecycle */}
          <LifecycleOverviewCard 
            issues={issues.map(issue => ({
              ...issue,
              category: 'General',
              location: user?.seat ? `${user.seat.room.floor.block.name} - Room ${user.seat.room.roomNo}` : 'N/A',
              visibility: 'PRIVATE' as const,
              updatedAt: issue.createdAt,
              upvotes: 0,
              commentsCount: 0
            }))}
          />

          {/* Card 4: Announcements */}
          <div
            className={`bg-white rounded-xl border shadow-sm p-6 cursor-pointer transition-all hover:shadow-lg ${activeTab === 'announcements' ? 'ring-2 ring-blue-500' : ''}`}
            onClick={() => setActiveTab('announcements')}
          >
            <div className="w-14 h-14 rounded-xl bg-green-100 flex items-center justify-center mb-4">
              <svg className="w-7 h-7 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Announcements</h3>
            <p className="text-sm text-gray-500 mb-4">
              View and interact with announcements from hostel administration.
            </p>
            <div className="flex items-center justify-between bg-green-50 rounded-lg p-3">
              <span className="text-3xl font-bold text-green-600">{announcements.length}</span>
              <span className="text-sm text-green-600 font-medium">New Updates</span>
            </div>
          </div>
        </div>

        {/* ============================================ */}
        {/* REPORT ISSUE FORM */}
        {/* ============================================ */}
        {activeTab === 'report' && (
          <div className="bg-white rounded-xl border shadow-sm p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Report a New Issue</h3>
            <p className="text-sm text-gray-500 mb-6">Fill in the details below to report a maintenance issue</p>

            <form onSubmit={handleSubmitIssue} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Issue Title *</label>
                <input
                  type="text"
                  value={issueForm.title}
                  onChange={(e) => setIssueForm(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Brief title of the issue"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Category *</label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {ISSUE_CATEGORIES.map((category) => (
                    <button
                      key={category}
                      type="button"
                      onClick={() => setIssueForm(prev => ({ ...prev, category }))}
                      className={`px-4 py-2 rounded-lg border text-sm font-medium transition-all ${issueForm.category === category
                          ? 'bg-blue-600 text-white border-blue-600'
                          : 'bg-white text-gray-700 border-gray-300 hover:border-blue-400'
                        }`}
                    >
                      {category}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Priority Level *</label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {(['LOW', 'MEDIUM', 'HIGH', 'EMERGENCY'] as const).map((priority) => (
                    <button
                      key={priority}
                      type="button"
                      onClick={() => setIssueForm(prev => ({ ...prev, priority }))}
                      className={`px-4 py-2 rounded-lg border text-sm font-medium transition-all ${issueForm.priority === priority
                          ? priorityColors[priority] + ' border-current'
                          : 'bg-white text-gray-700 border-gray-300 hover:border-gray-400'
                        }`}
                    >
                      {priority}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description *</label>
                <textarea
                  value={issueForm.description}
                  onChange={(e) => setIssueForm(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Describe the issue in detail..."
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-none"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Upload Images/Videos (Optional - Max 5)</label>
                <div className="flex flex-wrap gap-4">
                  {issueForm.images.map((image, index) => (
                    <div key={index} className="relative w-20 h-20">
                      <img src={URL.createObjectURL(image)} alt={`Upload ${index + 1}`} className="w-full h-full object-cover rounded-lg" />
                      <button type="button" onClick={() => removeImage(index)} className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full text-xs hover:bg-red-600">×</button>
                    </div>
                  ))}
                  {issueForm.images.length < 5 && (
                    <label className="w-20 h-20 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center cursor-pointer hover:border-blue-400 transition-colors">
                      <input type="file" accept="image/*,video/*" onChange={handleFileChange} className="hidden" multiple />
                      <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                    </label>
                  )}
                </div>
              </div>

              <div className="flex gap-4">
                <button type="submit" disabled={submitting} className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium">
                  {submitting ? 'Submitting...' : 'Submit Issue'}
                </button>
                <button type="button" onClick={() => setActiveTab('overview')} className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* ============================================ */}
        {/* VIEW STATUS */}
        {/* ============================================ */}
        {activeTab === 'status' && (
          <div className="bg-white rounded-xl border shadow-sm p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-2">My Reported Issues</h3>
            <p className="text-sm text-gray-500 mb-6">Track the status and lifecycle of all your reported issues. Click on any issue to view its full lifecycle.</p>

            {issues.length === 0 ? (
              <div className="text-center py-12">
                <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                <p className="text-gray-500 mb-4">No issues reported yet</p>
                <button onClick={() => router.push('/dashboard/user/report-issue')} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                  Report Your First Issue
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {issues.map((issue) => (
                  <IssueLifecycleCard
                    key={issue.id}
                    issue={{
                      id: issue.id,
                      title: issue.title,
                      status: issue.status,
                      priority: issue.priority,
                      createdAt: issue.createdAt
                    }}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* ============================================ */}
        {/* ANNOUNCEMENTS */}
        {/* ============================================ */}
        {activeTab === 'announcements' && (
          <div className="bg-white rounded-xl border shadow-sm p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Announcements</h3>
            <p className="text-sm text-gray-500 mb-6">Latest updates from hostel administration</p>

            {announcements.length === 0 ? (
              <div className="text-center py-12">
                <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
                </svg>
                <p className="text-gray-500">No announcements at the moment</p>
              </div>
            ) : (
              <div className="space-y-4">
                {announcements.map((announcement) => (
                  <div key={announcement.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-semibold text-gray-900">{announcement.title}</h4>
                      <span className="text-xs text-gray-400">{new Date(announcement.createdAt).toLocaleDateString()}</span>
                    </div>
                    <p className="text-gray-600 text-sm">{announcement.content}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ============================================ */}
        {/* OVERVIEW (Default Tab) */}
        {/* ============================================ */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl border shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-1">Recent Issues</h3>
              <p className="text-sm text-gray-500 mb-4">Your latest reported issues</p>
              {issues.slice(0, 3).length === 0 ? (
                <p className="text-gray-500 text-center py-4">No issues reported</p>
              ) : (
                <div className="space-y-3">
                  {issues.slice(0, 3).map((issue) => (
                    <div key={issue.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium text-sm text-blue-500">{issue.title}</p>
                        <p className="text-xs text-gray-500">{new Date(issue.createdAt).toLocaleDateString()}</p>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[issue.status]}`}>{issue.status.replace('_', ' ')}</span>
                    </div>
                  ))}
                </div>
              )}
              <button onClick={() => setActiveTab('status')} className="w-full mt-4 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors">View All Issues</button>
            </div>

            <div className="bg-white rounded-xl border shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-1">Recent Announcements</h3>
              <p className="text-sm text-gray-500 mb-4">Latest updates from administration</p>
              {announcements.slice(0, 3).length === 0 ? (
                <p className="text-gray-500 text-center py-4">No announcements</p>
              ) : (
                <div className="space-y-3">
                  {announcements.slice(0, 3).map((announcement) => (
                    <div key={announcement.id} className="p-3 bg-gray-50 rounded-lg">
                      <p className="font-medium text-sm text-blue-500">{announcement.title}</p>
                      <p className="text-xs text-gray-500 mt-1 line-clamp-2">{announcement.content}</p>
                    </div>
                  ))}
                </div>
              )}
              <button onClick={() => setActiveTab('announcements')} className="w-full mt-4 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors">View All Announcements</button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default UserDashboard;