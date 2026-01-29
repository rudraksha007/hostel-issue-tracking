import { BugPlay, Home, Send, User, Users2 } from "lucide-react";
import { useMemo } from "react";

type NavbarProps = {
    selected: NavTabs;
    setSelected: (s: NavTabs) => void;
}

export type NavTabs = "Home" | "Posts" | "Announcements" | "Report" | "Profile";

export function Navbar({ selected, setSelected }: NavbarProps) {
    const tabs = useMemo(()=> {
        return ["Home", "Posts", "Announcements", "Report", "Profile"].map(tab => getTab(tab as NavTabs, selected, setSelected));
    }, [selected]);
    return (
        <>
            {/* nav holder sits at the bottom of the page ensuring no content is covered by navbar */}
            <div id="nav-holder" className="w-screen h-[8dvh] bg-transparent" />
            <nav className="w-screen h-[8dvh] backdrop-blur-xl bg-linear-to-t from-white/95 via-white/90 to-white/85 dark:from-slate-950/95 dark:via-slate-950/90 dark:to-slate-950/85 flex fixed bottom-0 text-foreground border-t border-white/20 dark:border-slate-700/50 shadow-[0_-4px_20px_rgba(0,0,0,0.05)] dark:shadow-[0_-4px_20px_rgba(0,0,0,0.3)] z-100">
                {tabs}
            </nav>
        </>
    )
}

function getTab(n: NavTabs, selected: NavTabs, setSelected: (s: NavTabs) => void) {
    const isSelected = selected === n;
    const map = {
        "Home": <Home className={`transition-all duration-300 ${isSelected ? 'w-6 h-6' : 'w-5 h-5'}`} />,
        "Posts": <Users2 className={`transition-all duration-300 ${isSelected ? 'w-6 h-6' : 'w-5 h-5'}`} />,
        "Announcements": <Send className={`transition-all duration-300 ${isSelected ? 'w-6 h-6' : 'w-5 h-5'}`} />,
        "Report": <BugPlay className={`transition-all duration-300 ${isSelected ? 'w-6 h-6' : 'w-5 h-5'}`} />,
        "Profile": <User className={`transition-all duration-300 ${isSelected ? 'w-6 h-6' : 'w-5 h-5'}`} />
    }
    return (
        <div 
            key={n} 
            className={`flex-1 flex flex-col h-full items-center justify-center cursor-pointer transition-all duration-300 relative group active:scale-95 ${
                isSelected 
                    ? 'text-blue-600 dark:text-blue-400' 
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`} 
            onClick={() => setSelected(n)}
        >
            <div className="relative">
                {map[n]}
                {isSelected && (
                    <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-blue-600 dark:bg-blue-400 rounded-full animate-pulse" />
                )}
            </div>
            {isSelected && (
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 h-1 bg-linear-to-r from-transparent via-blue-600 dark:via-blue-400 to-transparent w-full animate-in fade-in slide-in-from-bottom-2 duration-300" />
            )}
        </div>
    )
}