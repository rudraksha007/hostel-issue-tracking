import { AuthError } from "@repo/shared/errors";
import { getUser, handleAPIError } from "@repo/shared/server";
import { GetFloorsRequest, sendResponse } from "@repo/shared/types/api";
import type { Request, Response } from "express";
import { getFloors } from "../services/floors";

export async function GetFloorsController(req: Request, res: Response) {
    try {
        if (!req.sessionToken) throw new AuthError("No active session found");
        await getUser(req.sessionToken, { id: true });
        const data = GetFloorsRequest.parse(req.body);
        sendResponse(res, await getFloors(data));
    } catch (err) {
        handleAPIError(err, res);
    }
}