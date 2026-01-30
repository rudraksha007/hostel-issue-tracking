import { AuthError } from "@repo/shared/errors";
import { getUser, handleAPIError } from "@repo/shared/server";
import { GetAnnouncementsRequest, sendResponse } from "@repo/shared/types/api";
import type { Request, Response } from "express";
import { getAnnouncements } from "../services/get";

export async function GetAnnouncementController(req: Request, res: Response) {
    try {
        if (!req.sessionToken) throw new AuthError("No active session found");
        const user = await getUser(req.sessionToken, { id: true, userType: true, updates: { select: { id: true } } });
        const data = GetAnnouncementsRequest.parse(req.body);
        const r = await getAnnouncements(data, user.userType === 'ADMIN' ? undefined : user.id);
        sendResponse(res, r);
    } catch (err) {
        handleAPIError(err, res);
    }
}