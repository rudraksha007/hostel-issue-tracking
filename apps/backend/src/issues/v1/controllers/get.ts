import { getUser } from "@/lib/middlewares/session";
import { AuthError, ImpossibleTaskError } from "@repo/shared/errors";
import { handleAPIError } from "@repo/shared/server";
import { GetIssueRequest, sendResponse, type APIResponseT, type GetIssuesResponseT } from "@repo/shared/types/api";
import type { Request, Response } from "express";
import { getIssue } from "../utils";
import { getAllIssues } from "../services/get";

export async function GetIssueController(req: Request, res: Response) {
    try {
        const user = await getUser(req, { id: true, userType: true });
        if (!user) throw new AuthError("Unauthorized");
        const data = GetIssueRequest.parse(req.body);
        if (data.isPublic || user.userType === 'ADMIN') {}
        else if (data.issueId) {
            let allowed = false;
            const i = await getIssue(data.issueId, {
                raisedBy: { select: { id: true, seat: { select: { room: { select: { floor: { select: { wardens: { select: { id: true } } } } } } } } } }
            });
            if (user.id === i.raisedBy.id) allowed = true;
            else if (!i.raisedBy.seat) throw new ImpossibleTaskError("Issue raiser does not have an assigned seat", 400);
            else if (i.raisedBy.seat.room.floor.wardens.some(w=> w.id === user.id)) allowed = true;
            if (!allowed) throw new AuthError("Not Authorised to view this issue");
        } else {
            if (user.userType === 'STAFF') data.assignedTo = user.id;
            else if (user.userType === 'WARDEN') data.warden = user.id;
            else if (user.userType === 'STUDENT') data.raisedBy = user.id;
        }
        const r = await getAllIssues(data, data.sort);
        sendResponse(res, r);
    } catch (err) {
        handleAPIError(err, res);
    }
}