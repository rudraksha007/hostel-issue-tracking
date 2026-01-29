import { Bell, Menu } from "lucide-react";

type TopBarProps = {
    title: string;
    toggleSidebar: () => void;
}
export function TopBar({ title, toggleSidebar }: TopBarProps) {
    return (
        <>
            <div className="fixed top-0 left-0 right-0 h-[6dvh] flex items-center justify-between px-6 z-100 backdrop-blur-xl bg-linear-to-b from-white/95 via-white/90 to-white/85 dark:from-slate-950/95 dark:via-slate-950/90 dark:to-slate-950/85 border-b border-white/20 dark:border-slate-700/50 text-foreground shadow-lg shadow-black/5 dark:shadow-black/20">
                <button onClick={() => toggleSidebar()} className="p-2 hover:bg-black/5 dark:hover:bg-white/10 rounded-xl transition-all duration-300 active:scale-95 relative z-110">
                    <Menu className="w-5 h-5" />
                </button>
                <h1 className="flex-1 text-center text-lg font-semibold tracking-tight text-slate-900 dark:text-white">{title}</h1>
                <button className="p-2 hover:bg-black/5 dark:hover:bg-white/10 rounded-xl transition-all duration-300 active:scale-95 relative">
                    <Bell className="w-5 h-5" />
                    <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white dark:ring-slate-950 animate-pulse" />
                </button>
            </div>
            {/* <div className="w-full h-[6dvh] bg-transparent" /> */}
        </>

    )
}