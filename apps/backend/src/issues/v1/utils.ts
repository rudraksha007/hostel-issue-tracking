import { Prisma, prisma } from "@repo/db";
import { NotFoundError } from "@repo/shared/errors";

export async function getIssue<T extends Prisma.IssueSelect>(issueId: string, select: T): Promise<Prisma.IssueGetPayload<{ select: T }>> {
    const issue = await prisma.issue.findUnique({
        where: { id: issueId },
        select
    });
    if (!issue) throw new NotFoundError("Issue not found", 404);
    return issue;
}

export async function getComment<T extends Prisma.CommentSelect>(commentId: string, select: T): Promise<Prisma.CommentGetPayload<{ select: T }>> {
    const comment = await prisma.comment.findUnique({
        where: { id: commentId },
        select
    });
    if (!comment) throw new NotFoundError("Comment not found", 404);
    return comment;
}

export async function getAnnouncement<T extends Prisma.AnnouncementSelect>(announcementId: string, select: T): Promise<Prisma.AnnouncementGetPayload<{ select: T }>> {
    const announcement = await prisma.announcement.findUnique({
        where: { id: announcementId },
        select
    });
    if (!announcement) throw new NotFoundError("Announcement not found", 404);
    return announcement;
}