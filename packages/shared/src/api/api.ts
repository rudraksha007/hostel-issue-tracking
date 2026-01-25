import type { Response } from "express";
import type { APIResponseT } from "./auth";

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
    res.status(result.statusCode || 200).json(result);
}

export * from "./auth";
export * from "./issues";                                                                                                                                                                                                                               