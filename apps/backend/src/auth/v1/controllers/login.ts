import { handleAPIError } from "@repo/shared/server";
import { LoginRequest, sendResponse } from "@repo/shared/types/api";
import type { Request, Response } from "express";
import { login } from "../services/login";
import { AuthError } from "@repo/shared/errors";

export async function LoginController(req: Request, res: Response) {
    try {
        const data = LoginRequest.parse(req.body);
        const r = await login(data, req.ip || 'N/A', req.headers['user-agent'] || "N/A");
        if(!r.success || !r.data) throw new AuthError(r.msg || "Login failed");
        else {
            res.cookie("session-token", r.data.sessionToken, {
                httpOnly: true,
                secure: true,
                path: "/",
                sameSite: "lax",
                maxAge: r.data.age, // Express expects ms, Next.js expects seconds
            });
        }
        sendResponse(res, r);
    }catch (err) {
        handleAPIError(err, res);
    }
}