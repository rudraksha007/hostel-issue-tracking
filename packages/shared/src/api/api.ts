import type { Response } from "express";
import type { APIResponseT } from "./auth";
import z from "zod";

export function makeResponse<T>(success: boolean = true, status: number = 200, msg: string = "", data?: T): APIResponseT<T> {
    const response: APIResponseT = {
        success,
        statusCode: status,
        msg,
        data,
    };
    return response;
}

export function sendResponse(res: Response, result: APIResponseT) {
    res.status(result.statusCode).json(result);
}

export const FileRequestParams = z.object({
    targetId: z.cuid(),
    path: z.string(),
});

export type FileRequestParamsT = z.infer<typeof FileRequestParams>;

export * from "./auth";
export * from "./issues";
export * from "./announcements";
export * from './lnf';