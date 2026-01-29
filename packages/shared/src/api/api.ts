import type { Response } from "express";
import z from "zod";

export const APIResponse = <T extends z.ZodTypeAny>(dataSchema: T) => z.object({
    success: z.boolean().default(true),
    statusCode: z.number().default(200),
    msg: z.string().optional(),
    data: dataSchema.optional(),
})

export type APIResponseT<T = any> = {
    success: boolean;
    statusCode: number;
    msg?: string;
    data: T;
};
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
export * from "./users";
export * from './agg';