"use client";
import React from "react";
import { User, CheckCircle, AlertCircle, Megaphone, FileText, Calendar, Bell } from "lucide-react";

type Props = { user?: { id?: string; name?: string } };

export default function UserDashboardClient({ user }: Props) {
  return (
    <div className="min-h-full text-slate-100">
      <header className="mb-6 flex items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white">Good to see you{user?.name ? `, ${user.name}` : ", Student"}</h1>
          <p className="text-sm text-slate-300 mt-1">Your student dashboard — quick snapshot of everything important.</p>
        </div>
        <div className="hidden sm:flex items-center gap-3">
          <button className="px-3 py-2 rounded-full bg-white/6 text-white hover:bg-white/8 transition">My Profile</button>
        </div>
      </header>

      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card title="Attendance" value="92%" icon={<CheckCircle />} accent="from-emerald-500 to-teal-400" />
        <Card title="Active Complaints" value="3" icon={<AlertCircle />} accent="from-rose-500 to-pink-500" />
        <Card title="Announcements" value="1" icon={<Megaphone />} accent="from-indigo-500 to-violet-500" />
        <Card title="Fee Status" value="Paid" icon={<FileText />} accent="from-yellow-500 to-amber-400" />
      </section>

      <section className="mb-6 grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 bg-white/5 backdrop-blur-md rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-white font-medium">Recent Activity</h3>
            <div className="text-sm text-slate-400">Live</div>
          </div>
          <ul className="space-y-4">
            <ActivityItem title="Complaint resolved in Maple Hall" time="2 hours ago" status="Resolved" />
            <ActivityItem title="New announcement posted" time="Yesterday" status="Info" />
            <ActivityItem title="Attendance marked" time="Today" status="92%" />
          </ul>
        </div>

        <aside className="bg-white/6 backdrop-blur-md rounded-2xl p-5 shadow-sm">
          <h4 className="text-white font-medium mb-3">Hostel Info</h4>
          <div className="text-sm text-slate-300 space-y-2">
            <div>Block: A</div>
            <div>Room: 203</div>
            <div>Warden: Mr. Sharma</div>
            <div>Leave Status: 1 approved</div>
          </div>

          <div className="mt-5">
            <h5 className="text-sm text-slate-300 mb-2">Upcoming</h5>
            <div className="flex items-center gap-3 text-sm text-slate-200">
              <Calendar size={16} />
              <div>Mess payment due — 3 days</div>
            </div>
          </div>
        </aside>
      </section>

      <section className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 bg-white/5 backdrop-blur-md rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-white font-medium">Attendance Progress</h3>
            <div className="text-sm text-slate-400">This month</div>
          </div>
          <div className="w-full bg-white/8 rounded-full h-4 overflow-hidden">
            <div className="h-4 rounded-full bg-gradient-to-r from-emerald-500 to-teal-400 shadow-md" style={{ width: '92%' }} />
          </div>
          <div className="mt-3 text-sm text-slate-300">Keep up the good work — you're above target.</div>
        </div>

        <div className="bg-white/6 backdrop-blur-md rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-white font-medium">Alerts</h3>
            <div className="text-sm text-slate-400">Critical</div>
          </div>
          <ul className="space-y-3">
            <li className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-gradient-to-r from-rose-500 to-pink-500 text-white">
                <AlertCircle size={18} />
              </div>
              <div>
                <div className="text-sm text-white">Water supply maintenance scheduled</div>
                <div className="text-xs text-slate-400">Tomorrow — 9:00 AM</div>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-gradient-to-r from-indigo-500 to-violet-500 text-white">
                <Bell size={18} />
              </div>
              <div>
                <div className="text-sm text-white">Security drill — expected</div>
                <div className="text-xs text-slate-400">Check notifications</div>
              </div>
            </li>
          </ul>
        </div>
      </section>
    </div>
  );
}

function Card({ title, value, icon, accent }: { title: string; value: string; icon: React.ReactNode; accent?: string }) {
  return (
    <div className="p-4 rounded-2xl backdrop-blur-md bg-white/5 border border-white/6 shadow-lg hover:shadow-indigo-600/20 transition">
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

function ActivityItem({ title, time, status }: { title: string; time: string; status: string }) {
  return (
    <li className="flex items-start justify-between gap-4">
      <div>
        <div className="text-sm text-slate-200">{title}</div>
        <div className="text-xs text-slate-400">{time}</div>
      </div>
      <div className="text-xs text-slate-400">{status}</div>
    </li>
  );
}
