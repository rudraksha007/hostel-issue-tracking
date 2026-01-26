import { handleAPIError } from "@repo/shared/server";
import { EditIssueRequest, sendResponse, type APIResponseT } from "@repo/shared/types/api";
import type { Request, Response } from "express";
import { editIssue } from "../services/edit";
import { getUser } from "@/lib/middlewares/session";
import { AuthError, ImpossibleTaskError, ServerError } from "@repo/shared/errors";
import { getIssue } from "../utils";
import type { Status } from "@repo/db";

const statusMap: Record<Status, number> = {
    'REPORTED': 0,
    'ASSIGNED': 1,
    'IN_PROGRESS': 2,
    'RESOLVED': 3,
    'CLOSED': 4
}

export async function EditIssueController(req: Request, res: Response) {
    try {
        const user = await getUser(req, { id: true, userType: true });
        if (!user) throw new AuthError("Unauthorized", 401);
        const data = EditIssueRequest.parse(req.body);
        const issue = await getIssue(data.issueId, {
            userId: true,
            assignedToId: true,
            status: true
        });
        if (statusMap[data.status] < statusMap[issue.status]) throw new ImpossibleTaskError("Cannot revert issue to a previous status", 400);
        let r: APIResponseT;
        if (user.userType === 'ADMIN') {
            // Authorized to edit all fields
            r = await editIssue(data);
        } else if (user.userType === 'WARDEN') {
            // Authorized to edit only groupTag, assignedTo, status if warden of the raiser's floor
            if(data.status === 'CLOSED' && data.status !== issue.status) {
                throw new AuthError("Unauthorized to set this status");
            }
            const i = await getIssue(data.issueId, {
                raisedBy: { select: { seat: { select: { room: { select: { floor: { select: { wardens: { select: { id: true } } } } } } } } } }
            });
            if (!i.raisedBy.seat) throw new ImpossibleTaskError("Issue raiser does not have an assigned seat", 400);
            const isWardenOfIssue = i.raisedBy.seat.room.floor.wardens.some(w => w.id === user.id);
            if (!isWardenOfIssue) throw new AuthError("Unauthorized to edit this issue", 403);
            r = await editIssue({
                issueId: data.issueId,
                groupTag: data.groupTag,
                status: data.status,
                assignedTo: data.assignedTo
            });
        } else if (user.userType === 'STAFF' && user.id === issue.assignedToId) {
            // Authorized to request changes to status if assigned to the issue
            if (data.status !== 'RESOLVED' && data.status !== issue.status) {
                throw new AuthError("Unauthorized to set this status", 403);
            }
            r = await editIssue({
                issueId: data.issueId,
                status: data.status
            });
        } else if (user.id === issue.userId) {
            // Authorized to edit only description, isPublic, remarks, images
            if (data.status !== 'CLOSED' && data.status !== issue.status) {
                throw new AuthError("Unauthorized to set this status", 403);
            }
            if (data.status === 'CLOSED') {
                r = await editIssue({
                    status: 'CLOSED'
                });
            }
            else {
                r = await editIssue({
                    issueId: data.issueId,
                    description: data.description,
                    isPublic: data.isPublic,
                    remarks: data.remarks,
                    images: data.images
                });
            }
        } else throw new AuthError("Unauthorized to edit this issue", 403);
        if (!r.success) throw new ServerError(r.statusCode || 500, r.msg || "Issue editing failed");
        sendResponse(res, r);
    } catch (err) {
        handleAPIError(err, res);
    }
}