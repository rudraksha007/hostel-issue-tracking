import { AuthError } from "@repo/shared/errors";
import { getUser, handleAPIError } from "@repo/shared/server";
import { GetSeatsRequest, sendResponse } from "@repo/shared/types/api";
import type { Request, Response } from "express";
import { getSeats } from "../services/seats";

export async function GetSeatsController(req: Request, res: Response) {
    try {
        if (!req.sessionToken) throw new AuthError("No active session found");
        await getUser(req.sessionToken, { id: true });
        const data = GetSeatsRequest.parse(req.body);
        sendResponse(res, await getSeats(data));
    } catch (err) {
        handleAPIError(err, res);
    }
}