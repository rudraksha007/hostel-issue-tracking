import { prisma } from "@repo/db";
import { makeResponse, type APIResponseT, type EditIssueRequestT } from "@repo/shared/types/api";

export async function editIssue(data: Partial<EditIssueRequestT>): Promise<APIResponseT> {
    await prisma.issue.update({
        where: { id: data.issueId },
        data: {
            ...(data.title ? { title: data.title } : {}),
            ...(data.description ? { description: data.description } : {}),
            ...(data.priority ? { priority: data.priority } : {}),
            isPublic: data.isPublic,
            ...(data.remarks ? { remarks: data.remarks } : {}),
            ...(data.groupTag ? { group: { connect: { id: data.groupTag } } } : {}),
            ...(data.assignedTo ? { assignedTo: { connect: { id: data.assignedTo } } } : {}),
            ...(data.images ? { images: data.images } : {}),
        }
    });
    return makeResponse(true, 200, "Issue edited successfully");
}