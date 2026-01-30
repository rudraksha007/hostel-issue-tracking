'use server';
import { getUser } from "@repo/shared/server";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { StaffDashboard } from "../components/staff-dashboard";
import { WardenDashboard } from "../components/warden-dashboard";
import AdminDashboard from "../components/admin-dashboard";
import  {UserDashboard}  from "../components/user-dashboard";

export async function Home() {
    const c = await cookies();
    const token = c.get('session-token') || null;
    if (!token) redirect('/auth');
    const user = await getUser(token.value, {
        id: true,
        name: true,
        userType: true
    });
    if(user.userType ==="ADMIN") return <AdminDashboard />;
    if(user.userType ==="STUDENT") return <UserDashboard/>;
    if(user.userType ==="STAFF") return <StaffDashboard />;
    if(user.userType ==="WARDEN") return <WardenDashboard />;

  
}