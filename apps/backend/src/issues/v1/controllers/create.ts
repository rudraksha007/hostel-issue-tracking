import { handleAPIError } from "@repo/shared/server";
import { CreateIssueRequest, sendResponse } from "@repo/shared/types/api";
import type { Request, Response } from "express";
import { getUser } from "@/lib/middlewares/session";
import { createIssue } from "../services/create";
import { ImpossibleTaskError, ServerError } from "@repo/shared/errors";

export async function CreateIssueController(req: Request, res: Response) {
    try {
        const user = await getUser(req, { id: true, seat: {
            select: {
                roomId: true
            }
        } });
        if (!user.seat) throw new ImpossibleTaskError("User does not have an assigned seat", 400);
        const data = CreateIssueRequest.parse(req.body);
        const r = await createIssue(data, user.seat.roomId);
        if (!r.success) throw new ServerError(r.statusCode || 500, r.msg || "Issue creation failed");
        sendResponse(res, r);
    }catch (err) {
        handleAPIError(err, res);
    }
}