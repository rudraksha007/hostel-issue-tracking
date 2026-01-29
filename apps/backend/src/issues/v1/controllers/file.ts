import { uploadsDir } from "@/lib/init";
import { AuthError } from "@repo/shared/errors";
import { getUser, handleAPIError } from "@repo/shared/server";
import { FileRequestParams } from "@repo/shared/types/api";
import type { Request, Response } from "express";

export async function IssueFileController(req: Request, res: Response) {
    try {
        if (!req.sessionToken) throw new AuthError("No active session found");
        const user = await getUser(req.sessionToken, { id: true, userType: true, updates: { select: { id: true } } });
        let allowed = false;
        const data = FileRequestParams.parse(req.query);
        if (user.userType === 'ADMIN') allowed = true;
        else if (user.updates.some(update => update.id === data.targetId)) allowed = true;
        if (!allowed) throw new AuthError("Unauthorized to access issue file", 403);
        res.sendFile(data.path, { root: uploadsDir });
    } catch (err) {
        handleAPIError(err, res);
    }
}