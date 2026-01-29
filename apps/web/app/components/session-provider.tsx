''
import { getUser } from "@repo/shared/server";
import { cookies } from "next/headers"
import { SessionConsumer } from "./session-consumer";
import Auth from "./Auth";

export async function EnsureSession({ children }: { children: React.ReactNode }) {
    const c = await cookies();
    const token = c.get('session-token')?.value;
    if (!token) return <Auth />;
    const user = await getUser(token, { id: true, name: true, userType: true, email: true, phone: true});
    return (
        <SessionConsumer user={user}>
            {children}
        </SessionConsumer>
    )
}