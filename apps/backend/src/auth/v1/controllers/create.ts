import { handleAPIError } from "@repo/shared/server";
import { CreateUserRequest, sendResponse } from "@repo/shared/types/api";
import type { Request, Response } from "express";
import { create } from "../services/create";
import { AuthError, ServerError } from "@repo/shared/errors";
import { getUser } from "@/lib/middlewares/session";

export async function CreateUserController(req: Request, res: Response) {
    try {
        const user = await getUser(req, { id: true, userType: true });
        if(!user) throw new AuthError("Unauthorised");
        const data = CreateUserRequest.parse(req.body);
        let allowed = false;
        if(user.userType === 'ADMIN') allowed = true;
        else if(user.userType === 'WARDEN' && data.userType === 'STUDENT') allowed = true;
        if(!allowed) throw new AuthError("Unauthorized to create this user type");
        const r = await create(data);
        if (!r.success) throw new ServerError(r.statusCode || 500, r.msg || "User creation failed");
        sendResponse(res, r);
    } catch (error) {
        handleAPIError(error, res);
    }
}