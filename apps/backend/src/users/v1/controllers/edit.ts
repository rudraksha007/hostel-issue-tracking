import { AuthError } from "@repo/shared/errors";
import { getUser, handleAPIError } from "@repo/shared/server";
import { EditUserRequest, sendResponse } from "@repo/shared/types/api";
import type { Request, Response } from "express";
import { getUserById } from "../services/get";
import { editUser } from "../services/edit";

export async function EditUserController(req: Request, res: Response) {
    try {
        const token = req.sessionToken;
        if (!token) throw new AuthError('No active session found');
        const data = EditUserRequest.parse(req.body);
        const user = await getUser(token, { id: true, userType: true });
        let allowed = false;
        if (data.id !== user.id) data.password = undefined;
        if (user.userType === 'ADMIN') {
            allowed = true;
        }
        else {
            data.adminOnly = undefined;
            if (user.userType === 'WARDEN') {
                if (data.id === user.id) allowed = true;
                else {
                    const target = (await getUserById(data.id)).data;
                    if (target.wardens && target.wardens.includes(user.id)) allowed = true;
                }
            }
            else data.seatId = undefined;
        }
        if (!allowed) throw new AuthError('You are not authorized to edit this user');
        const r = await editUser(data);
        sendResponse(res, r);
    } catch (err) {
        handleAPIError(err, res);
    }
}