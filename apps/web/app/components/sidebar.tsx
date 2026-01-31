'use client';
import { UserType } from "@repo/db/browser";
import { X, Home, Settings, Users, FileText, Bell, Shield, Building2, LogOut, Bug, TabletSmartphone } from "lucide-react";
import { useMemo } from "react";
import * as motion from "motion/react-client"
import Link from "next/link";
import { useSession } from "./session-consumer";


export function SideBar({ path, open, setOpen }: { path: string, open: boolean, setOpen: (open: boolean) => void }) {
    const { user } = useSession();
    if (!user) return null;
    const Bars: Record<UserType, () => React.ReactNode> = {
        'ADMIN': () => <AdminSidebar path={path} toggleBar={() => setOpen(false)} />,
        'STUDENT': () => <StudentSidebar path={path} toggleBar={() => setOpen(false)} />,
        'WARDEN': () => <WardenSidebar path={path} toggleBar={() => setOpen(false)} />,
        'STAFF': () => <StaffSidebar path={path} toggleBar={() => setOpen(false)} />,
    }
    const Bar = useMemo(() => Bars[user.userType], [user.userType, path]);
    return (
        <>
            {/* Backdrop */}
            {open && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.15 }}
                    className="absolute inset-0 bg-black/40 z-200"
                    onClick={() => setOpen(false)}
                />
            )}

            {/* Sidebar */}
            <motion.div
                initial={{ x: '-100%' }}
                animate={{ x: open ? 0 : '-100%' }}
                transition={{ type: 'spring', damping: 30, stiffness: 300 }}
                className="absolute left-0 top-0 h-full w-80 bg-white backdrop-blur-sm dark:bg-slate-950/60 border-r border-slate-200 dark:border-slate-800 shadow-2xl z-300 overflow-y-auto will-change-transform"
            >
                <div className="p-6">
                    <div className="flex items-center justify-between mb-8">
                        <h2 className="text-2xl font-bold bg-linear-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">
                            Menu
                        </h2>
                        <button
                            onClick={() => setOpen(false)}
                            className="p-2 hover:bg-black/5 dark:hover:bg-white/10 rounded-xl transition-all duration-300 active:scale-95"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                    <Bar />
                </div>
            </motion.div>
        </>
    )
}

function AdminSidebar({ path, toggleBar }: { path: string, toggleBar: () => void }) {
    const menuItems = [
        { icon: Home, label: 'Dashboard', href: '/dashboard' },
        { icon: Users, label: 'Manage Users', href: '/users' },
        { icon: Building2, label: 'Management', href: '/management' },
        { icon: Bug, label: 'Issues', href: '/issues' },
        { icon: TabletSmartphone, label: 'Lost and Found', href: '/lnf' },
        { icon: LogOut, label: 'Logout', href: '/logout' },
    ];

    return (
        <nav className="space-y-2">
            {menuItems.map((item) => (
                <Link
                    key={item.label}
                    href={item.href}
                    onClick={toggleBar}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-black/5 dark:hover:bg-white/10 transition-all ${path === item.href ? "bg-black/10 dark:bg-white/20" : ""} duration-200 group`}
                >
                    <item.icon className="w-5 h-5 text-slate-600 dark:text-slate-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors" />
                    <span className="font-medium text-slate-700 dark:text-slate-300 group-hover:text-slate-900 dark:group-hover:text-white transition-colors">
                        {item.label}
                    </span>
                </Link>
            ))}
        </nav>
    );
}

function StudentSidebar({ path, toggleBar }: { path: string, toggleBar: () => void }) {
    const menuItems = [
        { icon: Home, label: 'Dashboard', href: '/dashboard' },
        { icon: FileText, label: 'My Issues', href: '/issues' },
        { icon: TabletSmartphone, label: 'Lost and Found', href: '/lnf' },
        { icon: LogOut, label: 'Logout', href: '/logout' },
    ];

    return (
        <nav className="space-y-2">
            {menuItems.map((item) => (
                <Link
                    key={item.label}
                    href={item.href}
                    onClick={toggleBar}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-black/5 dark:hover:bg-white/10 transition-all ${path === item.href ? "bg-black/10 dark:bg-white/20" : ""} duration-200 group`}
                >
                    <item.icon className="w-5 h-5 text-slate-600 dark:text-slate-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors" />
                    <span className="font-medium text-slate-700 dark:text-slate-300 group-hover:text-slate-900 dark:group-hover:text-white transition-colors">
                        {item.label}
                    </span>
                </Link>
            ))}
        </nav>
    );
}

function WardenSidebar({ path, toggleBar }: { path: string, toggleBar: () => void }) {
    const menuItems = [
        { icon: Home, label: 'Dashboard', href: '/dashboard' },
        { icon: Bug, label: 'Issues', href: '/issues' },
        { icon: Users, label: 'Students', href: '/users' },
        { icon: TabletSmartphone, label: 'Lost and Found', href: '/lnf' },
        { icon: LogOut, label: 'Logout', href: '/logout' },
    ];

    return (
        <nav className="space-y-2">
            {menuItems.map((item) => (
                <Link
                    key={item.label}
                    href={item.href}
                    onClick={toggleBar}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-black/5 dark:hover:bg-white/10 transition-all ${path === item.href ? "bg-black/10 dark:bg-white/20" : ""} duration-200 group`}
                >
                    <item.icon className="w-5 h-5 text-slate-600 dark:text-slate-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors" />
                    <span className="font-medium text-slate-700 dark:text-slate-300 group-hover:text-slate-900 dark:group-hover:text-white transition-colors">
                        {item.label}
                    </span>
                </Link>
            ))}
        </nav>
    );
}

function StaffSidebar({ path, toggleBar }: { path: string, toggleBar: () => void }) {
    const menuItems = [
        { icon: Home, label: 'Dashboard', href: '/dashboard' },
        { icon: FileText, label: 'Assigned Issues', href: '/issues' },
        { icon: Bell, label: 'Notifications', href: '/notifications' },
        { icon: TabletSmartphone, label: 'Lost and Found', href: '/lnf' },
        { icon: LogOut, label: 'Logout', href: '/logout' },
    ];

    return (
        <nav className="space-y-2">
            {menuItems.map((item) => (
                <Link
                    key={item.label}
                    href={item.href}
                    onClick={toggleBar}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-black/5 dark:hover:bg-white/10 transition-all ${path === item.href ? "bg-black/10 dark:bg-white/20" : ""} duration-200 group`}
                >
                    <item.icon className="w-5 h-5 text-slate-600 dark:text-slate-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors" />
                    <span className="font-medium text-slate-700 dark:text-slate-300 group-hover:text-slate-900 dark:group-hover:text-white transition-colors">
                        {item.label}
                    </span>
                </Link>
            ))}
        </nav>
    );
}