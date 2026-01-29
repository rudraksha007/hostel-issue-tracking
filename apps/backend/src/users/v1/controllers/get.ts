import { AuthError } from "@repo/shared/errors";
import { getUser, handleAPIError } from "@repo/shared/server";
import { GetUsersRequest, sendResponse } from "@repo/shared/types/api";
import type { Request, Response } from "express";
import { getUsers } from "../services/get";

export async function GetUsersController(req: Request, res: Response) {
    try {
        const token = req.sessionToken;
        if (!token) throw new AuthError("No session token found");
        const user = await getUser(token, { id: true, userType: true });
        if (user.userType !== 'ADMIN' && user.userType !== 'WARDEN') throw new AuthError("Unauthorized to view users");
        const data = GetUsersRequest.parse(req.body);
        if (user.userType === 'WARDEN') sendResponse(res, await getUsers(data, user.id));
        else sendResponse(res, await getUsers(data));
    } catch (err) {
        handleAPIError(err, res);
    }
}