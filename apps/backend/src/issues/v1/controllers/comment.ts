import { AuthError, ImpossibleTaskError, InvalidInputError, NotFoundError } from "@repo/shared/errors";
import { getUser, handleAPIError } from "@repo/shared/server";
import { CommentRequest, sendResponse } from "@repo/shared/types/api";
import type { Request, Response } from "express";
import { getComment, getIssue } from "../utils";
import { comment } from "../services/comment";

export async function CommentController(req: Request, res: Response) {
    try {
        if (!req.sessionToken) throw new AuthError("No active session found");
        const user = await getUser(req.sessionToken, { id: true, userType: true });
        if (!user) throw new AuthError("Unauthorized");
        const data = CommentRequest.parse(req.body);
        let allowed = false;
        let issue: {
            id: string;
            isPublic: boolean;
            assignedToId: string | null;
            userId: string;
        };
        if (data.targetType === 'COMMENT') {
            const comment = await getComment(data.target, {
                id: true,
                issueId: true
            });
            if (!comment) throw new NotFoundError("Comment not found");
            issue = await getIssue(comment.issueId, {
                id: true,
                isPublic: true,
                assignedToId: true,
                userId: true
            });
        }
        else if (data.targetType === 'ISSUE') {
            issue = await getIssue(data.target, {
                id: true,
                isPublic: true,
                assignedToId: true,
                userId: true
            });
        }
        else throw new InvalidInputError("Invalid target type");
        if (!issue) throw new NotFoundError("Issue not found");
        if (user.userType === 'ADMIN') allowed = true;
        else if (issue.isPublic) allowed = true;
        else if (user.userType === 'WARDEN') {
            const i = await getIssue(data.target, {
                raisedBy: { select: { seat: { select: { room: { select: { floor: { select: { wardens: { select: { id: true } } } } } } } } } }
            });
            if (!i.raisedBy.seat) throw new ImpossibleTaskError("Issue raiser does not have an assigned seat", 400);
            const isWardenOfIssue = i.raisedBy.seat.room.floor.wardens.some(w => w.id === user.id);
            if (isWardenOfIssue) allowed = true;
        }
        else if (user.userType === 'STAFF' && user.id === issue.assignedToId) allowed = true;
        else if (user.id === issue.userId) allowed = true;
        if (!allowed) throw new AuthError("Unauthorized to comment on this issue", 403);
        const r = await comment(user.id, data.content, issue.id, data.targetType === 'COMMENT' ? data.target : undefined);
        sendResponse(res, r);
    } catch (err) {
        handleAPIError(err, res);
    }
}