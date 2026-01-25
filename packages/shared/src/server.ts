import type { Response } from "express";
import { ServerError } from "./errors";
import { makeResponse, sendResponse } from "./api/api";
import { ZodError } from "zod";

export function handleAPIError(error: any, res: Response) {
    if (error instanceof ServerError) {
        console.warn(error);
        sendResponse(res, makeResponse(false, error.statusCode, error.message));
        return;
    } else if (error instanceof ZodError) {
        console.warn(error);
        sendResponse(res, makeResponse(false, 400, "Invalid request data", error.message));
        return;
    }
    console.error("Unexpected error:", error);
    sendResponse(res, makeResponse(false, 500, "Internal server error"));
}