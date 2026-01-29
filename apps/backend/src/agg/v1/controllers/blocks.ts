import { AuthError } from "@repo/shared/errors";
import { getUser, handleAPIError } from "@repo/shared/server";
import { GetBlocksRequest, sendResponse } from "@repo/shared/types/api";
import type { Request, Response } from "express";
import { getBlocks } from "../services/blocks";

export async function GetBlocksController(req: Request, res: Response) {
    try {
        if (!req.sessionToken) throw new AuthError("No active session found");
        await getUser(req.sessionToken, { id: true });
        const data = GetBlocksRequest.parse(req.body);
        sendResponse(res, await getBlocks(data));
    } catch (err) {
        handleAPIError(err, res);
    }
}