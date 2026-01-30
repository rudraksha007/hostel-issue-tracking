import { handleAPIError } from "@repo/shared/server";
import { CreateBlockRequest, CreateFloorRequest, CreateHostelRequest, sendResponse } from "@repo/shared/types/api";
import type { Request, Response } from "express";
import { createBlock, createFloor, createHostel } from "../services/create";

export async function CreateBuildingController(req: Request, res: Response) {
    try {
        const data = CreateHostelRequest.parse(req.body);
        sendResponse(res, await createHostel(data));
    } catch (err) {
        handleAPIError(err, res);
    }
}

export async function CreateBlockController(req: Request, res: Response) {
    try {
        const data = CreateBlockRequest.parse(req.body);
        sendResponse(res, await createBlock(data));
    }catch (err) {
        handleAPIError(err, res);
    }
}

export async function CreateFloorController(req: Request, res: Response) {
    try {
        const data = CreateFloorRequest.parse(req.body);
        sendResponse(res, await createFloor(data));
    } catch (err) {
        handleAPIError(err, res);
    }
}