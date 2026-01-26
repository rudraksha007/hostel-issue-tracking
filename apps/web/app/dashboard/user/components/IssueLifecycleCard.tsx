'use client';

import { useRouter } from 'next/navigation';

// ============================================
// ISSUE LIFECYCLE TYPES
// ============================================

export type IssueStatus = 'REPORTED' | 'ASSIGNED' | 'IN_PROGRESS' | 'RESOLVED' | 'CLOSED';

export interface LifecycleStage {
  status: IssueStatus;
  label: string;
  description: string;
  icon: React.ReactNode;
  color: {
    bg: string;
    text: string;
    border: string;
    activeBg: string;
    activeRing: string;
  };
}

// ============================================
// LIFECYCLE STAGES CONFIGURATION
// ============================================

export const LIFECYCLE_STAGES: LifecycleStage[] = [
  {
    status: 'REPORTED',
    label: 'Reported',
    description: 'Issue has been submitted and is awaiting review',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
      </svg>
    ),
    color: {
      bg: 'bg-blue-100',
      text: 'text-blue-700',
      border: 'border-blue-300',
      activeBg: 'bg-blue-500',
      activeRing: 'ring-blue-200'
    }
  },
  {
    status: 'ASSIGNED',
    label: 'Assigned',
    description: 'Issue has been assigned to maintenance staff',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
      </svg>
    ),
    color: {
      bg: 'bg-purple-100',
      text: 'text-purple-700',
      border: 'border-purple-300',
      activeBg: 'bg-purple-500',
      activeRing: 'ring-purple-200'
    }
  },
  {
    status: 'IN_PROGRESS',
    label: 'In Progress',
    description: 'Maintenance work is currently being done',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
    color: {
      bg: 'bg-yellow-100',
      text: 'text-yellow-700',
      border: 'border-yellow-300',
      activeBg: 'bg-yellow-500',
      activeRing: 'ring-yellow-200'
    }
  },
  {
    status: 'RESOLVED',
    label: 'Resolved',
    description: 'Issue has been fixed and verified',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    color: {
      bg: 'bg-green-100',
      text: 'text-green-700',
      border: 'border-green-300',
      activeBg: 'bg-green-500',
      activeRing: 'ring-green-200'
    }
  },
  {
    status: 'CLOSED',
    label: 'Closed',
    description: 'Issue is closed and archived',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
      </svg>
    ),
    color: {
      bg: 'bg-gray-100',
      text: 'text-gray-700',
      border: 'border-gray-300',
      activeBg: 'bg-gray-500',
      activeRing: 'ring-gray-200'
    }
  }
];

// ============================================
// HELPER FUNCTIONS
// ============================================

export const getStageIndex = (status: IssueStatus): number => {
  return LIFECYCLE_STAGES.findIndex(stage => stage.status === status);
};

export const getStageByStatus = (status: IssueStatus): LifecycleStage | undefined => {
  return LIFECYCLE_STAGES.find(stage => stage.status === status);
};

// ============================================
// MINI LIFECYCLE INDICATOR (for card preview)
// ============================================

interface MiniLifecycleProps {
  currentStatus: IssueStatus;
}

