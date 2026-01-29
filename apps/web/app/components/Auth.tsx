'use client';

import { AuthAPI } from "@/lib/api/auth";
import { LoginRequestT, SignupRequestT } from "@repo/shared/types/api";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useSession } from "./session-consumer";

export default function Auth() {
    const [login, setLogin] = useState(true);
    const [loginForm, setLoginForm] = useState<LoginRequestT>({ id: '', password: '', remember: false });
    const [regForm, setRegForm] = useState<SignupRequestT & { confirmPassword?: string }>({
        id: '', password: '', confirmPassword: ''
    });
    const router = useRouter();
    async function handleLogin() {
        const data = await AuthAPI.login(loginForm);
        if (data) {
            router.refresh();
        }
    }
    async function handleSignup() {
        if (regForm.password !== regForm.confirmPassword) {
            alert("Passwords do not match");
            return;
        }
        if (await AuthAPI.signup(regForm)) setLogin(true);
    }
    return (
        <div className='h-screen w-screen flex flex-col justify-center items-center gap-4'>
            <div className="w-[95%] border-white h-fit mx-auto">
                <div className="w-full grid grid-cols-2 gap-2">
                    <button className="bg-neutral-400 text-black rounded-lg px-4" onClick={()=>setLogin(true)}>Login</button>
                    <button className="bg-neutral-400 text-black rounded-lg px-4" onClick={()=>setLogin(false)}>Signup</button>
                    {
                        login ? (
                            <>
                                <label>ID: </label>
                                <input type="text" className="border-2 rounded-md p-1 w-full" value={loginForm.id} onChange={e => setLoginForm({ ...loginForm, id: e.target.value })} />
                                <label>Password</label>
                                <input type="password" className="border-2 rounded-md p-1 w-full" value={loginForm.password} onChange={e => setLoginForm({ ...loginForm, password: e.target.value })} />
                            </>
                        ) : (
                            <>
                                <label>ID: </label>
                                <input type="text" className="border-2 rounded-md p-1 w-full" value={regForm.id} onChange={e => setRegForm({ ...regForm, id: e.target.value })} />
                                <label>Password</label>
                                <input type="password" className="border-2 rounded-md p-1 w-full" value={regForm.password} onChange={e => setRegForm({ ...regForm, password: e.target.value })} />
                                <label>Confirm Password</label>
                                <input type="password" className="border-2 rounded-md p-1 w-full" value={regForm.confirmPassword} onChange={e => setRegForm({ ...regForm, confirmPassword: e.target.value })} />
                            </>
                        )
                    }
                </div>
            </div>
            <button className="py-1 bg-neutral-400 text-black rounded-lg px-4" onClick={handleLogin}>{login ? "Login" : "Signup"}</button>
        </div>
    )
}