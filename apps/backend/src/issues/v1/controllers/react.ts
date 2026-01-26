import { getUser } from "@/lib/middlewares/session";
import { AuthError, InvalidInputError, NotFoundError } from "@repo/shared/errors";
import { handleAPIError } from "@repo/shared/server";
import { ReactRequest, sendResponse } from "@repo/shared/types/api";
import type { Request, Response } from "express";
import { getAnnouncement, getComment, getIssue } from "../utils";
import { react } from "../services/react";

export async function ReactController(req: Request, res: Response) {
    try {
        const user = await getUser(req, { id: true, userType: true });
        if (!user) throw new AuthError("Unauthorized", 401);
        const data = ReactRequest.parse(req.body);
        if (data.targetType === 'ISSUE') {
            const issue = await getIssue(data.target, {
                id: true,
            });
            if (!issue) throw new NotFoundError("Issue not found");
            const r = await react(user.id, data);
            sendResponse(res, r);
        } else if (data.targetType === 'COMMENT') {
            const comment = await getComment(data.target, {
                id: true,
            });
            if (!comment) throw new NotFoundError("Comment not found");
        } else if (data.targetType === 'ANNOUNCEMENT') {
            const ann = await getAnnouncement(data.target, {
                id: true,
            });
            if (!ann) throw new NotFoundError("Announcement not found");
        }
        else throw new InvalidInputError("Invalid target type");
        const r = await react(user.id, data);
        sendResponse(res, r);
    } catch (err) {
        handleAPIError(err, res);
    }
}