export function MiniLifecycle({ currentStatus }: MiniLifecycleProps) {
  const currentIndex = getStageIndex(currentStatus);
  
  return (
    <div className="flex items-center gap-1">
      {LIFECYCLE_STAGES.slice(0, 4).map((stage, index) => {
        const isCompleted = index < currentIndex;
        const isCurrent = index === currentIndex;
        const isPending = index > currentIndex;
        
        return (
          <div key={stage.status} className="flex items-center">
            <div
              className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                isCompleted ? 'bg-green-500' :
                isCurrent ? `${stage.color.activeBg} ring-2 ${stage.color.activeRing}` :
                'bg-gray-200'
              }`}
              title={stage.label}
            />
            {index < 3 && (
              <div
                className={`w-3 h-0.5 ${
                  isCompleted ? 'bg-green-500' : 'bg-gray-200'
                }`}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

// ============================================
// ISSUE LIFECYCLE CARD COMPONENT
// ============================================

interface Issue {
  id: string;
  title: string;
  status: IssueStatus;
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'EMERGENCY';
  createdAt: string;
}

interface IssueLifecycleCardProps {
  issue: Issue;
  showViewDetails?: boolean;
}

export function IssueLifecycleCard({ issue, showViewDetails = true }: IssueLifecycleCardProps) {
  const router = useRouter();
  const currentStage = getStageByStatus(issue.status);
  const currentIndex = getStageIndex(issue.status);
  const progress = ((currentIndex + 1) / LIFECYCLE_STAGES.length) * 100;

  const priorityColors: Record<string, string> = {
    LOW: 'bg-green-100 text-green-800',
    MEDIUM: 'bg-yellow-100 text-yellow-800',
    HIGH: 'bg-orange-100 text-orange-800',
    EMERGENCY: 'bg-red-100 text-red-800'
  };

  const handleClick = () => {
    router.push(`/dashboard/user/issue-lifecycle/${issue.id}`);
  };

  return (
    <div
      onClick={handleClick}
      className="bg-white rounded-xl border shadow-sm p-5 cursor-pointer transition-all hover:shadow-lg hover:border-blue-200 group"
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && handleClick()}
      aria-label={`View lifecycle for issue: ${issue.title}`}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1 min-w-0">
          <h4 className="font-semibold text-gray-900 truncate group-hover:text-blue-600 transition-colors">
            {issue.title}
          </h4>
          <p className="text-xs text-gray-500 mt-1">
            Reported on {new Date(issue.createdAt).toLocaleDateString()}
          </p>
        </div>
        <span className={`px-2 py-1 rounded-full text-xs font-medium shrink-0 ml-2 ${priorityColors[issue.priority]}`}>
          {issue.priority}
        </span>
      </div>

      {/* Current Status */}
      <div className={`flex items-center gap-2 p-3 rounded-lg ${currentStage?.color.bg} mb-4`}>
        <div className={`${currentStage?.color.text}`}>
          {currentStage?.icon}
        </div>
        <div className="flex-1">
          <p className={`text-sm font-medium ${currentStage?.color.text}`}>
            {currentStage?.label}
          </p>
          <p className="text-xs text-gray-600 line-clamp-1">
            {currentStage?.description}
          </p>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-3">
        <div className="flex justify-between text-xs text-gray-500 mb-1">
          <span>Progress</span>
          <span>{Math.round(progress)}%</span>
        </div>
        <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-500 ${
              issue.status === 'RESOLVED' || issue.status === 'CLOSED'
                ? 'bg-green-500'
                : 'bg-blue-500'
            }`}
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Mini Lifecycle */}
      <div className="flex items-center justify-between">
        <MiniLifecycle currentStatus={issue.status} />
        {showViewDetails && (
          <span className="text-xs text-blue-600 font-medium group-hover:underline flex items-center gap-1">
            View Full Lifecycle
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </span>
        )}
      </div>
    </div>
  );
}

// ============================================
// DASHBOARD LIFECYCLE OVERVIEW CARD
// (Shows multiple issues lifecycle summary)
// ============================================

interface LifecycleOverviewCardProps {
  issues: Issue[];
  onViewAll?: () => void;
}

export function LifecycleOverviewCard({ issues, onViewAll }: LifecycleOverviewCardProps) {
  const router = useRouter();
  
  // Get status distribution
  const statusCounts = LIFECYCLE_STAGES.reduce((acc, stage) => {
    acc[stage.status] = issues.filter(i => i.status === stage.status).length;
    return acc;
  }, {} as Record<IssueStatus, number>);

  // Get latest active issue (not resolved/closed)
  const activeIssues = issues.filter(i => !['RESOLVED', 'CLOSED'].includes(i.status));
  const latestActiveIssue = activeIssues.length > 0 ? activeIssues[0] : null;

  return (
    <div className="bg-white rounded-xl border shadow-sm p-6 cursor-pointer transition-all hover:shadow-lg"
         onClick={() => latestActiveIssue && router.push(`/dashboard/user/issue-lifecycle/${latestActiveIssue.id}`)}>
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Issue Lifecycle</h3>
          <p className="text-sm text-gray-500">Track your issues progress</p>
        </div>
      </div>

      {/* Status Distribution */}
      <div className="grid grid-cols-5 gap-2 mb-4">
        {LIFECYCLE_STAGES.map((stage) => (
          <div
            key={stage.status}
            className={`text-center p-2 rounded-lg ${stage.color.bg} transition-transform hover:scale-105`}
            title={stage.label}
          >
            <div className={`text-lg font-bold ${stage.color.text}`}>
              {statusCounts[stage.status]}
            </div>
            <div className="text-xs text-gray-600 truncate">
              {stage.label.split(' ')[0]}
            </div>
          </div>
        ))}
      </div>

      {/* Latest Active Issue Preview */}
      {latestActiveIssue ? (
        <div className="border-t pt-4">
          <p className="text-xs text-gray-500 mb-2">Latest Active Issue:</p>
          <div className="flex items-center justify-between">
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                {latestActiveIssue.title}
              </p>
              <MiniLifecycle currentStatus={latestActiveIssue.status} />
            </div>
            <span className="text-blue-600 text-sm font-medium flex items-center gap-1">
              View
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </span>
          </div>
        </div>
      ) : (
        <div className="border-t pt-4 text-center">
          <p className="text-sm text-gray-500">No active issues</p>
          <p className="text-xs text-green-600 mt-1">All issues resolved! 🎉</p>
        </div>
      )}
    </div>
  );
}

export default IssueLifecycleCard;
