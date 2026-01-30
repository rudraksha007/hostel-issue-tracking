import type { Response } from "express";
import { AuthError, ServerError } from "./errors";
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
        sendResponse(res, makeResponse(false, 400, error.issues[0]?.message, error.message));
        return;
    } else if (error instanceof Prisma.PrismaClientKnownRequestError) {
        console.warn("PrismaError", error.code, `=> ${error.message}`);
        sendResponse(res, makeResponse(false, 500, "Database error", error.message));
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
    if (!session) throw new AuthError("Unauthorized");
    return session.user;
}