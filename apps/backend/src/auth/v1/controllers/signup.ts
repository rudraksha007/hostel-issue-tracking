import { ServerError } from "@repo/shared/errors";
import { handleAPIError } from "@repo/shared/server";
import { sendResponse, SignupRequest } from "@repo/shared/types/api";
import type { Request, Response } from "express";
import { signup } from "../services/signup";

export async function SignupController(req: Request, res: Response){
    try {
        const data = SignupRequest.parse(req.body);
        const r = await signup(data);
        if (r.success) sendResponse(res, r);
        else throw new ServerError(r.statusCode || 500, r.msg || "Registration failed");
    }catch (error: any) {
        handleAPIError(error, res);
    }
}