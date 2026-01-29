'use server';
import { getUser } from "@repo/shared/server";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function Home() {
    const c = await cookies();
    const token = c.get('session-token') || null;
    if (!token) redirect('/auth');
    const user = await getUser(token.value, {
        id: true,
        name: true,
    });

    return (
        <div className="p-6">
            hello {user.name} 
        </div>
    );
}