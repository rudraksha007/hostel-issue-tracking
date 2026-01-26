// ============================================
// API SERVICE FOR ISSUE LIFECYCLE
// Switch USE_MOCK_DATA to false when backend is ready
// ============================================

import type { IssueStatus } from '../components/IssueLifecycleCard';

// ============================================
// CONFIGURATION
// ============================================

// Set to false when backend API is ready
const USE_MOCK_DATA = true;

// API Base URL - Update this to your backend URL
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '/api';

// ============================================
// TYPES - These should match your backend schema
// ============================================

export interface TimelineEvent {
  id: string;
  status: IssueStatus;
  timestamp: string;
  note?: string;
  updatedBy?: string;
}

export interface IssueDetails {
  id: string;
  title: string;
  description: string;
  status: IssueStatus;
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'EMERGENCY';
  createdAt: string;
  updatedAt: string;
  category: string;
  location?: string;
  assignedTo?: string;
  images: string[];
  timeline: TimelineEvent[];
}

export interface IssueListItem {
  id: string;
  title: string;
  status: IssueStatus;
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'EMERGENCY';
  createdAt: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// ============================================
// MOCK DATA GENERATORS
// ============================================

const LIFECYCLE_STATUSES: IssueStatus[] = ['REPORTED', 'ASSIGNED', 'IN_PROGRESS', 'RESOLVED', 'CLOSED'];

const generateMockTimeline = (currentStatus: IssueStatus): TimelineEvent[] => {
  const currentIndex = LIFECYCLE_STATUSES.indexOf(currentStatus);
  const timeline: TimelineEvent[] = [];
  
  const baseDate = new Date();
  baseDate.setDate(baseDate.getDate() - 5);

  const notes = [
    'Issue submitted by student',
    'Assigned to maintenance team',
    'Work started on the issue',
    'Issue has been fixed and verified',
    'Issue closed and archived'
  ];

  for (let i = 0; i <= currentIndex; i++) {
    const eventDate = new Date(baseDate);
    eventDate.setDate(eventDate.getDate() + i);
    
    timeline.push({
      id: `event-${i}`,
      status: LIFECYCLE_STATUSES[i],
      timestamp: eventDate.toISOString(),
      note: notes[i],
      updatedBy: i === 0 ? 'System' : 'Maintenance Staff'
    });
  }
  
  return timeline;
};

const getMockIssueDetails = (issueId: string): IssueDetails => {
  // Simulate different issues with different statuses based on ID
  const statusIndex = parseInt(issueId, 10) % 5;
  const status = LIFECYCLE_STATUSES[statusIndex] || 'REPORTED';
  
  return {
    id: issueId,
    title: '[Plumbing] Leaking tap in bathroom',
    description: 'The tap in the bathroom is leaking continuously and causing water wastage. The leak seems to be from the tap handle area.',
    status,
    priority: 'MEDIUM',
    category: 'Plumbing',
    location: 'Room 101, Block A',
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date().toISOString(),
    assignedTo: status !== 'REPORTED' ? 'Maintenance Team A' : undefined,
    images: [],
    timeline: generateMockTimeline(status)
  };
};

// ============================================
// API FUNCTIONS
// ============================================

/**
 * Fetch issue details by ID
 * @param issueId - The ID of the issue to fetch
 * @returns Promise with issue details or error
 */
export async function fetchIssueDetails(issueId: string): Promise<ApiResponse<IssueDetails>> {
  try {
    if (USE_MOCK_DATA) {
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const mockIssue = getMockIssueDetails(issueId);
      return {
        success: true,
        data: mockIssue
      };
    }

    // Real API call
    const response = await fetch(`${API_BASE_URL}/issues/${issueId}`, {
      method: 'GET',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return {
        success: false,
        error: errorData.message || `Failed to fetch issue (${response.status})`
      };
    }

    const data = await response.json();
    
    // Transform backend response to match our interface if needed
    // Adjust this mapping based on your actual backend response structure
    const issueDetails: IssueDetails = {
      id: data.id,
      title: data.title,
      description: data.description,
      status: data.status,
      priority: data.priority,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
      category: data.category || 'General',
      location: data.location,
      assignedTo: data.assignedTo?.name || data.assignedTo,
      images: data.images || [],
      timeline: data.timeline || data.statusHistory || []
    };

    return {
      success: true,
      data: issueDetails
    };

  } catch (error) {
    console.error('Error fetching issue details:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'An unexpected error occurred'
    };
  }
}

/**
 * Fetch issue timeline/history by ID
 * @param issueId - The ID of the issue
 * @returns Promise with timeline events or error
 */
export async function fetchIssueTimeline(issueId: string): Promise<ApiResponse<TimelineEvent[]>> {
  try {
    if (USE_MOCK_DATA) {
      await new Promise(resolve => setTimeout(resolve, 300));
      const mockIssue = getMockIssueDetails(issueId);
      return {
        success: true,
        data: mockIssue.timeline
      };
    }

    const response = await fetch(`${API_BASE_URL}/issues/${issueId}/timeline`, {
      method: 'GET',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return {
        success: false,
        error: errorData.message || 'Failed to fetch timeline'
      };
    }

    const data = await response.json();
    return {
      success: true,
      data: data.timeline || data
    };

  } catch (error) {
    console.error('Error fetching issue timeline:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'An unexpected error occurred'
    };
  }
}

/**
 * Fetch all user issues for lifecycle overview
 * @returns Promise with list of issues or error
 */
export async function fetchUserIssues(): Promise<ApiResponse<IssueListItem[]>> {
  try {
    if (USE_MOCK_DATA) {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Generate mock issues with different statuses
      const mockIssues: IssueListItem[] = [
        {
          id: '1',
          title: '[Plumbing] Leaking tap in bathroom',
          status: 'IN_PROGRESS',
          priority: 'MEDIUM',
          createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString()
        },
        {
          id: '2',
          title: '[Electrical] Power outlet not working',
          status: 'ASSIGNED',
          priority: 'HIGH',
          createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()
        },
        {
          id: '3',
          title: '[Internet] WiFi connectivity issue',
          status: 'RESOLVED',
          priority: 'LOW',
          createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString()
        }
      ];

      return {
        success: true,
        data: mockIssues
      };
    }

    const response = await fetch(`${API_BASE_URL}/issues/my-issues`, {
      method: 'GET',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return {
        success: false,
        error: errorData.message || 'Failed to fetch issues'
      };
    }

    const data = await response.json();
    return {
      success: true,
      data: data.issues || data
    };

  } catch (error) {
    console.error('Error fetching user issues:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'An unexpected error occurred'
    };
  }
}
