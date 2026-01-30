import type { UploadedFile } from "@/lib/init";
import { prisma, TimeSlot } from "@repo/db";
import { makeResponse, type APIResponseT, type CreateIssueRequestT, type CreateIssueResponseT } from "@repo/shared/types/api";

export async function createIssue(data: CreateIssueRequestT, files: UploadedFile[], roomId: string): Promise<APIResponseT<CreateIssueResponseT>> {
    const { title, description, priority, raisedBy, isPublic, remarks } = data;
    const issue = await prisma.issue.create({
        data: {
            title,
            description,
            priority,
            timeSlot: data.timeSlot,
            category: data.category,
            subCategory: data.subCategory,
            images: files.map(file => file.name),
            raisedBy: {
                connect: { id: raisedBy }
            },
            room: {
                connect: { id: roomId }
            },
            group: { create: {} },
            isPublic,
            remarks: remarks || ""
        }
    });
    return makeResponse(true, 201, "Issue created successfully", { issueId: issue.id });
}