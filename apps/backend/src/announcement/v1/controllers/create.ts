import { AuthError } from "@repo/shared/errors";
import { getUser, handleAPIError } from "@repo/shared/server";
import { AnnouncementRequest, sendResponse } from "@repo/shared/types/api";
import type { Request, Response } from "express";
import { createAnnouncement } from "../services/create";

export async function AnnounceController(req: Request, res: Response) {
    try {
        if (!req.sessionToken) throw new AuthError("No active session found");
        const user = await getUser(req.sessionToken, { id: true, userType: true, assignedFloors: { select: { id: true } } });
        if (user.userType !== 'ADMIN' && user.userType !== 'WARDEN') throw new AuthError("Unauthorized to create announcement");
        const data = AnnouncementRequest.parse(req.body);
        if (user.userType === 'WARDEN') {
            data.targeting.userTypes = data.targeting.userTypes.filter(ut => ut === 'STUDENT');
            data.targeting.wardens = [user.id];
        }
        const r = await createAnnouncement(data, user.id, req.files || []);
        sendResponse(res, r);
    } catch (err) {
        handleAPIError(err, res);
    }
}