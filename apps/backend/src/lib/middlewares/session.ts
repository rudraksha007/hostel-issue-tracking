import { prisma, type Prisma } from "@repo/db";
import { AuthError } from "@repo/shared/errors";
import type { Request } from "express";

declare module "express" {
    interface Request {
        sessionToken?: string;
    }
}

export function parseSession(req: Request, _: any, next: Function) {
    const token = req.cookies["session-token"];
    req.sessionToken = token || undefined;
    next();
}

const d = {
    id: true,
    name: true,
    email: true,
    phone: true,
    userType: true,
};
export async function getUser<T extends Prisma.UserSelect>(req: Request, select: T = d as T): Promise<Prisma.UserGetPayload<{ select: T }>> {
    if (!req.sessionToken) throw new AuthError("Unauthorized", 401);
    const res = await prisma.session.findUnique({
        where: { sessionToken: req.sessionToken },
        select: {
            user: {
                select
            }
        }
    });
    if (!res) throw new AuthError("Unauthorized", 401);
    return res.user;
}