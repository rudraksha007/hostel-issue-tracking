'use server';

import { getUser } from "@repo/shared/server";
import { cookies } from "next/headers";
import { MessageRenderer } from "../components/msg-renderer";
import { Unauthorised } from "@/app/components/unauthorised";

export async function Messages() {
    const token = (await cookies()).get('session-token')?.value;
    if (!token) return <Unauthorised />;
    const announcements = await getUser(token, {
        userType: true,
        assignedFloors: {
            select: {
                id: true
            }
        },
        updates: {
            select: {
                id: true,
                title: true,
                content: true
            },
            take: 10,
            orderBy: {
                createdAt: 'desc'
            }
        }
    });
    
    const userFloors = announcements.assignedFloors?.map(f => f.id) || [];
    const canCreateAnnouncement = announcements.userType === 'ADMIN' || announcements.userType === 'WARDEN';
    
    return (
        <MessageRenderer 
            init_messages={announcements.updates} 
            userType={announcements.userType}
            canCreateAnnouncement={canCreateAnnouncement}
            userFloors={userFloors}
        />
    )
}