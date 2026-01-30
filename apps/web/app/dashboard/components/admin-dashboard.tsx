"use client";
import React, { useEffect, useState } from "react";
import {
	User,
	Building,
	FileText,
	Settings,
	BarChart2,
	AlertTriangle,
} from "lucide-react";
import { 
	ResponsiveContainer, 
	LineChart, 
	Line, 
	XAxis, 
	YAxis, 
	CartesianGrid, 
	Tooltip, 
	PieChart, 
	Pie, 
	Cell 
} from 'recharts';


export type KPI = { id: string; title: string; value: string };
export type Complaint = { hostel: string; type: string; status: string; date: string };
export type Registration = { name: string; role: string; hostel: string; date: string };
export type AlertItem = { id: string; title: string; detail?: string; age?: string };
export type Performance = { resolutionTimeDays?: number; topHostels?: Array<{ name: string; score: number }> };

export type AdminData = {
	kpis?: KPI[];
	complaints?: Complaint[];
	registrations?: Registration[];
	alerts?: AlertItem[];
	performance?: Performance;
	trend?: any[];
	pie?: any[];
};

const DEFAULT_ENDPOINTS = {
	kpis: "/api/admin/kpis",
	complaints: "/api/admin/complaints",
	registrations: "/api/admin/registrations",
	alerts: "/api/admin/alerts",
	performance: "/api/admin/performance",
};

async function fetchJson<T>(url: string, signal?: AbortSignal): Promise<T> {
	const res = await fetch(url, { signal });
	if (!res.ok) throw new Error(`${url} -> ${res.status}`);
	return res.json();
}

