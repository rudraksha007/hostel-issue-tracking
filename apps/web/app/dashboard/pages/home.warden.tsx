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

export default function WardenDashboard() {
  const complaints = [
    { id: 1, student: "R. Singh", hostel: "Maple", issue: "Plumbing", status: "Unresolved", time: "1h" },
    { id: 2, student: "N. Rao", hostel: "Oak", issue: "Noise", status: "Pending", time: "3h" },
    { id: 3, student: "P. Das", hostel: "Pine", issue: "Electric", status: "Unresolved", time: "5h" },
  ];

  const leaves = [
    { id: 1, student: "A. Kumar", hostel: "Maple", days: 2, status: "Pending" },
    { id: 2, student: "S. Mehta", hostel: "Oak", days: 1, status: "Pending" },
  ];

  const visitorsToday = 8;
  const lateEntries = 3;
  const drills = "No drills scheduled";

  const resolutionPercent = 72; // sample

  return (
    <div className="min-h-full text-slate-100">
      {/* Header */}
      <header className="mb-6 flex items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white">Warden Dashboard</h1>
          <p className="text-sm text-slate-300 mt-1">Today’s hostel operations overview</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="px-3 py-2 rounded-full bg-white/6 hover:bg-white/8 transition">Daily Report</button>
          <button className="px-3 py-2 rounded-full bg-gradient-to-r from-indigo-600 to-violet-500 text-white hover:opacity-95 transition">Notify Residents</button>
        </div>
      </header>

      {/* KPI Cards */}
      <section className="mb-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Kpi title="Students Present" value="1,030" icon={<User size={18} />} />
          <Kpi title="Pending Complaints" value="12" icon={<AlertTriangle size={18} />} accent="from-rose-500 to-pink-500" />
          <Kpi title="Leave Requests" value="7" icon={<Calendar size={18} />} accent="from-amber-500 to-yellow-400" />
          <Kpi title="Security Alerts" value="2" icon={<ShieldCheck size={18} />} accent="from-indigo-600 to-violet-500" />
        </div>
      </section>

      {/* Quick Actions */}
      <section className="mb-6">
        <h2 className="text-lg font-semibold mb-3">Quick Actions</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
          <ActionTile label="Review Complaints" icon={<AlertTriangle />} />
          <ActionTile label="Approve Leaves" icon={<CheckCircle />} />
          <ActionTile label="Post Announcement" icon={<FileText />} />
          <ActionTile label="View Attendance" icon={<Calendar />} />
          <ActionTile label="Security Logs" icon={<Bell />} />
        </div>
      </section>

      {/* Two-column Queue */}
      <section className="mb-6 grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 bg-white/5 backdrop-blur-md rounded-2xl p-4 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-white font-medium">Complaint Queue</h3>
            <div className="text-sm text-slate-400">Latest unresolved</div>
          </div>
          <ul className="space-y-3">
            {complaints.map((c) => (
              <li key={c.id} className="flex items-start justify-between gap-4">
                <div>
                  <div className="text-sm text-slate-200">{c.issue} — <span className="text-slate-400">{c.student} • {c.hostel}</span></div>
                  <div className="text-xs text-slate-400">Reported {c.time} ago</div>
                </div>
                <div className="flex items-center gap-2">
                  <button className="text-sm px-3 py-1 rounded-lg bg-white/6 hover:bg-white/8">Assign</button>
                  <button className="text-sm px-3 py-1 rounded-lg bg-gradient-to-r from-rose-500 to-pink-500 text-white">Escalate</button>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <aside className="bg-white/6 backdrop-blur-md rounded-2xl p-4 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-white font-medium">Leave Approvals</h3>
            <div className="text-sm text-slate-400">Pending</div>
          </div>
          <ul className="space-y-3">
            {leaves.map((l) => (
              <li key={l.id} className="flex items-center justify-between gap-3">
                <div>
                  <div className="text-sm text-slate-200">{l.student} <span className="text-xs text-slate-400">• {l.hostel}</span></div>
                  <div className="text-xs text-slate-400">{l.days} day(s)</div>
                </div>
                <div className="flex items-center gap-2">
                  <button className="px-2 py-1 rounded-lg bg-white/6 hover:bg-white/8 text-sm">View</button>
                  <button className="px-2 py-1 rounded-lg bg-gradient-to-r from-emerald-500 to-teal-400 text-white text-sm">Approve</button>
                </div>
              </li>
            ))}
          </ul>
        </aside>
      </section>

      {/* Today Summary + Performance */}
      <section className="mb-6 grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="bg-white/6 backdrop-blur-md rounded-2xl p-4 shadow-sm">
          <h4 className="text-white font-medium mb-3">Today Summary</h4>
          <div className="space-y-2 text-sm text-slate-300">
            <div>Visitors today: <span className="text-white ml-2">{visitorsToday}</span></div>
            <div>Late entries: <span className="text-white ml-2">{lateEntries}</span></div>
            <div>Drill / Alerts: <span className="text-white ml-2">{drills}</span></div>
          </div>
        </div>

        <div className="lg:col-span-2 bg-white/5 backdrop-blur-md rounded-2xl p-4 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-white font-medium">Complaint Resolution</h4>
            <div className="text-sm text-slate-400">Progress</div>
          </div>
          <div className="w-full bg-white/8 rounded-full h-4 overflow-hidden">
            <div className="h-4 rounded-full bg-gradient-to-r from-indigo-600 to-violet-500 shadow-md" style={{ width: `${resolutionPercent}%` }} />
          </div>
          <div className="mt-3 text-sm text-slate-300">Resolution rate: <span className="text-white ml-2">{resolutionPercent}%</span></div>

          {/* mini trend sparkline */}
          <div className="mt-4">
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
        <div className={`p-2 rounded-lg text-white bg-gradient-to-r ${accent || 'from-indigo-600 to-violet-500'}`}>
          {icon}
        </div>
      </div>
    </div>
  );
}

function ActionTile({ label, icon }: { label: string; icon?: React.ReactNode }) {
  return (
    <button className="flex items-center gap-3 p-3 rounded-2xl bg-white/4 hover:bg-white/6 transition shadow-sm">
      <div className="p-2 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-500 text-white">{icon}</div>
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
