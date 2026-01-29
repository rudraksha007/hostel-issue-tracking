import { getUser, handleAPIError } from "@repo/shared/server";
import { GetHostelsRequest, sendResponse } from "@repo/shared/types/api";
import type { Request, Response } from "express";
import { getHostels } from "../services/hostels";
import { AuthError } from "@repo/shared/errors";

export async function GetHostelsController(req: Request, res: Response) {
    try {
        if (!req.sessionToken) throw new AuthError("No active session found");
        await getUser(req.sessionToken, {id: true});
        const data = GetHostelsRequest.parse(req.body);
        sendResponse(res, await getHostels(data));
    } catch (err) {
        handleAPIError(err, res);
    }
}