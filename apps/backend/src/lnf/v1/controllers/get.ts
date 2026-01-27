import { getUser } from "@/lib/middlewares/session";
import { AuthError } from "@repo/shared/errors";
import { handleAPIError } from "@repo/shared/server";
import { GetClaimsRequest, GetItemsRequest, sendResponse } from "@repo/shared/types/api";
import type { Request, Response } from "express";
import { getClaims, getItems } from "../services/get";

export async function GetLostNFoundItemsController(req: Request, res: Response) {
    try {
        await getUser(req, { id: true });
        const data = GetItemsRequest.parse(req.query);
        sendResponse(res, await getItems(data));
    } catch (err) {
        handleAPIError(err, res);
    }
}

export async function GetLostNFoundClaimsController(req: Request, res: Response) {
    try {
        await getUser(req, { id: true });
        const data = GetClaimsRequest.parse(req.query);
        sendResponse(res, await getClaims(data));
    } catch (err) {
        handleAPIError(err, res);
    }
}