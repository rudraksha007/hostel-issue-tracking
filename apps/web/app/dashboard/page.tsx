'use server';
import { NavTabs } from "@/app/components/navbar";
import DashboardComponent from "./components/main";
import  {Home}  from "./pages/home";
import { Messages } from "./pages/messages";
import { PostsPage } from "./pages/posts";
import  Profile  from "./pages/profile";
import  Report  from "./pages/report";

const tabs: Record<NavTabs, () => React.ReactNode> = {
    "Home": ()=><Home />,
    "Posts": ()=><PostsPage />,
    "Announcements": ()=><Messages />,
    "Report": ()=><Report />,
    "Profile": ()=><Profile />
}

export default async function Dashboard({ searchParams }: { searchParams: Promise<{ tab?: string }> }) {
    const params = await searchParams;
    let tab = params.tab as NavTabs;
    if (!tab || !(tab in tabs)) tab = "Home";
    const Tab = tabs[tab];
    return (
        <DashboardComponent tab={tab}>
            <Tab />
        </DashboardComponent>
    )
}