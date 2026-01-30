import { getUser, handleAPIError } from "@repo/shared/server";
import { CreateIssueRequest, sendResponse } from "@repo/shared/types/api";
import type { Request, Response } from "express";
import { createIssue } from "../services/create";
import { AuthError, ImpossibleTaskError, ServerError } from "@repo/shared/errors";

export async function CreateIssueController(req: Request, res: Response) {
    try {
        if (!req.sessionToken) throw new AuthError("No active session found");
        const user = await getUser(req.sessionToken, {
            id: true, seat: {
                select: {
                    roomId: true
                }
            }
        });
        if (!user.seat) throw new ImpossibleTaskError("User does not have an assigned seat", 400);
        const data = CreateIssueRequest.parse(req.body);
        if (!data.raisedBy) data.raisedBy = user.id;
        const r = await createIssue(data, req.files || [], user.seat.roomId);
        if (!r.success) throw new ServerError(r.statusCode || 500, r.msg || "Issue creation failed");
        sendResponse(res, r);
    } catch (err) {
        handleAPIError(err, res);
    }
}