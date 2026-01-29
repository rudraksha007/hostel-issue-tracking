import { handleAPIError } from "@repo/shared/server";
import type { Request, Response } from "express";

export async function GetAnnouncementController(req: Request, res: Response) {
    try {
        
    } catch (err) {
        handleAPIError(err, res);
    }
}