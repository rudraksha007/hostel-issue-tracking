'use client';

import { GetUsersRequestT, GetUsersResponseT } from "@repo/shared/types/api";
import { AnimatePresence } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { Input } from "@repo/ui/components/input";
import { User, Loader2, Plus } from "lucide-react";
import { UsersAPI } from "@/lib/api/users";
import { UserCard } from "./components/user-card";
import { AddUserScreen } from "./components/add-user";

export default function UsersPage() {
    const [loading, setLoading] = useState(true);
    const [users, setUsers] = useState<GetUsersResponseT["users"]>([]);
    const initRef = useRef(false);
    const [addUserOpen, setAddUserOpen] = useState(false);

    let timerRef = useRef<NodeJS.Timeout | null>(null);
    const [request, setRequest] = useState<GetUsersRequestT>({
        types: ['ADMIN', 'WARDEN', 'STAFF', 'STUDENT'],
        search: "",
        page: 1,
        pageSize: 20,
        gender: ['FEMALE', 'MALE', 'PREFER_NOT_TO_SAY', 'OTHER']
    });

    async function fetchUsers(data: GetUsersRequestT, clear: boolean = true) {
        setLoading(true);
        const d = await UsersAPI.getUsers(data);
        if (clear) setUsers(d);
        else setUsers(prev => [...prev, ...d]);
        setLoading(false);
    }
    useEffect(() => {
        if (timerRef.current) clearTimeout(timerRef.current);
        timerRef.current = setTimeout(() => {
            fetchUsers(request, true);
        }, 1000);
    }, [request.gender, request.search, request.types]);

    useEffect(() => {
        if (!initRef.current) initRef.current = true;
        else if (!addUserOpen) fetchUsers(request, true);
    }, [addUserOpen]);

    return (
        <div className="max-w-screen h-full overflow-x-hidden flex flex-row relative z-200">
            <div className="w-full overflow-y-auto h-full flex flex-col gap-4 p-6 overflow-x-hidden relative">
                <div className="flex flex-col gap-3 sticky top-0 bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60 z-10 pb-2">
                    <h1 className="text-2xl font-bold">Manage Users</h1>
                    <Input
                        placeholder="Search by name, email, or phone..."
                        value={request.search}
                        onChange={(e) => setRequest(prev => ({ ...prev, search: e.target.value, page: 1 }))}
                        className="max-w-md"
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <AnimatePresence mode="popLayout">
                        {users.map((user) => (
                            <UserCard key={user.id} user={user} />
                        ))}
                    </AnimatePresence>
                </div>
                {
                    loading && (
                        <div className="flex flex-col items-center justify-center h-32">
                            <Loader2 className="w-8 h-8 mb-4 animate-spin text-muted-foreground" />
                            <p className="mt-4 text-muted-foreground">Loading users...</p>
                        </div>
                    )
                }
                {users.length === 0 && !loading && (
                    <div className="flex flex-col items-center justify-center h-64 text-muted-foreground">
                        <User className="w-16 h-16 mb-4 opacity-20" />
                        <p className="text-lg">No users found</p>
                        <p className="text-sm">Try adjusting your search criteria</p>
                    </div>
                )}

            </div>
            {/* Floating Action Button */}
            <button
                onClick={() => setAddUserOpen(true)}
                className="fixed bottom-8! right-8! bg-primary text-primary-foreground rounded-full p-4 shadow-lg hover:shadow-xl transition-all hover:scale-110 z-100"
                aria-label="Add User"
                style={{ position: 'fixed', bottom: '2rem', right: '2rem' }}
            >
                <Plus className="w-6 h-6" />
            </button>
            <AddUserScreen isOpen={addUserOpen} setOpen={setAddUserOpen} />
        </div>
    )
}
