"use client";
import React, { useEffect, useState } from "react";
import { User, CheckCircle, AlertCircle, Megaphone, FileText, Calendar } from "lucide-react";

type CardData = { title: string; value: string; key?: string };
type Activity = { title: string; time: string; status: string };
type HostelInfo = { block?: string; room?: string; warden?: string; leaveStatus?: string };
type AlertItem = { id: string; title?: string; info?: string; when?: string };

type Props = { user?: { id?: string; name?: string } };

export function UserDashboard({ user }: Props) {
  const [imgError, setImgError] = useState(false);

  // Dummy data — replace with backend once ready
  const displayCards: CardData[] = [
    { key: 'attendance', title: 'Attendance', value: '92%' },
    { key: 'fees', title: 'Fees Due', value: '₹1,200' },
    { key: 'cgpa', title: 'CGPA', value: '8.6' },
    { key: 'notices', title: 'Notices', value: '2' },
  ];

  const displayActivities: Activity[] = [
    { title: 'Signed complaint: Broken light', time: '2 hours ago', status: 'Open' },
    { title: 'Mess menu updated', time: 'Yesterday', status: 'Info' },
    { title: 'Room inspection scheduled', time: '3 days', status: 'Upcoming' },
  ];

  const displayHostel: HostelInfo = { block: 'A', room: '203', warden: 'Mr. Patel', leaveStatus: 'No pending leaves' };

  const displayAlerts: AlertItem[] = [
    { id: 'a1', title: 'Electricity maintenance', info: '2 hours planned outage', when: 'Tomorrow 10:00' },
  ];

  const avatarSeed = user?.id ?? user?.name ?? "student";
  const avatarUrl = `https://avatars.dicebear.com/api/initials/${encodeURIComponent(String(avatarSeed))}.svg`;

  const attendanceCard = displayCards.find((c) => (c.key === "attendance") || /attendance/i.test(c.title));
  const attendancePercent = attendanceCard ? Number(String(attendanceCard.value).replace(/[^0-9.]/g, "")) || 0 : 0;

  const [loaded, setLoaded] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setLoaded(true), 120);
    return () => clearTimeout(t);
  }, []);

  const feesCard = displayCards.find((c) => (c.key === "fees") || /fee|due|balance|payment|bill/i.test(c.title));
  const cgpaCard = displayCards.find((c) => (c.key === "cgpa") || /cgpa|gpa|cumulative/i.test(c.title));
  const feesValue = feesCard?.value ?? "—";
  const cgpaValue = cgpaCard?.value ?? "—";

  return (
    <div className="min-h-full text-slate-100 p-6 md:p-8">
      <header className="mb-6 flex flex-col sm:flex-row items-start justify-between gap-4">
        <div className="flex items-start gap-4">
          <div className="h-16 w-16 rounded-full bg-linear-to-br from-indigo-600 to-pink-500 flex items-start justify-center pt-2 text-white shadow-lg self-start overflow-hidden">
            {!imgError ? (
              <User size={28} className="block text-white" aria-hidden />
            ) : (
              <User size={28} className="block text-white" aria-hidden />
            )}
          </div>
          <div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white">Good to see you{user?.name ? `, ${user.name.split(" ")[0]}` : ', Student'}</h1>
            <p className="text-sm text-slate-300 mt-1">Welcome back — here’s a quick snapshot of your hostel life.</p>
            <div className="mt-3 flex items-center gap-2 text-xs text-slate-300">
              <div className="px-2 py-1 rounded-full bg-white/4">{displayAlerts.length} alerts</div>
              <div className="px-2 py-1 rounded-full bg-white/4">Attendance: {attendancePercent}%</div>
              <div className="px-2 py-1 rounded-full bg-white/4">Hostel: {displayHostel?.block ?? '—'}</div>
            </div>
          </div>
        </div>
        <div className="mt-4 sm:mt-0">
          <button className="px-4 py-2 rounded-full bg-linear-to-r from-indigo-600 to-teal-500 text-white shadow hover:opacity-95 transition">My Profile</button>
        </div>
      </header>

      {/* Welcome / Summary hero */}
      <div className="mb-6">
        <div className="rounded-2xl bg-linear-to-r from-zinc-900/60 to-zinc-900/40 p-5 shadow-lg border border-white/5">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-start gap-4">
              <div className="h-20 w-20 rounded-full bg-linear-to-br from-indigo-600 to-pink-500 flex items-center justify-center text-white shadow-lg self-start overflow-hidden">
                {!imgError ? (
                  <User size={34} className="block text-white" aria-hidden />
                ) : (
                  <User size={34} className="block text-white" aria-hidden />
                )}
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">Welcome{user?.name ? `, ${user.name.split(' ')[0]}` : ''} 👋</h2>
                <p className="text-sm text-slate-300 mt-1">Hostel: <span className="font-medium text-white">{displayHostel?.block ?? '—'}</span> — Room <span className="font-medium text-white">{displayHostel?.room ?? '—'}</span></p>
                <p className="text-sm text-slate-400 mt-2">Here's your quick summary — tap the card for details.</p>
              </div>
            </div>

            <div className="w-full sm:w-auto">
              <div className="grid grid-cols-3 gap-3">
                <div className="col-span-3 sm:col-span-1">
                  <div className="rounded-lg bg-white/5 p-3 text-center hover:shadow-lg transition-transform transform hover:-translate-y-1">
                    <div className="text-xs text-slate-300">Attendance</div>
                    <div className="mt-2 text-lg font-semibold text-white">{attendancePercent}%</div>
                    <div className="mt-2 w-full bg-white/8 h-2 rounded overflow-hidden">
                      <div className={`h-2 rounded bg-linear-to-r from-emerald-400 to-teal-300 transition-all duration-1000 ease-out`} style={{ width: loaded ? `${attendancePercent}%` : '0%' }} />
                    </div>
                  </div>
                </div>

                <div className="col-span-3 sm:col-span-1">
                  <div className="rounded-lg bg-white/5 p-3 text-center hover:shadow-lg transition-transform transform hover:-translate-y-1">
                    <div className="text-xs text-slate-300">Fees</div>
                    <div className="mt-2 text-lg font-semibold text-white">{feesValue}</div>
                  </div>
                </div>

                <div className="col-span-3 sm:col-span-1">
                  <div className="rounded-lg bg-white/5 p-3 text-center hover:shadow-lg transition-transform transform hover:-translate-y-1">
                    <div className="text-xs text-slate-300">CGPA</div>
                    <div className="mt-2 text-lg font-semibold text-white">{cgpaValue}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {displayCards.length > 0 ? (
          displayCards.map((c) => (
            <Card
              key={c.key ?? c.title}
              title={c.title}
              value={c.value}
              icon={/attendance/i.test(c.title) ? <CheckCircle /> : /alert|notice|announcement/i.test(c.title) ? <Megaphone /> : /fee|bill|payment/i.test(c.title) ? <FileText /> : <CheckCircle />}
              accent={/attendance/i.test(c.title) ? 'from-emerald-400 to-teal-400' : 'from-indigo-600 to-violet-500'}
            />
          ))
        ) : (
          Array.from({ length: 4 }).map((_, i) => (
            <div key={`card-skel-${i}`} className="p-6 rounded-2xl backdrop-blur-md bg-white/6 border border-white/6 shadow-lg animate-pulse">
              <div className="h-3 bg-white/8 rounded w-1/3 mb-3" />
              <div className="h-5 bg-white/10 rounded w-2/3" />
            </div>
          ))
        )}
      </section>

      <section className="mb-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white/5 backdrop-blur-md rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-white font-medium p-4">Recent Activity</h3>
            <div className="text-sm text-slate-400 p-4">Live</div>
          </div>
          <ul className="space-y-4">
            {displayActivities.length > 0 ? (
              displayActivities.map((a, idx) => (
                <ActivityItem key={idx} title={a.title} time={a.time} status={a.status} />
              ))
            ) : (
              <li className="text-sm text-slate-400">No recent activity.</li>
            )}
          </ul>
        </div>

        <aside className="bg-white/6 backdrop-blur-md rounded-2xl p-6 shadow-sm">
          <h4 className="text-white font-medium mb-3">Hostel Info</h4>
          <div className="text-sm text-slate-300 space-y-2">
            <div>Block: {displayHostel?.block ?? '—'}</div>
            <div>Room: {displayHostel?.room ?? '—'}</div>
            <div>Warden: {displayHostel?.warden ?? '—'}</div>
            <div>Leave Status: {displayHostel?.leaveStatus ?? '—'}</div>
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

      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white/5 backdrop-blur-md rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-white font-medium p-4">Attendance Progress</h3>
            <div className="text-sm text-slate-400 p-4">This month</div>
          </div>
          <div className="w-full bg-white/8 rounded-full h-4 overflow-hidden">
            <div className="h-4 rounded-full bg-linear-to-r from-emerald-500 to-teal-400 shadow-md" style={{ width: `${attendancePercent}%` }} />
          </div>
          <div className="mt-3 text-sm text-slate-300 p-3">{attendancePercent > 0 ? `Attendance: ${attendancePercent}%` : 'Attendance data unavailable'}</div>
        </div>

        <div className="bg-white/6 backdrop-blur-md rounded-2xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-white font-medium">Alerts</h3>
            <div className="text-sm text-slate-400">Critical</div>
          </div>
          <ul className="space-y-3">
            {displayAlerts.length > 0 ? (
              displayAlerts.map((a) => (
                <li key={a.id} className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-linear-to-r from-rose-500 to-pink-500 text-white">
                    <AlertCircle size={18} />
                  </div>
                  <div>
                    <div className="text-sm text-white font-medium">{a.title}</div>
                    <div className="text-xs text-slate-400">{a.info ?? a.when}</div>
                  </div>
                </li>
              ))
            ) : (
              <li className="text-sm text-slate-400">No alerts.</li>
            )}
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
        <div className={`p-2 rounded-lg text-white bg-linear-to-r ${accent || 'from-indigo-600 to-violet-500'}`}>
          {icon}
        </div>
      </div>
    </div>
  );
}

function ActivityItem({ title, time, status }: { title: string; time: string; status: string }) {
  return (
    <li className="flex items-start justify-between gap-4 p-3">
      <div>
        <div className="text-sm text-slate-200">{title}</div>
        <div className="text-xs text-slate-400">{time}</div>
      </div>
      <div className="text-xs text-slate-400">{status}</div>
    </li>
  );
}