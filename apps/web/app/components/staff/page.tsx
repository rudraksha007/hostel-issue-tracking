"use client";

import React, { useEffect, useState } from "react";
import {
	BellIcon,
	ClipboardList,
	CheckSquare,
	AlertTriangle,
	Calendar,
	ClipboardCheck,
	Phone,
	Wrench,
} from "lucide-react";

/*
	Backend-ready notes (expected API endpoints and shapes):
	- GET /api/staff/kpis -> { kpis: Array<{ label: string; value: number }> }
	- GET /api/staff/tasks -> { tasks: Array<Task> }
	- GET /api/staff/schedule -> { schedule: Array<ScheduleItem> }
	- GET /api/staff/performance -> { completion: number, weekly: number[] }

	The component accepts optional `serverData` prop so you can render it server-side
	and hydrate on the client without extra fetches.
*/

export type KPI = { label: string; value: number };
export type Task = { id: string | number; title: string; due?: string; assignee?: string; status?: string };
export type ScheduleItem = { time: string; event: string };
export type Performance = { completion: number; weekly: number[] };

export type StaffData = {
	kpis: KPI[];
	tasks: Task[];
	schedule: ScheduleItem[];
	performance: Performance;
	status?: { equipment?: string; onDuty?: string; shift?: string };
};

const DEFAULT_ENDPOINTS = {
	kpis: "/api/staff/kpis",
	tasks: "/api/staff/tasks",
	schedule: "/api/staff/schedule",
	performance: "/api/staff/performance",
};

async function fetchJson<T>(url: string, signal?: AbortSignal): Promise<T> {
	const res = await fetch(url, { signal });
	if (!res.ok) throw new Error(`Failed to fetch ${url}: ${res.status}`);
	return await res.json();
}

export default function StaffHome({
	serverData,
	endpoints = DEFAULT_ENDPOINTS,
}: {
	serverData?: Partial<StaffData>;
	endpoints?: Partial<typeof DEFAULT_ENDPOINTS>;
}) {
	const [data, setData] = useState<Partial<StaffData> | undefined>(serverData);
	const [loading, setLoading] = useState(!serverData);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		if (serverData) return; // already hydrated from server

		const controller = new AbortController();
		setLoading(true);
		setError(null);

		Promise.all([
			fetchJson<{ kpis: KPI[] }>(endpoints.kpis!, controller.signal).catch((e) => ({ kpis: [] })),
			fetchJson<{ tasks: Task[] }>(endpoints.tasks!, controller.signal).catch((e) => ({ tasks: [] })),
			fetchJson<{ schedule: ScheduleItem[] }>(endpoints.schedule!, controller.signal).catch((e) => ({ schedule: [] })),
			fetchJson<Performance>(endpoints.performance!, controller.signal).catch((e) => ({ completion: 0, weekly: [] })),
		])
			.then(([kpisRes, tasksRes, scheduleRes, perfRes]) => {
				setData({
					kpis: (kpisRes as any).kpis ?? [],
					tasks: (tasksRes as any).tasks ?? [],
					schedule: (scheduleRes as any).schedule ?? [],
					performance: (perfRes as any) ?? { completion: 0, weekly: [] },
				});
			})
			.catch((e) => setError(String(e)))
			.finally(() => setLoading(false));

		return () => controller.abort();
	}, [serverData, endpoints.kpis, endpoints.tasks, endpoints.schedule, endpoints.performance]);

	return (
		<div className="p-6 space-y-6">
			<header className="flex items-start justify-between gap-6">
				<div>
					<h1 className="text-2xl font-semibold text-foreground">Staff Dashboard</h1>
					<p className="text-sm text-text-muted">Daily operations & assigned tasks</p>
				</div>
				<div className="flex items-center gap-3">
					<button className="inline-flex items-center gap-2 rounded-md bg-gradient-to-r from-indigo-600 to-purple-600 px-3 py-2 text-sm text-white shadow hover:brightness-105 transition">
						<BellIcon size={16} /> Alerts
					</button>
				</div>
			</header>

			{loading ? (
				<div className="p-6 rounded-xl bg-[rgba(255,255,255,0.02)] text-text-muted">Loading dashboard...</div>
			) : error ? (
				<div className="p-6 rounded-xl bg-[rgba(255,0,0,0.04)] text-red-300">Error loading dashboard: {error}</div>
			) : (
				<StaffDashboard data={data as StaffData} />
			)}
		</div>
	);
}

