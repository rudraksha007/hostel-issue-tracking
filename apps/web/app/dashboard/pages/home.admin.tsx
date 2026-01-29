"use client";
import React, { useEffect, useMemo, useState } from "react";
import {
	User,
	Building,
	Monitor,
	FileText,
	Settings,
	PieChart,
	BarChart2,
	AlertTriangle,
	Server,
	Clock,
	Zap,
} from "lucide-react";

// Admin Dashboard - client component
export default function AdminDashboard(): JSX.Element {
	const [Charts, setCharts] = useState<any>(null);
	const [chartsLoaded, setChartsLoaded] = useState(false);

	// Lazy-load Recharts only in the browser if available. Fallback to inline SVGs when not.
	useEffect(() => {
		let mounted = true;
		(async () => {
			try {
				const recharts = await import("recharts");
				if (!mounted) return;
				setCharts(recharts);
			} catch (e) {
				// ignore - leave Charts null and show placeholders
			} finally {
				if (mounted) setChartsLoaded(true);
			}
		})();
		return () => {
			mounted = false;
		};
	}, []);

	const kpis = useMemo(
		() => [
			{ id: "students", title: "Total Students", value: "1,248", icon: <User size={18} />, accent: "from-indigo-600 to-violet-500" },
			{ id: "hostels", title: "Active Hostels", value: "12", icon: <Building size={18} />, accent: "from-emerald-500 to-teal-400" },
			{ id: "complaints", title: "Open Complaints", value: "24", icon: <AlertTriangle size={18} />, accent: "from-rose-500 to-pink-500" },
			{ id: "staff", title: "Staff / Wardens", value: "58", icon: <Monitor size={18} />, accent: "from-yellow-500 to-amber-400" },
			{ id: "revenue", title: "Monthly Revenue", value: "$42,300", icon: <FileText size={18} />, accent: "from-indigo-500 to-sky-500" },
			{ id: "uptime", title: "Attendance Avg.", value: "91%", icon: <Server size={18} />, accent: "from-violet-500 to-fuchsia-500" },
		],
		[]
	);

	// sample table data
	const recentComplaints = [
		{ hostel: "Maple", type: "Plumbing", status: "Escalated", date: "2026-01-29" },
		{ hostel: "Oak", type: "Electrical", status: "Open", date: "2026-01-28" },
		{ hostel: "Pine", type: "Cleaning", status: "Resolved", date: "2026-01-27" },
	];

	const recentRegs = [
		{ name: "A. Kumar", role: "Student", hostel: "Maple", date: "2026-01-26" },
		{ name: "S. Patel", role: "Warden", hostel: "Oak", date: "2026-01-25" },
	];

	return (
		<div className="min-h-full text-slate-100">
			{/* Header */}
			<header className="mb-6 flex items-start justify-between gap-4">
				<div>
					<h1 className="text-3xl sm:text-4xl font-extrabold text-white">Welcome back, Admin</h1>
					<p className="text-sm text-slate-300 mt-1">System overview & operational metrics</p>
				</div>
				<div className="flex items-center gap-3">
					<button className="px-3 py-2 rounded-full bg-white/6 hover:bg-white/8 transition">Export</button>
					<button className="px-3 py-2 rounded-full bg-gradient-to-r from-indigo-600 to-violet-500 text-white hover:opacity-95 transition">New Report</button>
				</div>
			</header>

			{/* KPI Grid */}
			<section className="mb-6">
				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
					{kpis.map((k) => (
						<div key={k.id} className="p-4 rounded-2xl backdrop-blur-md bg-white/5 border border-white/6 shadow-sm hover:shadow-indigo-600/10 transition">
							<div className="flex items-center justify-between">
								<div>
									<div className="text-sm text-slate-300">{k.title}</div>
									<div className="text-2xl font-semibold text-white mt-1">{k.value}</div>
								</div>
								<div className={`p-2 rounded-lg text-white bg-gradient-to-r ${k.accent}`}>
									{k.icon}
								</div>
							</div>
						</div>
					))}
				</div>
			</section>

			{/* Quick Actions */}
			<section className="mb-6">
				<h2 className="text-lg font-semibold mb-3">Quick Management Actions</h2>
				<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
					<ActionTile label="Manage Hostels" icon={<Building />} />
					<ActionTile label="Manage Users" icon={<User />} />
					<ActionTile label="View Complaints" icon={<AlertTriangle />} />
					<ActionTile label="Post Announcement" icon={<FileText />} />
					<ActionTile label="Generate Reports" icon={<BarChart2 />} />
					<ActionTile label="System Settings" icon={<Settings />} />
				</div>
			</section>

			{/* Analytics */}
			<section className="mb-6 grid grid-cols-1 lg:grid-cols-3 gap-4">
				<div className="lg:col-span-2 bg-white/5 backdrop-blur-md rounded-2xl p-4 shadow-sm">
					<div className="flex items-center justify-between mb-3">
						<h3 className="text-white font-medium">Attendance / Fees Trend</h3>
						<div className="text-sm text-slate-400">Last 30 days</div>
					</div>
					<div className="h-48">
						{Charts ? (
							// Recharts example using dynamic import
							<Charts.ResponsiveContainer width="100%" height="100%">
								<Charts.LineChart data={sampleTrendData()}>
									<Charts.CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
									<Charts.XAxis dataKey="day" stroke="rgba(255,255,255,0.4)" />
									<Charts.YAxis stroke="rgba(255,255,255,0.4)" />
									<Charts.Tooltip contentStyle={{ background: '#0b1220', border: 'none' }} />
									<Charts.Line type="monotone" dataKey="attendance" stroke="#7c3aed" strokeWidth={3} dot={false} />
								</Charts.LineChart>
							</Charts.ResponsiveContainer>
						) : chartsLoaded ? (
							<ChartPlaceholder title="Trend" />
						) : (
							<ChartLoading />
						)}
					</div>
				</div>

				<div className="bg-white/6 backdrop-blur-md rounded-2xl p-4 shadow-sm">
					<div className="flex items-center justify-between mb-3">
						<h3 className="text-white font-medium">Complaint Distribution</h3>
						<div className="text-sm text-slate-400">By status</div>
					</div>
					<div className="h-48 flex items-center justify-center">
						{Charts ? (
							<Charts.ResponsiveContainer width="90%" height="90%">
								<Charts.PieChart>
									<Charts.Pie data={samplePieData()} dataKey="value" nameKey="name" innerRadius={40} outerRadius={60} fill="#8884d8">
										{samplePieData().map((entry: any, index: number) => (
											<Charts.Cell key={`cell-${index}`} fill={['#7c3aed', '#06b6d4', '#f97316'][index % 3]} />
										))}
									</Charts.Pie>
									<Charts.Tooltip />
								</Charts.PieChart>
							</Charts.ResponsiveContainer>
						) : chartsLoaded ? (
							<ChartPlaceholder title="Distribution" />
						) : (
							<ChartLoading />
						)}
					</div>
				</div>
			</section>

			{/* Operational Tables */}
			<section className="mb-6 grid grid-cols-1 lg:grid-cols-2 gap-4">
				<div className="bg-white/5 backdrop-blur-md rounded-2xl p-4 shadow-sm">
					<div className="flex items-center justify-between mb-3">
						<h3 className="text-white font-medium">Recent Complaints</h3>
						<div className="text-sm text-slate-400">New</div>
					</div>
					<div className="overflow-x-auto">
						<table className="w-full text-left text-sm">
							<thead>
								<tr className="text-slate-400">
									<th className="py-2">Hostel</th>
									<th className="py-2">Type</th>
									<th className="py-2">Status</th>
									<th className="py-2">Date</th>
								</tr>
							</thead>
							<tbody>
								{recentComplaints.map((r) => (
									<tr key={r.date} className="border-t border-white/6">
										<td className="py-3">{r.hostel}</td>
										<td className="py-3">{r.type}</td>
										<td className="py-3 text-sm text-slate-200">{r.status}</td>
										<td className="py-3 text-slate-400">{r.date}</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
				</div>

				<div className="bg-white/6 backdrop-blur-md rounded-2xl p-4 shadow-sm">
					<div className="flex items-center justify-between mb-3">
						<h3 className="text-white font-medium">Recent Registrations</h3>
						<div className="text-sm text-slate-400">Latest</div>
					</div>
					<ul className="space-y-3">
						{recentRegs.map((r) => (
							<li key={r.name} className="flex items-center justify-between">
								<div>
									<div className="text-sm text-slate-200">{r.name} <span className="text-xs text-slate-400">• {r.role}</span></div>
									<div className="text-xs text-slate-400">{r.hostel}</div>
								</div>
								<div className="text-xs text-slate-400">{r.date}</div>
							</li>
						))}
					</ul>
				</div>
			</section>

			{/* Alerts + Performance */}
			<section className="grid grid-cols-1 lg:grid-cols-3 gap-4">
				<div className="lg:col-span-1 bg-white/6 backdrop-blur-md rounded-2xl p-4 shadow-sm">
					<div className="flex items-center justify-between mb-3">
						<h3 className="text-white font-medium">Alerts</h3>
						<div className="text-sm text-slate-400">Critical</div>
					</div>
					<ul className="space-y-3">
						<li className="flex items-start gap-3">
							<div className="p-2 rounded-lg bg-gradient-to-r from-rose-500 to-pink-500 text-white"><AlertTriangle size={16} /></div>
							<div>
								<div className="text-sm text-white">Database replication lag detected</div>
								<div className="text-xs text-slate-400">Investigating — 12m</div>
							</div>
						</li>
						<li className="flex items-start gap-3">
							<div className="p-2 rounded-lg bg-gradient-to-r from-indigo-500 to-violet-500 text-white"><Zap size={16} /></div>
							<div>
								<div className="text-sm text-white">Multiple failed login attempts</div>
								<div className="text-xs text-slate-400">Security flagged — 3 accounts</div>
							</div>
						</li>
					</ul>
				</div>

				<div className="lg:col-span-2 bg-white/5 backdrop-blur-md rounded-2xl p-4 shadow-sm">
					<div className="flex items-center justify-between mb-3">
						<h3 className="text-white font-medium">Performance</h3>
						<div className="text-sm text-slate-400">Metrics</div>
					</div>
					<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
						<div className="p-3 bg-white/4 rounded-lg">
							<div className="text-sm text-slate-300">Resolution Time Trend</div>
							<div className="text-2xl font-semibold text-white mt-2">2.4d</div>
						</div>
						<div className="p-3 bg-white/4 rounded-lg">
							<div className="text-sm text-slate-300">Top Hostels (Satisfaction)</div>
							<ol className="mt-2 text-sm text-slate-200 space-y-1">
								<li>Maple — 4.8</li>
								<li>Oak — 4.6</li>
								<li>Pine — 4.5</li>
							</ol>
						</div>
					</div>
				</div>
			</section>
		</div>
	);
}

/* Helpers */
function ActionTile({ label, icon }: { label: string; icon?: React.ReactNode }) {
	return (
		<button className="flex items-center gap-3 p-3 rounded-2xl bg-white/4 hover:bg-white/6 transition shadow-sm">
			<div className="p-2 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-500 text-white">{icon}</div>
			<div className="text-sm text-white">{label}</div>
		</button>
	);
}

function ChartPlaceholder({ title }: { title?: string }) {
	return (
		<div className="w-full h-full flex items-center justify-center text-slate-400">
			<svg width="160" height="80" viewBox="0 0 160 80" fill="none" xmlns="http://www.w3.org/2000/svg">
				<rect width="160" height="80" rx="8" fill="rgba(255,255,255,0.02)" />
				<path d="M10 60 L30 40 L50 50 L70 30 L90 45 L110 25 L130 35 L150 20" stroke="rgba(124,58,237,0.9)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
			</svg>
		</div>
	);
}

function ChartLoading() {
	return <div className="w-full h-full flex items-center justify-center text-slate-400">Loading chart…</div>;
}

function sampleTrendData() {
	return Array.from({ length: 12 }).map((_, i) => ({ day: `D${i + 1}`, attendance: 70 + Math.round(Math.random() * 30) }));
}

function samplePieData() {
	return [
		{ name: 'Resolved', value: 60 },
		{ name: 'Open', value: 25 },
		{ name: 'Escalated', value: 15 },
	];
}

