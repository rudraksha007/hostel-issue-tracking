"use client";
import React from "react";
import {
  User,
  AlertTriangle,
  Calendar,
  Bell,
  CheckCircle,
  FileText,
  ShieldCheck,
} from "lucide-react";

/* Backend-ready notes:
   - GET /api/warden/complaints -> { complaints: Complaint[] }
   - GET /api/warden/leaves -> { leaves: LeaveRequest[] }
   - GET /api/warden/summary -> { visitorsToday: number, lateEntries: number, drills: string, resolutionPercent: number }

   Accepts optional `serverData` prop so the server can inject data during SSR.
*/

type Complaint = { id: string | number; student: string; hostel: string; issue: string; status: string; time?: string };
type LeaveRequest = { id: string | number; student: string; hostel: string; days: number; status: string };
type WardenSummary = { visitorsToday?: number; lateEntries?: number; drills?: string; resolutionPercent?: number };

type WardenData = {
  complaints?: Complaint[];
  leaves?: LeaveRequest[];
  summary?: WardenSummary;
};

export function WardenDashboard() {
  // Dummy data for the warden dashboard
  const displayComplaints: Complaint[] = [
    { id: 1, student: 'Rahul Sharma', hostel: 'A', issue: 'Leaky faucet in bathroom', status: 'Unresolved', time: '3h' },
    { id: 2, student: 'Priya Singh', hostel: 'B', issue: 'No hot water', status: 'Assigned', time: '1d' },
    { id: 3, student: 'Amit Verma', hostel: 'C', issue: 'Broken window', status: 'Escalated', time: '2d' },
  ];

  const displayLeaves: LeaveRequest[] = [
    { id: 11, student: 'Sana Khan', hostel: 'A', days: 3, status: 'Pending' },
    { id: 12, student: 'Vikram Patel', hostel: 'B', days: 1, status: 'Pending' },
  ];

  const displaySummary: WardenSummary = { visitorsToday: 14, lateEntries: 2, drills: 'Fire drill at 4 PM', resolutionPercent: 76 };

  return (
    <div className="min-h-full text-slate-100 p-6 md:p-8">
      {/* Header */}
      <header className="mb-8 flex items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white">Warden Dashboard</h1>
          <p className="text-sm text-slate-300 mt-1">Today’s hostel operations overview</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="px-3 py-2 rounded-full bg-white/6 hover:bg-white/8 transition">Daily Report</button>
          <button className="px-3 py-2 rounded-full bg-linear-to-r from-indigo-600 to-violet-500 text-white hover:opacity-95 transition">Notify Residents</button>
        </div>
      </header>

      {/* KPI Cards */}
      <section className="mb-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <Kpi title="Students Present" value="1,030" icon={<User size={18} />} />
          <Kpi title="Pending Complaints" value="12" icon={<AlertTriangle size={18} />} accent="from-rose-500 to-pink-500" />
          <Kpi title="Leave Requests" value="7" icon={<Calendar size={18} />} accent="from-amber-500 to-yellow-400" />
          <Kpi title="Security Alerts" value="2" icon={<ShieldCheck size={18} />} accent="from-indigo-600 to-violet-500" />
        </div>
      </section>

      {/* Quick Actions */}
      <section className="mb-8">
        <h2 className="text-lg font-semibold mb-3">Quick Actions</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
          <ActionTile label="Review Complaints" icon={<AlertTriangle />} />
          <ActionTile label="Approve Leaves" icon={<CheckCircle />} />
          <ActionTile label="Post Announcement" icon={<FileText />} />
          <ActionTile label="View Attendance" icon={<Calendar />} />
          <ActionTile label="Security Logs" icon={<Bell />} />
        </div>
      </section>

      {/* Two-column Queue */}
      <section className="mb-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white/5 backdrop-blur-md rounded-2xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-white font-medium">Complaint Queue</h3>
            <div className="text-sm text-slate-400">Latest unresolved</div>
          </div>
          <ul className="space-y-3">
            {displayComplaints.map((c) => (
              <li key={c.id} className="flex items-start justify-between gap-4">
                <div>
                  <div className="text-sm text-slate-200">{c.issue} — <span className="text-slate-400">{c.student} • {c.hostel}</span></div>
                  <div className="text-xs text-slate-400">Reported {c.time} ago</div>
                </div>
                <div className="flex items-center gap-2">
                  <button className="text-sm px-3 py-1 rounded-lg bg-white/6 hover:bg-white/8">Assign</button>
                  <button className="text-sm px-3 py-1 rounded-lg bg-linear-to-r from-rose-500 to-pink-500 text-white">Escalate</button>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <aside className="bg-white/6 backdrop-blur-md rounded-2xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-white font-medium">Leave Approvals</h3>
            <div className="text-sm text-slate-400">Pending</div>
          </div>
          <ul className="space-y-3">
            {displayLeaves.map((l) => (
              <li key={l.id} className="flex items-center justify-between gap-3">
                <div>
                  <div className="text-sm text-slate-200">{l.student} <span className="text-xs text-slate-400">• {l.hostel}</span></div>
                  <div className="text-xs text-slate-400">{l.days} day(s)</div>
                </div>
                <div className="flex items-center gap-2">
                  <button className="px-2 py-1 rounded-lg bg-white/6 hover:bg-white/8 text-sm">View</button>
                  <button className="px-2 py-1 rounded-lg bg-linear-to-r from-emerald-500 to-teal-400 text-white text-sm">Approve</button>
                </div>
              </li>
            ))}
          </ul>
        </aside>
      </section>

      {/* Today Summary + Performance */}
      <section className="mb-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white/6 backdrop-blur-md rounded-2xl p-6 shadow-sm">
          <h4 className="text-white font-medium mb-3">Today Summary</h4>
          <div className="space-y-2 text-sm text-slate-300">
            <div>Visitors today: <span className="text-white ml-2">{displaySummary.visitorsToday}</span></div>
            <div>Late entries: <span className="text-white ml-2">{displaySummary.lateEntries}</span></div>
            <div>Drill / Alerts: <span className="text-white ml-2">{displaySummary.drills}</span></div>
          </div>
        </div>

        <div className="lg:col-span-2 bg-white/5 backdrop-blur-md rounded-2xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-white font-medium">Complaint Resolution</h4>
            <div className="text-sm text-slate-400">Progress</div>
          </div>
            <div className="w-full bg-white/8 rounded-full h-4 overflow-hidden">
            <div className="h-4 rounded-full bg-linear-to-r from-indigo-600 to-violet-500 shadow-md" style={{ width: `${displaySummary.resolutionPercent}%` }} />
          </div>
          <div className="mt-3 text-sm text-slate-300">Resolution rate: <span className="text-white ml-2">{displaySummary.resolutionPercent}%</span></div>

          {/* mini trend sparkline */}
          <div className="mt-6">
            <Sparkline values={[60, 65, 70, 68, 72, 75, 72]} />
          </div>
        </div>
      </section>

    </div>
  );
}

/* Components */
function Kpi({ title, value, icon, accent }: { title: string; value: string; icon?: React.ReactNode; accent?: string }) {
  return (
    <div className="p-4 rounded-2xl backdrop-blur-md bg-white/5 border border-white/6 shadow-sm hover:shadow-indigo-600/10 transition">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-sm text-slate-300">{title}</div>
          <div className="text-2xl font-semibold text-white mt-1">{value}</div>
        </div>
        <div className={`p-2 rounded-lg text-white bg-linear-to-r ${accent || 'from-indigo-600 to-violet-500'}`}>
          {icon}
        </div>
      </div>
    </div>
  );
}

function ActionTile({ label, icon }: { label: string; icon?: React.ReactNode }) {
  return (
    <button className="flex items-center gap-3 p-3 rounded-2xl bg-white/4 hover:bg-white/6 transition shadow-sm">
      <div className="p-2 rounded-xl bg-linear-to-r from-indigo-600 to-violet-500 text-white">{icon}</div>
      <div className="text-sm text-white">{label}</div>
    </button>
  );
}

function Sparkline({ values }: { values: number[] }) {
  const max = Math.max(...values);
  return (
    <svg className="w-full h-16" viewBox="0 0 100 20" preserveAspectRatio="none">
      <polyline
        fill="none"
        stroke="#7c3aed"
        strokeWidth={1.5}
        points={values.map((v, i) => `${(i / (values.length - 1)) * 100},${20 - (v / max) * 20}`).join(' ')}
      />
    </svg>
  );
}
