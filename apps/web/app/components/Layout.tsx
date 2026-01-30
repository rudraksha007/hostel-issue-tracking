'use client';
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { UserType } from "@repo/db/browser";
import { TopBar } from "@/app/components/topbar";
import { SideBar } from "@/app/components/sidebar";
// "Home" | "Posts" | "Announcements" | "Report" | "Profile"
function titleFromPath(path: string, tab?: string) {
    const paths = {
        '/dashboard:Home': 'Home',
        '/dashboard:Posts': 'Posts',
        '/dashboard:Announcements': 'Announcements',
        '/dashboard:Report': 'Report',
        '/dashboard:Profile': 'Profile',
        '/users:': 'Users',
        '/management:': 'Management',
        '/issues:': 'Issues',
        '/settings': 'Settings'
    }
    return paths[`${path}:${tab??""}` as keyof typeof paths] || 'Dashboard';
}

export function Layout({ children, mode }: { children: React.ReactNode, mode: UserType }) {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const path = usePathname();
    const param = (useSearchParams()).get('tab') || undefined;


    return (
        <div className="h-screen w-screen relative">
            <TopBar title={titleFromPath(path, param)} toggleSidebar={() => setSidebarOpen(prev => !prev)} />
            <SideBar open={sidebarOpen} setOpen={setSidebarOpen} path={path} />
            <main className="pt-[6dvh] h-full w-full overflow-auto">
                {children}
            </main>
        </div>
    )
}