// Admin Dashboard - client component
export default function AdminDashboard({ serverData, endpoints = DEFAULT_ENDPOINTS }: { serverData?: Partial<AdminData>; endpoints?: Partial<typeof DEFAULT_ENDPOINTS> }): React.ReactElement {
	const [chartsLoaded, setChartsLoaded] = useState(false);
	const [data, setData] = useState<Partial<AdminData> | undefined>(
		serverData ?? {
			kpis: sampleKpis(),
			complaints: sampleComplaints(),
			registrations: sampleRegistrations(),
			alerts: sampleAlerts(),
			performance: {},
			trend: sampleTrendData(),
			pie: samplePieData(),
		}
	);

	// Lazy-load Recharts only in the browser if available. Fallback to inline SVGs when not.
	// useEffect(() => {
	// 	let mounted = true;
	// 	(async () => {
	// 		try {
	// 			if (!mounted) return;
	// 			// normalize: prefer named exports, but if module has default (shim), use it
	// 			// e.g. import('./recharts-shim') returns { default: { ResponsiveContainer... } }
	// 			setCharts((recharts as any)?.default ?? recharts);
	// 		} catch (e) {
	// 			try {
	// 				// fallback to local shim that provides minimal components
	// 				const shim = await import("./recharts-shim");
	// 				if (!mounted) return;
	// 				setCharts((shim as any)?.default ?? shim);
	// 			} catch (e2) {
	// 				// leave Charts null and show placeholders
	// 			}
	// 		} finally {
	// 			if (mounted) setChartsLoaded(true);
	// 		}
	// 	})();
	// 	return () => {
	// 		mounted = false;
	// 	};
	// }, []);

	// Removed backend fetch logic per request — using in-file sample data for now.

	// derive display values strictly from server/fetched data; avoid local dummy fallbacks
	const displayKpis = data?.kpis ?? [];
	const displayComplaints = data?.complaints ?? [];
	const displayRegs = data?.registrations ?? [];
	const displayAlerts = data?.alerts ?? [];
	const displayTrend = data?.trend ?? [];
	const displayPie = data?.pie ?? [];
	const displayPerf = data?.performance ?? undefined;

	// show sample complaints when backend hasn't provided any
	const complaintsToShow = (data?.complaints && data.complaints.length) ? data.complaints : sampleComplaints();

	// fallbacks for registrations and alerts
	const registrationsToShow = (data?.registrations && data.registrations.length) ? data.registrations : sampleRegistrations();
	const alertsToShow = (data?.alerts && data.alerts.length) ? data.alerts : sampleAlerts();

	// Using sample data; no loading or error states required.

	return (
		<div className="min-h-full text-slate-100">
			<div className="max-w-7xl mx-auto p-4 md:p-6 space-y-6">
				{/* Header */}
				<header className="mb-6 flex items-start justify-between gap-4">
					<div>
						<h1 className="text-3xl sm:text-4xl font-extrabold text-white p-4">Welcome back, Admin</h1>
						<p className="text-sm text-slate-300 mt-1 p-2">System overview & operational metrics</p>
					</div>
					<div className="flex items-center gap-3">
						<button className="px-3 py-2 rounded-full bg-white/6 hover:bg-white/8 transition">Export</button>
						<button className="px-3 py-2 rounded-full bg-linear-to-r from-indigo-600 to-violet-500 text-white hover:opacity-95 transition">New Report</button>
					</div>
				</header>

				{/* KPI Grid */}
				<section className="mb-6 px-2 md:px-0">
					<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
						{displayKpis.length > 0 ? (
							displayKpis.map((k) => (
								<div key={k.id} className="p-4 rounded-2xl backdrop-blur-md bg-white/5 border border-white/6 shadow-sm hover:shadow-indigo-600/10 transition">
									<div className="flex items-center justify-between">
										<div>
											<div className="text-sm text-slate-300">{k.title}</div>
											<div className="text-2xl font-semibold text-white mt-1">{k.value}</div>
										</div>
										<div className="p-2 rounded-lg text-white bg-zinc-700/30">
											<div className="w-6 h-6 flex items-center justify-center text-xs font-medium">{k.title?.[0] ?? '•'}</div>
										</div>
									</div>
								</div>
							))
						) : (
							// show empty placeholders when no KPI data provided by backend
							Array.from({ length: 6 }).map((_, i) => (
								<div key={`kp-placeholder-${i}`} className="p-4 rounded-2xl backdrop-blur-md bg-white/3 border border-white/6 shadow-sm animate-pulse">
									<div className="h-6 bg-white/6 rounded mb-2 w-3/4" />
									<div className="h-8 bg-white/8 rounded w-1/2" />
								</div>
							))
						)}
					</div>
				</section>

				{/* Quick Actions */}
				<section className="mb-6 px-2 md:px-0">
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
				<section className="mb-6 grid grid-cols-1 lg:grid-cols-3 gap-4 px-2 md:px-0">
					<div className="lg:col-span-2 bg-white/5 backdrop-blur-md rounded-2xl p-4 shadow-sm">
						<div className="flex items-center justify-between mb-3">
							<h3 className="text-white font-medium">Attendance / Fees Trend</h3>
							<div className="text-sm text-slate-400">Last 30 days</div>
						</div>
						<div className="h-48 p-4">
							<ResponsiveContainer width="100%" height="100%">
								<LineChart data={displayTrend.length ? displayTrend : sampleTrendData()}>
									<CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
									<XAxis dataKey="day" stroke="rgba(255,255,255,0.4)" />
									<YAxis stroke="rgba(255,255,255,0.4)" />
									<Tooltip contentStyle={{ background: '#0b1220', border: 'none' }} />
									<Line type="monotone" dataKey="attendance" stroke="#7c3aed" strokeWidth={3} dot={false} />
								</LineChart>
							</ResponsiveContainer>
						</div>
					</div>

					<div className="bg-white/6 backdrop-blur-md rounded-2xl p-4 shadow-sm">
						<div className="flex items-center justify-between mb-3">
							<h3 className="text-white font-medium">Complaint Distribution</h3>
							<div className="text-sm text-slate-400">By status</div>
						</div>
						<div className="h-48 flex items-center justify-center p-4">
							<ResponsiveContainer width="90%" height="90%">
								<PieChart>
									<Pie data={displayPie.length ? displayPie : samplePieData()} dataKey="value" nameKey="name" innerRadius={40} outerRadius={60} fill="#8884d8">
										{(displayPie.length ? displayPie : samplePieData()).map((entry: any, index: number) => (
											<Cell key={`cell-${index}`} fill={['#7c3aed', '#06b6d4', '#f97316'][index % 3]} />
										))}
									</Pie>
									<Tooltip />
								</PieChart>
							</ResponsiveContainer>
						</div>
					</div>
				</section>

				{/* Operational Tables */}
				<section className="mb-6 grid grid-cols-1 lg:grid-cols-2 gap-4 px-2 md:px-0">
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
									{complaintsToShow.map((r, idx) => (
										<tr key={(r as any).date ?? `c-${idx}`} className="border-t border-white/6">
											<td className="px-3 py-3"><div className="text-sm font-medium text-white">{r.hostel}</div></td>
											<td className="px-3 py-3"><div className="text-sm text-slate-200">{r.type}</div></td>
											<td className="px-3 py-3">
												<span className={`text-xs font-medium inline-block px-2 py-1 rounded-full ${r.status === 'Resolved' ? 'bg-emerald-500 text-white' : r.status === 'Open' ? 'bg-rose-500 text-white' : 'bg-amber-500 text-white'}`}>
													{r.status}
												</span>
											</td>
											<td className="px-3 py-3"><div className="text-xs text-slate-400">{r.date}</div></td>
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
							{registrationsToShow.map((r) => (
								<li key={r.name} className="flex items-center justify-between p-2 rounded-md hover:bg-white/3">
									<div>
										<div className="text-sm font-medium text-white">{r.name} <span className="text-xs text-slate-400">• {r.role}</span></div>
										<div className="text-xs text-slate-400">{r.hostel}</div>
									</div>
									<div className="text-xs text-slate-400">{r.date}</div>
								</li>
							))}
						</ul>
					</div>
				</section>

				{/* Alerts + Performance */}
				<section className="grid grid-cols-1 lg:grid-cols-3 gap-4 px-2 md:px-0">
					<div className="lg:col-span-1 bg-white/6 backdrop-blur-md rounded-2xl p-4 shadow-sm">
						<div className="flex items-center justify-between mb-3">
							<h3 className="text-white font-medium">Alerts</h3>
							<div className="text-sm text-slate-400">Critical</div>
						</div>
						<ul className="space-y-3">
							{alertsToShow.map((a) => (
								<li key={(a as any).id ?? a.title} className="flex items-start gap-3 p-2 rounded-md hover:bg-white/3">
									<div className="p-2 rounded-lg bg-linear-to-r from-rose-500 to-pink-500 text-white"><AlertTriangle size={16} /></div>
									<div>
										<div className="text-sm font-medium text-white">{a.title}</div>
										<div className="text-xs text-slate-400">{a.detail ?? a.age ?? ''}</div>
									</div>
								</li>
							))}
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
									<li className="pt-2">Boys-Hostel 1 — 4.8</li>
									<li className="pt-2">Boys-Hostel 2 — 4.6</li>
									<li className="pt-2">Girls-Hostel 1 — 4.5</li>
								</ol>
							</div>
						</div>
					</div>
				</section>
			</div>
		</div>
	);
}

/* Helpers */
function ActionTile({ label, icon }: { label: string; icon?: React.ReactNode }) {
	return (
		<button className="flex items-center gap-3 p-3 rounded-2xl bg-white/4 hover:bg-white/6 transition shadow-sm">
			<div className="p-2 rounded-xl bg-linear-to-r from-indigo-600 to-violet-500 text-white">{icon}</div>
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

function sampleKpis(): KPI[] {
	return [
		{ id: 'k1', title: 'Active Students', value: '1,024' },
		{ id: 'k2', title: 'Today Tasks', value: '8' },
		{ id: 'k3', title: 'Notices Sent', value: '3' },
		{ id: 'k4', title: 'Alerts', value: '1' },
		{ id: 'k5', title: 'Open Complaints', value: '12' },
		{ id: 'k6', title: 'Resolved Today', value: '6' },
	];
}

function sampleComplaints(): Complaint[] {
	return [
		{ hostel: "Boys-Hostel 1", type: "Plumbing", status: "Open", date: "2026-01-29" },
		{ hostel: "Boys-Hostel 2", type: "Electric", status: "Resolved", date: "2026-01-28" },
		{ hostel: "Girls-Hostel 1", type: "Cleaning", status: "In Progress", date: "2026-01-27" },
	];
}

function sampleRegistrations(): Registration[] {
	return [
		{ name: "Alok Gupta", role: "Student", hostel: "Boys-Hostel 1", date: "2026-01-29" },
		{ name: "Ravi Patel", role: "Warden", hostel: "Boys-Hostel 2", date: "2026-01-28" },
		{ name: "Sana Ali", role: "Staff", hostel: "Girls-Hostel 1", date: "2026-01-27" },
	];
}

function sampleAlerts(): AlertItem[] {
	return [
		{ id: "al1", title: "Water outage in Block A", detail: "Expected to resume by 11:00", age: "2h" },
		{ id: "al2", title: "Power maintenance", detail: "Scheduled tonight 1:00-3:00", age: "6h" },
	];
}