function StaffDashboard({ data }: { data: StaffData }) {
	// prefer server-provided data; fall back to empty arrays/undefined
	const kpis = data.kpis ?? [];
	const tasks = data.tasks ?? [];
	const schedule = data.schedule ?? [];
	const perf = data.performance ?? { completion: 0, weekly: [] };
	const status = data.status ?? { equipment: undefined, onDuty: undefined, shift: undefined };

	return (
		<>
			<section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
				{kpis.length > 0 ? kpis.map((k) => (
					<div
						key={k.label}
						className="backdrop-blur-sm bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.06)] p-4 rounded-xl hover:translate-y-[-2px] transition transform"
						style={{ boxShadow: "0 6px 18px rgba(10,11,20,0.35)" }}
					>
						<div className="flex items-center justify-between">
							<div className="text-sm text-text-muted">{k.label}</div>
							<div className="p-2 rounded-md bg-gradient-to-br from-indigo-500 to-purple-500 text-white">
								{/* icon placeholder */}
								<ClipboardList size={18} />
							</div>
						</div>
						<div className="mt-4 text-2xl font-bold text-foreground">{k.value}</div>
						<div className="mt-2 text-xs text-text-muted">since start of day</div>
					</div>
						)) : (
						Array.from({ length: 3 }).map((_, i) => (
							<div key={`kp-placeholder-${i}`} className="backdrop-blur-sm bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.06)] p-4 rounded-xl animate-pulse">
								<div className="h-4 bg-white/8 rounded w-3/4 mb-2" />
								<div className="h-6 bg-white/10 rounded w-1/2" />
							</div>
						))
					)}
			</section>

			<section>
				<h2 className="mb-3 text-lg font-medium text-foreground">Quick Actions</h2>
				<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
					<Action title="View assigned" icon={<ClipboardList size={16} />} />
					<Action title="Update status" icon={<CheckSquare size={16} />} />
					<Action title="Report incident" icon={<AlertTriangle size={16} />} accent />
					<Action title="Check schedule" icon={<Calendar size={16} />} />
					<Action title="Contact warden" icon={<Phone size={16} />} />
				</div>
			</section>

			<div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
				<div className="lg:col-span-2 space-y-4">
					<div className="backdrop-blur-sm bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.06)] rounded-xl p-4">
						<h3 className="font-semibold text-foreground">Work Queue</h3>
						<div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-4">
							<div>
								<h4 className="text-sm text-text-muted">Tasks / Maintenance</h4>
								<ul className="mt-3 space-y-2">
									{tasks.map((t) => (
										<li key={t.id} className="flex items-center justify-between p-3 rounded-lg bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.03)] hover:bg-[rgba(255,255,255,0.04)] transition">
											<div>
												<div className="font-medium text-foreground">{t.title}</div>
												<div className="text-xs text-text-muted">{t.assignee ?? '—'}{t.due ? ` • due ${t.due}` : ''}</div>
											</div>
											<div className="text-sm text-text-muted">{t.status}</div>
										</li>
									))}
								</ul>
							</div>

							<div>
								<h4 className="text-sm text-text-muted">Today’s schedule</h4>
								<div className="mt-3 space-y-2">
									{schedule.length > 0 ? schedule.map((s) => (
										<div key={s.time} className="flex items-center justify-between p-3 rounded-lg bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.03)]">
											<div className="text-sm font-medium text-foreground">{s.event}</div>
											<div className="text-xs text-text-muted">{s.time}</div>
										</div>
									)) : (
										<div className="text-sm text-text-muted">No schedule for today.</div>
									)}
								</div>
							</div>
						</div>
					</div>

					<div className="backdrop-blur-sm bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.06)] rounded-xl p-4">
						<h3 className="font-semibold text-foreground">Status Panel</h3>
						<div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-4">
							<div className="p-3 rounded-lg bg-[rgba(255,255,255,0.02)]">
								<div className="text-xs text-text-muted">Equipment</div>
								<div className="mt-2 font-medium text-foreground">{status.equipment ?? '—'}</div>
							</div>
							<div className="p-3 rounded-lg bg-[rgba(255,255,255,0.02)]">
								<div className="text-xs text-text-muted">On-duty</div>
								<div className="mt-2 font-medium text-foreground">{status.onDuty ?? '—'}</div>
							</div>
							<div className="p-3 rounded-lg bg-[rgba(255,255,255,0.02)]">
								<div className="text-xs text-text-muted">Shift</div>
								<div className="mt-2 font-medium text-foreground">{status.shift ?? '—'}</div>
							</div>
						</div>
					</div>
				</div>

				<aside className="space-y-4">
					<div className="backdrop-blur-sm bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.06)] rounded-xl p-4">
						<h3 className="font-semibold text-foreground">Performance</h3>
						<div className="mt-4">
							<div className="text-xs text-text-muted">Task completion</div>
							<div className="mt-2 w-full bg-[rgba(255,255,255,0.03)] rounded-full h-3 overflow-hidden">
								<div className="h-3 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500" style={{ width: `${perf.completion}%` }} />
							</div>
							<div className="mt-3 text-sm font-medium text-foreground">{perf.completion}% completed</div>
						</div>
						<div className="mt-4">
							<div className="text-xs text-text-muted">Weekly productivity</div>
							<div className="mt-2 grid grid-cols-7 gap-1">
								{Array.from({ length: 7 }).map((_, i) => (
									<div key={i} className={`h-6 rounded ${perf.weekly[i] && perf.weekly[i] > 0 ? "bg-gradient-to-b from-indigo-400 to-purple-600" : "bg-[rgba(255,255,255,0.03)]"}`} />
								))}
							</div>
						</div>
					</div>

					<div className="backdrop-blur-sm bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.06)] rounded-xl p-4">
						<h4 className="text-sm text-text-muted">Need help?</h4>
						<div className="mt-3 flex flex-col gap-2">
							<button className="inline-flex items-center gap-2 rounded-md px-3 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white">Contact Warden</button>
							<button className="inline-flex items-center gap-2 rounded-md px-3 py-2 bg-transparent border border-[rgba(255,255,255,0.06)] text-foreground">Report incident</button>
						</div>
					</div>
				</aside>
			</div>
		</>
	);
}

function Action({ title, icon, accent = false }: { title: string; icon: React.ReactNode; accent?: boolean }) {
	return (
		<div className={`flex items-center gap-3 p-3 rounded-lg ${accent ? "bg-gradient-to-br from-indigo-600 to-purple-600 text-white" : "bg-[rgba(255,255,255,0.02)] text-foreground"} hover:scale-[1.01] transition`}>
			<div className={`p-2 rounded-md ${accent ? "bg-white/10" : "bg-[rgba(255,255,255,0.04)]"}`}>{icon}</div>
			<div className="text-sm font-medium">{title}</div>
		</div>
	);
}

