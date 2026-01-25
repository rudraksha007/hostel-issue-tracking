import { handleAPIError } from "@repo/shared/server";
import { CreateUserRequest, sendResponse } from "@repo/shared/types/api";
import type { Request, Response } from "express";
import { create } from "../services/create";
import { ServerError } from "@repo/shared/errors";

export async function CreateUserController(req: Request, res: Response) {
    try {
        const data = CreateUserRequest.parse(req.body);
        const r = await create(data);
        if(!r.success) throw new ServerError(r.statusCode || 500, r.msg || "User creation failed");
        sendResponse(res, r);
    } catch (error) {
        handleAPIError(error, res);
    }
}