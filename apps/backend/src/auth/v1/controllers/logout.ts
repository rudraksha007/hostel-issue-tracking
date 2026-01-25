import type { Request, Response } from "express";
import { logout } from "../services/logout";
import { handleAPIError } from "@repo/shared/server";

export async function LogoutController(req: Request, res: Response) {
    try {
        const sessionToken = req.cookies['next-auth.session-token'];
        if (!sessionToken) {
            return res.status(400).json({ success: false, msg: "No active sessions found" });
        }
        const r = await logout(sessionToken);
        if (!r.success) return res.status(r.statusCode || 500).json({ success: false, msg: r.msg });
        res.clearCookie('session-token', { path: '/' });
        return res.status(200).json({ success: true, msg: "Logged out successfully" });
    } catch (err) {
        handleAPIError(err, res);
    }
}