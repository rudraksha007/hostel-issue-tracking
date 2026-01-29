import type { Response } from "express";
import { ServerError } from "./errors";
import { makeResponse, sendResponse } from "./api/api";
import { ZodError } from "zod";
import { Prisma, prisma } from "@repo/db";

export function handleAPIError(error: any, res: Response) {
    if (error instanceof ServerError) {
        console.warn(error.name, error.statusCode, `=> ${error.message}`);
        sendResponse(res, makeResponse(false, error.statusCode, error.message));
        return;
    } else if (error instanceof ZodError) {
        console.warn(error.name, `=> ${error.message}`);
        sendResponse(res, makeResponse(false, 400, "Invalid request data", error.message));
        return;
    }
    console.error("Unexpected error:", error);
    sendResponse(res, makeResponse(false, 500, "Internal server error"));
}

export async function getUser<T extends Prisma.UserSelect>(token: string, select: T): Promise<Prisma.UserGetPayload<{ select: T }>> {
    const session = await prisma.session.findUnique({
        where: { sessionToken: token },
        select: {
            user: {
                select
            }
        }
    });
    if (!session) throw new ServerError(401, "Unauthorized");
    return session.user;
}