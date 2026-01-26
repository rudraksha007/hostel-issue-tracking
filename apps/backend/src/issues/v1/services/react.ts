import { prisma } from "@repo/db";
import { makeResponse, type APIResponseT, type ReactRequestT } from "@repo/shared/types/api";

export async function react(userId: string, data: ReactRequestT): Promise<APIResponseT> {
    await prisma.reaction.upsert({
        where: {
            targetId_userId: {
                targetId: data.target,
                userId: userId
            }
        },
        update: {
            type: data.reaction
        },
        create: {
            targetId: data.target,
            target: data.targetType,
            user: {
                connect: { id: userId }
            },
            type: data.reaction
        }
    });
    return makeResponse(true, 200, "Reaction recorded successfully");
}