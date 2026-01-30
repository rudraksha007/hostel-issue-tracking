'use client';
import { AuthAPI } from "@/lib/api/auth";
import { useRouter } from "next/navigation"

export function Unauthorised() {
    const router = useRouter();
    async function out(){
        await AuthAPI.logout();
        router.refresh();
    }
    return <>
        <div className="flex min-h-screen items-center justify-center">
            <div className="text-center">
                <h1 className="text-4xl font-bold text-gray-900 mb-4">403 - Forbidden</h1>
                <p className="text-lg text-gray-600">You are not allowed to view this page.</p>
                <div className="flex gap-4 mt-6 justify-center">
                    <button 
                        onClick={() => router.back()} 
                        className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 border-white border-2"
                    >
                        Go Back
                    </button>
                    <button 
                        onClick={() => out()} 
                        className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 border-white border-2"
                    >
                        Logout
                    </button>
                </div>
            </div>
        </div>
    </>
}