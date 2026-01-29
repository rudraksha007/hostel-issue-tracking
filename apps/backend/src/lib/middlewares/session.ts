import type { Request } from "express";

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