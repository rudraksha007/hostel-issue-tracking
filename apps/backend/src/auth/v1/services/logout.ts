import { Prisma, prisma } from "@repo/db";
import { makeResponse, type APIResponseT } from "@repo/shared/types/api";

export async function logout(sessionToken: string): Promise<APIResponseT> {
    try {
        await prisma.session.delete({
            where: { sessionToken },
        });
        return makeResponse(true, 200, "Logout successful");
    } catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
            return makeResponse(true, 202, "Session not found, already logged out");
        }
        return makeResponse(false, 500, "Failed to logout");
    }
};