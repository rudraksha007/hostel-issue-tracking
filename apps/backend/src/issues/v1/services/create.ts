import { prisma } from "@repo/db";
import { makeResponse, type APIResponseT, type CreateIssueRequestT, type CreateIssueResponseT } from "@repo/shared/types/api";

export async function createIssue(data: CreateIssueRequestT, roomId: string): Promise<APIResponseT<CreateIssueResponseT>> {
    const { title, description, priority, raisedBy, isPublic, remarks } = data;
    const issue = await prisma.issue.create({
        data: {
            title,
            description,
            priority,
            raisedBy: {
                connect: { id: raisedBy }
            },
            room: {
                connect: { id: roomId }
            },
            isPublic,
            remarks: remarks || ""
        }
    });
    return makeResponse(true, 201, "Issue created successfully", { issueId: issue.id });
}