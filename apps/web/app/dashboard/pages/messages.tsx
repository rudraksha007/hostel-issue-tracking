'use server';

import { getUser } from "@repo/shared/server";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { MessageRenderer } from "../components/msg-renderer";

export async function Messages() {
    const token = (await cookies()).get('session-token')?.value;
    if (!token) redirect('/auth');
    const announcements = await getUser(token, {
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
    return (
        <MessageRenderer init_messages={announcements.updates} />
    )
}