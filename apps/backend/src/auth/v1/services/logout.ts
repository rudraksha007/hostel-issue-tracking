import { prisma } from "@repo/db";
import { NotFoundError } from "@repo/shared/errors";
import { makeResponse, type APIResponseT } from "@repo/shared/types/api";

export async function logout(sessionToken: string): Promise<APIResponseT> {
    const result = await prisma.session.delete({
        where: { sessionToken },
        select: { id: true }
    });
    if (!result) throw new NotFoundError("Session not found");
    return makeResponse(true, 200, "Logout successful");
};