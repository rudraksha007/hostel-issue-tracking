import { getUser, handleAPIError } from "@repo/shared/server";
import { CreateUserRequest, sendResponse } from "@repo/shared/types/api";
import type { Request, Response } from "express";
import { create, createFirstAdmin } from "../services/create";
import { AuthError, ServerError } from "@repo/shared/errors";
import { normalizePhone } from "@repo/shared";

export async function CreateUserController(req: Request, res: Response) {
    try {
        if (!req.sessionToken) throw new AuthError("No active session found");
        const user = await getUser(req.sessionToken, { id: true, userType: true });
        if(!user) throw new AuthError("Unauthorised");
        const data = CreateUserRequest.parse(req.body);
        let allowed = false;
        if(user.userType === 'ADMIN') allowed = true;
        else if(user.userType === 'WARDEN' && data.userType === 'STUDENT') allowed = true;
        if(!allowed) throw new AuthError("Unauthorized to create this user type");
        data.phone = normalizePhone(data.phone);
        const r = await create(data);
        if (!r.success) throw new ServerError(r.statusCode || 500, r.msg || "User creation failed");
        sendResponse(res, r);
    } catch (error) {
        handleAPIError(error, res);
    }
}

export async function FirstAdmin(_: Request, res: Response) {
    try {        
        const r = await createFirstAdmin();
        sendResponse(res, r);
    } catch (error) {
        handleAPIError(error, res);
    }
}