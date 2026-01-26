import { prisma } from "@repo/db";
import { makeResponse, type APIResponseT } from "@repo/shared/types/api";

export async function comment(userId: string, content: string, issue: string, parent?: string): Promise<APIResponseT> {
    await prisma.comment.create({
        data: {
            content,
            issue: {
                connect: { id: issue }
            },
            user: {
                connect: { id: userId }
            },
            ...(parent ? {
                parent: {
                    connect: { id: parent }
                }
            } : {})
        }
    });
    return makeResponse(true, 201, "Comment added successfully");
}