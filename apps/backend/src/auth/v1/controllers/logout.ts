import type { Request, Response } from "express";
import { logout } from "../services/logout";
import { handleAPIError } from "@repo/shared/server";
import { sendResponse } from "@repo/shared/types/api";

export async function LogoutController(req: Request, res: Response) {
    try {
        const sessionToken = req.sessionToken;
        if (!sessionToken) {
            return res.status(400).json({ success: false, msg: "No active sessions found" });
        }
        const r = await logout(sessionToken);
        res.clearCookie('session-token', { path: '/' });
        sendResponse(res, r);
    } catch (err) {
        handleAPIError(err, res);
    }
}