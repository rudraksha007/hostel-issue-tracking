'use client';

import React, { useState } from 'react';

type UserUI = {
    id: string;
    name: string;
    email: string;
    phone: string;
    gender: string;
    userType: string;
    createdAt: string;
};

// Client-only UI mock for Profile (no server calls)
export function Profile() {
    const [user, setUser] = useState<UserUI>({
        id: 'u1',
        name: 'John Doe',
        email: 'john.doe@example.com',
        phone: '+91 98765 43210',
        gender: 'MALE',
        userType: 'STUDENT',
        createdAt: new Date().toISOString(),
    });

    const [editing, setEditing] = useState(false);
    const [draft, setDraft] = useState(user);

    // prevent body scroll when modal is open
    React.useEffect(() => {
        if (editing) {
            const prev = document.body.style.overflow;
            document.body.style.overflow = 'hidden';
            return () => { document.body.style.overflow = prev; };
        }
    }, [editing]);

    function save() {
        setUser(draft);
        setEditing(false);
    }

    return (
        <>
            <main className="max-w-4xl mx-auto px-5 py-8">
                <div className="bg-linear-to-b from-zinc-900/60 to-zinc-900/40 shadow-2xl ring-1 ring-white/5 rounded-2xl p-6">
                    <div className="flex items-start gap-6">
                        <div className="relative">
                            <div className="h-24 w-24 rounded-full bg-linear-to-br from-indigo-500 to-pink-500 shadow-lg flex items-center justify-center text-3xl font-semibold text-white">
                                {user.name.split(' ')[0]?.[0] ?? 'U'}
                            </div>
                            <button aria-label="Change avatar" className="absolute -right-2 -bottom-2 bg-white text-zinc-900 rounded-full p-1 shadow-md border border-white/10">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M4 21h4l10-10-4-4L4 17v4z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                    <path d="M14 7l3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </button>
                        </div>

                        <div className="flex-1">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h1 className="text-3xl font-bold tracking-tight">{user.name}</h1>
                                    <p className="text-sm text-zinc-400 mt-1">{user.userType} • Joined {new Date(user.createdAt).toLocaleDateString()}</p>
                                </div>

                                <div className="ml-4">
                                    <button
                                        onClick={() => { setDraft(user); setEditing(true); }}
                                        aria-label="Edit profile"
                                        className="inline-flex items-center gap-2 bg-zinc-800/60 hover:bg-zinc-800 text-white px-3 py-2 rounded-full shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400"
                                    >
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-white">
                                            <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25z" fill="currentColor" />
                                            <path d="M20.71 7.04a1.003 1.003 0 0 0 0-1.42l-2.34-2.34a1.003 1.003 0 0 0-1.42 0l-1.83 1.83 3.75 3.75 1.84-1.82z" fill="currentColor" />
                                        </svg>
                                        <span className="hidden sm:inline font-medium">Edit</span>
                                    </button>
                                </div>
                            </div>

                        </div>
                    </div>

                    <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-zinc-800/40 p-4 rounded-lg">
                            <h3 className="text-sm text-zinc-400">Contact</h3>
                            <div className="mt-3 text-zinc-200 space-y-2">
                                <div><span className="text-zinc-400">Email:</span> <span className="font-medium">{user.email}</span></div>
                                <div><span className="text-zinc-400">Phone:</span> <span className="font-medium">{user.phone}</span></div>
                            </div>
                        </div>

                        <div className="bg-zinc-800/40 p-4 rounded-lg">
                            <h3 className="text-sm text-zinc-400">Details</h3>
                            <div className="mt-3 text-zinc-200 space-y-2">
                                <div><span className="text-zinc-400">Gender:</span> <span className="font-medium">{user.gender}</span></div>
                                <div><span className="text-zinc-400">Role:</span> <span className="font-medium">{user.userType}</span></div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            {editing && (
                <div className="fixed inset-0 z-150 flex items-center justify-center px-4">
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setEditing(false)} />
                    <div className="relative w-full max-w-2xl mx-auto max-h-[85vh] overflow-auto rounded-2xl bg-zinc-900 border border-zinc-800 p-6 z-10 shadow-2xl">
                        <div className="flex items-start justify-between gap-4">
                            <div>
                                <h2 className="text-2xl font-bold">Edit Profile</h2>
                                <p className="text-sm text-zinc-400">Update your information below and save.</p>
                            </div>
                            <button aria-label="Close" onClick={() => setEditing(false)} className="text-zinc-400 hover:text-zinc-200">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M6 18L18 6M6 6l12 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                            </button>
                        </div>

                        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="text-sm text-zinc-400">Name</label>
                                <input value={draft.name} onChange={(e) => setDraft({ ...draft, name: e.target.value })} className="w-full mt-2 px-3 py-2 rounded bg-zinc-800 text-zinc-100" />

                                <label className="text-sm text-zinc-400 mt-4 block">Email</label>
                                <input value={draft.email} onChange={(e) => setDraft({ ...draft, email: e.target.value })} className="w-full mt-2 px-3 py-2 rounded bg-zinc-800 text-zinc-100" />
                            </div>

                            <div>
                                <label className="text-sm text-zinc-400">Phone</label>
                                <input value={draft.phone} onChange={(e) => setDraft({ ...draft, phone: e.target.value })} className="w-full mt-2 px-3 py-2 rounded bg-zinc-800 text-zinc-100" />
                            </div>
                        </div>

                        <div className="mt-6 flex justify-end gap-3">
                            <button onClick={() => setEditing(false)} className="px-4 py-2 rounded-md border border-zinc-700 text-zinc-300">Cancel</button>
                            <button onClick={save} className="px-4 py-2 rounded-md bg-linear-to-r from-indigo-600 to-teal-500 text-white shadow">Save changes</button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}