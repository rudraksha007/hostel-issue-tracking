import { AuthError } from "@repo/shared/errors";
import { getUser, handleAPIError } from "@repo/shared/server";
import { GetRoomsRequest, sendResponse } from "@repo/shared/types/api";
import type { Request, Response } from "express";
import { getRooms } from "../services/rooms";

export async function GetRoomsController(req: Request, res: Response) {
    try {
        if (!req.sessionToken) throw new AuthError("No active session found");
        await getUser(req.sessionToken, { id: true });
        const data = GetRoomsRequest.parse(req.body);
        sendResponse(res, await getRooms(data));
    } catch (err) {
        handleAPIError(err, res);
    }
}