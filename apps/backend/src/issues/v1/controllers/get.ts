import { AuthError, ImpossibleTaskError, InvalidInputError } from "@repo/shared/errors";
import { getUser, handleAPIError } from "@repo/shared/server";
import { GetIssuesRequest, sendResponse } from "@repo/shared/types/api";
import type { Request, Response } from "express";
import { getIssue } from "../utils";
import { getAllIssues } from "../services/get";

export async function GetIssuesController(req: Request, res: Response) {
    try {
        if (!req.sessionToken) throw new AuthError("No active session found");
        const user = await getUser(req.sessionToken, { id: true, userType: true });
        if (!user) throw new AuthError("Unauthorized");
        const data = GetIssuesRequest.parse(req.body);
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

export async function GetIssueController(req: Request, res: Response) {
    try {
        if (!req.sessionToken) throw new AuthError("No active session found");
        const user = await getUser(req.sessionToken, { id: true, userType: true });
        const issueId = req.params.issueId;
        if (!issueId) throw new InvalidInputError("Issue ID is required");
        const issue = await getIssue(issueId.toString(), {
            id: true,
            isPublic: true,
            raisedBy: { select: { id: true, seat: { select: { room: { select: { floor: { select: { wardens: { select: { id: true } } } } } } } } } }
        });
        if (!issue) throw new InvalidInputError("Issue not found");
        let allowed = false;
        if (issue.isPublic) allowed = true;
        else if (user.userType === 'ADMIN') allowed = true;
        else if (user.id === issue.raisedBy.id) allowed = true;
        else if (!issue.raisedBy.seat) throw new ImpossibleTaskError("Issue raiser does not have an assigned seat", 400);
        else if (issue.raisedBy.seat.room.floor.wardens.some(w=> w.id === user?.id)) allowed = true;
        if (!allowed) throw new AuthError("Not Authorised to view this issue");
        
    } catch (err) {
        handleAPIError(err, res);
    }
}