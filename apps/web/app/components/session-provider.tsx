''
import { getUser } from "@repo/shared/server";
import { cookies } from "next/headers"
import { SessionConsumer } from "./session-consumer";
import Auth from "./Auth";
import { AuthError, ServerError } from "@repo/shared/errors";
import { Unauthorised } from "./unauthorised";
import ErrorPage from "./error";

export async function EnsureSession({ children }: { children: React.ReactNode }) {
    try {
        const c = await cookies();
        const token = c.get('session-token')?.value;
        if (!token) return <Auth />;
        const user = await getUser(token, { id: true, name: true, userType: true, email: true, phone: true });
        return (
            <SessionConsumer user={user}>
                {children}
            </SessionConsumer>
        )
    } catch (error) {
        if (error instanceof AuthError) return <Unauthorised />
        else return <ErrorPage message="A server error has occured. please try again later" />;
    }
}