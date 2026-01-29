'use client';
import { UserType } from "@repo/db/browser";
import { createContext, useContext, useState } from "react";
export type SessionUser = {
    id: string;
    name: string;
    userType: UserType;
    email: string;
    phone: string;
}
const SessionContext = createContext<{user: SessionUser | null, setUser: React.Dispatch<React.SetStateAction<SessionUser | null>>}>({user: null, setUser: () => {}});

export function useSession() {
    const context = useContext(SessionContext);
    if (!context) {
        throw new Error("useSession must be used within a SessionConsumer");
    }
    return context;
}

export function SessionConsumer({ user, children }: { user: SessionUser | null, children: React.ReactNode }) {
    const [session, setSession] = useState<SessionUser | null>(user);
    return (
        <SessionContext.Provider value={{user: session, setUser: setSession}}>
            {children}
        </SessionContext.Provider>
    )
}

