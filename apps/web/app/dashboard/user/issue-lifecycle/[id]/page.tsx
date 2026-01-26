'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { LIFECYCLE_STAGES, getStageIndex, type IssueStatus, type LifecycleStage } from '../../components/IssueLifecycleCard';
import { fetchIssueDetails, type IssueDetails, type TimelineEvent } from '../../services/issueLifecycleApi';

// ============================================
// LIFECYCLE STAGE COMPONENT
// ============================================

interface LifecycleStageItemProps {
  stage: LifecycleStage;
  index: number;
  currentIndex: number;
  totalStages: number;
  timelineEvent?: TimelineEvent;
}

function LifecycleStageItem({ 
  stage, 
  index, 
  currentIndex, 
  totalStages,
  timelineEvent 
}: LifecycleStageItemProps) {
  const isCompleted = index < currentIndex;
  const isCurrent = index === currentIndex;
  const isPending = index > currentIndex;
  const isLast = index === totalStages - 1;

  return (
    <div className="flex gap-4">
      {/* Timeline Line & Dot */}
      <div className="flex flex-col items-center">
        {/* Dot */}
        <div
          className={`relative w-10 h-10 rounded-full flex items-center justify-center transition-all duration-500 ${
            isCompleted 
              ? 'bg-green-500 text-white' 
              : isCurrent 
                ? `${stage.color.activeBg} text-white ring-4 ${stage.color.activeRing} animate-pulse` 
                : 'bg-gray-200 text-gray-400'
          }`}
        >
          {isCompleted ? (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          ) : (
            stage.icon
          )}
          
          {/* Current stage indicator */}
          {isCurrent && (
            <span className="absolute -right-1 -top-1 flex h-3 w-3">
              <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${stage.color.activeBg} opacity-75`}></span>
              <span className={`relative inline-flex rounded-full h-3 w-3 ${stage.color.activeBg}`}></span>
            </span>
          )}
        </div>
        
        {/* Connecting Line */}
        {!isLast && (
          <div 
            className={`w-0.5 flex-1 min-h-[60px] transition-colors duration-500 ${
              isCompleted ? 'bg-green-500' : 'bg-gray-200'
            }`}
          />
        )}
      </div>

      {/* Content */}
      <div className={`flex-1 pb-8 ${isLast ? 'pb-0' : ''}`}>
        <div
          className={`p-4 rounded-xl border-2 transition-all duration-300 ${
            isCurrent 
              ? `${stage.color.bg} ${stage.color.border} shadow-lg` 
              : isCompleted 
                ? 'bg-green-50 border-green-200' 
                : 'bg-gray-50 border-gray-200'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <h4 className={`font-semibold ${
              isCurrent ? stage.color.text : isCompleted ? 'text-green-700' : 'text-gray-500'
            }`}>
              {stage.label}
            </h4>
            {isCurrent && (
              <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${stage.color.bg} ${stage.color.text} border ${stage.color.border}`}>
                Current
              </span>
            )}
            {isCompleted && (
              <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-700 border border-green-200">
                Completed
              </span>
            )}
            {isPending && (
              <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-500 border border-gray-200">
                Pending
              </span>
            )}
          </div>
          
          <p className={`text-sm ${isCurrent || isCompleted ? 'text-gray-700' : 'text-gray-400'}`}>
            {stage.description}
          </p>

          {/* Timeline Event Info */}
          {timelineEvent && (
            <div className="mt-3 pt-3 border-t border-gray-200">
              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-500">
                  {new Date(timelineEvent.timestamp).toLocaleString()}
                </span>
                {timelineEvent.updatedBy && (
                  <span className="text-gray-500">
                    by {timelineEvent.updatedBy}
                  </span>
                )}
              </div>
              {timelineEvent.note && (
                <p className="mt-1 text-sm text-gray-600 italic">
                  &quot;{timelineEvent.note}&quot;
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ============================================
// PRIORITY COLORS
// ============================================

const priorityColors: Record<string, string> = {
  LOW: 'bg-green-100 text-green-800 border-green-200',
  MEDIUM: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  HIGH: 'bg-orange-100 text-orange-800 border-orange-200',
  EMERGENCY: 'bg-red-100 text-red-800 border-red-200'
};

// ============================================
// MAIN PAGE COMPONENT
// ============================================

export default function IssueLifecyclePage() {
  const router = useRouter();
  const params = useParams();
  const issueId = params?.id as string;

  const [issue, setIssue] = useState<IssueDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadIssueDetails = async () => {
      if (!issueId) {
        setError('Issue ID is required');
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);

      const response = await fetchIssueDetails(issueId);

      if (response.success && response.data) {
        setIssue(response.data);
      } else {
        setError(response.error || 'Failed to load issue details');
      }

      setLoading(false);
    };

    loadIssueDetails();
  }, [issueId]);

  const currentIndex = issue ? getStageIndex(issue.status) : 0;
  const progress = ((currentIndex + 1) / LIFECYCLE_STAGES.length) * 100;

  // Loading State
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading issue lifecycle...</p>
        </div>
      </div>
    );
  }

  // Error State
  if (error || !issue) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            {error || 'Issue not found'}
          </h3>
          <p className="text-sm text-gray-500 mb-4">
            We couldn&apos;t load the issue details. Please try again.
          </p>
          <div className="flex gap-3 justify-center">
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Retry
            </button>
            <button
              onClick={() => router.back()}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Go Back
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation Bar */}
      <nav className="bg-white shadow-md border-b sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 py-3">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.back()}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              aria-label="Go back"
            >
              <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <div>
              <h1 className="text-lg font-semibold text-gray-900">Issue Lifecycle</h1>
              <p className="text-sm text-gray-500">Track your issue progress</p>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-4 py-8">
        {/* Issue Header Card */}
        <div className="bg-white rounded-xl border shadow-sm p-6 mb-6">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${priorityColors[issue.priority]}`}>
                  {issue.priority}
                </span>
                <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700 border border-gray-200">
                  {issue.category}
                </span>
              </div>
              <h2 className="text-xl font-bold text-gray-900 mb-2">{issue.title}</h2>
              <p className="text-gray-600 text-sm mb-4">{issue.description}</p>
              
              <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                {issue.location && (
                  <div className="flex items-center gap-1">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    {issue.location}
                  </div>
                )}
                <div className="flex items-center gap-1">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  Reported: {new Date(issue.createdAt).toLocaleDateString()}
                </div>
                {issue.assignedTo && (
                  <div className="flex items-center gap-1">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    {issue.assignedTo}
                  </div>
                )}
              </div>
            </div>

            {/* Progress Circle */}
            <div className="flex flex-col items-center">
              <div className="relative w-24 h-24">
                <svg className="w-24 h-24 transform -rotate-90">
                  <circle
                    cx="48"
                    cy="48"
                    r="40"
                    stroke="#e5e7eb"
                    strokeWidth="8"
                    fill="none"
                  />
                  <circle
                    cx="48"
                    cy="48"
                    r="40"
                    stroke={issue.status === 'RESOLVED' || issue.status === 'CLOSED' ? '#22c55e' : '#3b82f6'}
                    strokeWidth="8"
                    fill="none"
                    strokeDasharray={`${2 * Math.PI * 40}`}
                    strokeDashoffset={`${2 * Math.PI * 40 * (1 - progress / 100)}`}
                    strokeLinecap="round"
                    className="transition-all duration-1000"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-xl font-bold text-gray-900">{Math.round(progress)}%</span>
                </div>
              </div>
              <p className="text-sm text-gray-500 mt-2">Progress</p>
            </div>
          </div>
        </div>

        {/* Lifecycle Timeline */}
        <div className="bg-white rounded-xl border shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
            <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            Issue Lifecycle Stages
          </h3>

          <div className="relative">
            {LIFECYCLE_STAGES.map((stage, index) => {
              const timelineEvent = issue.timeline?.find(t => t.status === stage.status);
              return (
                <LifecycleStageItem
                  key={stage.status}
                  stage={stage}
                  index={index}
                  currentIndex={currentIndex}
                  totalStages={LIFECYCLE_STAGES.length}
                  timelineEvent={timelineEvent}
                />
              );
            })}
          </div>
        </div>

        {/* Help Section */}
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-xl p-4">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center shrink-0">
              <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h4 className="font-medium text-blue-900">Need Help?</h4>
              <p className="text-sm text-blue-700 mt-1">
                If your issue has been stuck at a stage for too long, you can escalate it by contacting the hostel warden
                or use the emergency contact option for urgent matters.
              </p>
              <button className="mt-2 text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors">
                Contact Support →
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
