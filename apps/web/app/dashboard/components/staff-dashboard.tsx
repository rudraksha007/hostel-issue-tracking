"use client";
import React, { useEffect, useState } from "react";
import { Bell, ClipboardList, Calendar, CheckCircle, User, MessageCircle } from "lucide-react";

type Kpi = { title: string; value: string; icon?: React.ReactNode; accent?: string };
type Task = { id: string; title: string; due: string; status: string };
type Shift = { day: string; time: string; location: string };

export function StaffDashboard() {
	const [loaded, setLoaded] = useState(false);

	useEffect(() => {
		const t = setTimeout(() => setLoaded(true), 120);
		return () => clearTimeout(t);
	}, []);

	// Dummy data
	const kpis: Kpi[] = [
		{ title: "Active Students", value: "1,024", icon: <User size={18} />, accent: "from-indigo-600 to-violet-500" },
		{ title: "Today Tasks", value: "8", icon: <ClipboardList size={18} />, accent: "from-emerald-400 to-teal-400" },
		{ title: "Notices Sent", value: "3", icon: <MessageCircle size={18} />, accent: "from-amber-400 to-yellow-400" },
		{ title: "Alerts", value: "1", icon: <Bell size={18} />, accent: "from-rose-500 to-pink-500" },
	];

	const tasks: Task[] = [
		{ id: "t1", title: "Inspect block B bathrooms", due: "Today 4:00 PM", status: "Open" },
		{ id: "t2", title: "Approve leave requests", due: "Today 2:00 PM", status: "Pending" },
		{ id: "t3", title: "Oversee fire drill", due: "Tomorrow 10:00 AM", status: "Scheduled" },
	];

	const shifts: Shift[] = [
		{ day: "Mon", time: "08:00 - 16:00", location: "Block A" },
		{ day: "Tue", time: "12:00 - 20:00", location: "Block C" },
		{ day: "Wed", time: "08:00 - 16:00", location: "Block B" },
	];

	// Defensive fallbacks to avoid render-time crashes when data is undefined
	const safeKpis: Kpi[] = Array.isArray(kpis) ? kpis : [];
	const safeTasks: Task[] = Array.isArray(tasks) ? tasks : [];
	const safeShifts: Shift[] = Array.isArray(shifts) ? shifts : [];

	return (
		<div className="min-h-full p-6 md:p-8 text-slate-100">
			<header className="flex items-start justify-between gap-4 mb-6">
				<div>
					<h1 className="text-3xl font-extrabold">Staff Dashboard</h1>
					<p className="text-sm text-slate-300 mt-1">Overview of your daily tasks and schedules.</p>
				</div>
				<div className="flex items-center gap-3">
					<button className="px-3 py-2 rounded-full bg-white/6 hover:bg-white/8 transition">My Profile</button>
					<button className="px-3 py-2 rounded-full bg-linear-to-r from-indigo-600 to-teal-500 text-white shadow">New Notice</button>
				</div>
			</header>

			<section className="mb-8 grid grid-cols-1 md:grid-cols-4 gap-4">
				{safeKpis.length ? safeKpis.map((k) => (
					<div key={k.title} className="p-4 rounded-2xl backdrop-blur-md bg-white/5 border border-white/6 shadow-sm hover:shadow-indigo-600/10 transition">
						<div className="flex items-center justify-between">
							<div>
								<div className="text-sm text-slate-300">{k.title}</div>
								<div className="text-2xl font-semibold text-white mt-1">{k.value}</div>
							</div>
							<div className={`p-2 rounded-lg text-white bg-linear-to-r ${k.accent}`}>{k.icon}</div>
						</div>
					</div>
				)) : (
					<div className="col-span-full text-sm text-slate-400 p-4">No KPIs available</div>
				)}
			</section>

			<section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
				<div className="lg:col-span-2 bg-white/5 backdrop-blur-md rounded-2xl p-6 shadow-sm">
					<div className="flex items-center justify-between mb-4">
						<h3 className="text-white font-medium">Today's Tasks</h3>
						<div className="text-sm text-slate-400">{safeTasks.length} items</div>
					</div>
					<ul className="space-y-3">
						{safeTasks.length ? safeTasks.map((t) => (
							<li key={t.id} className="flex items-center justify-between gap-4">
								<div>
									<div className="text-sm text-slate-200">{t.title}</div>
									<div className="text-xs text-slate-400">{t.due}</div>
								</div>
								<div className="flex items-center gap-2">
									<span className={`text-xs px-2 py-1 rounded-full ${t.status === 'Open' ? 'bg-rose-500 text-white' : t.status === 'Pending' ? 'bg-amber-500 text-white' : 'bg-slate-700 text-slate-200'}`}>{t.status}</span>
									<button className="px-3 py-1 rounded-md bg-white/6 hover:bg-white/8 text-sm">Details</button>
								</div>
							</li>
						)) : (
							<div className="text-sm text-slate-400 p-3">No tasks for today.</div>
						)}
					</ul>
				</div>

				<aside className="bg-white/6 backdrop-blur-md rounded-2xl p-6 shadow-sm">
					<h4 className="text-white font-medium mb-3">My Schedule</h4>
					<div className="space-y-2">
						{safeShifts.length ? safeShifts.map((s) => (
							<div key={s.day} className="flex items-center justify-between bg-white/4 p-3 rounded-md">
								<div>
									<div className="text-sm font-medium">{s.day}</div>
									<div className="text-xs text-slate-300">{s.location}</div>
								</div>
								<div className="text-sm text-slate-200">{s.time}</div>
							</div>
						)) : (
							<div className="text-sm text-slate-400 p-3">No scheduled shifts.</div>
						)}
					</div>

					<div className="mt-6">
						<h5 className="text-sm text-slate-300 mb-2">Messages</h5>
						<div className="text-sm text-slate-200">No unread messages</div>
					</div>
				</aside>
			</section>

			<section className="mt-6">
				<div className="bg-white/5 backdrop-blur-md rounded-2xl p-6 shadow-sm">
					<div className="flex items-center justify-between mb-3">
						<h4 className="text-white font-medium">Notifications</h4>
						<div className="text-sm text-slate-400">Recent</div>
					</div>
					<ul className="space-y-3">
						<li className="flex items-start gap-3">
							<div className="p-2 rounded-lg bg-linear-to-r from-amber-400 to-yellow-400 text-white"><Calendar size={16} /></div>
							<div>
								<div className="text-sm text-white">Site inspection scheduled</div>
								<div className="text-xs text-slate-400">Tomorrow 9:00 AM</div>
							</div>
						</li>
					</ul>
				</div>
			</section>
		</div>
	);
}

