import { handleAPIError } from "@repo/shared/server";
import { EditFloorRequest, sendResponse } from "@repo/shared/types/api";
import type { Request, Response } from "express";
import { editFloor } from "../services/edit";

export async function EditFloorController(req: Request, res: Response) {
    try {
        const data = EditFloorRequest.parse(req.body);
        sendResponse(res, await editFloor(data));
    } catch (err) {
        handleAPIError(err, res);
    }
}