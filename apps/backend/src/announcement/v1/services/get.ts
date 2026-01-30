import { prisma } from "@repo/db";
import { makeResponse, type APIResponseT, type GetAnnouncementsRequestT, type GetAnnouncementsResponseT } from "@repo/shared/types/api";

export async function getAnnouncements(data: GetAnnouncementsRequestT, requesterId?: string): Promise<APIResponseT<GetAnnouncementsResponseT>> {
    const announcements = await prisma.announcement.findMany({
        where: {
            ...(data.id ? { id: data.id } : {}),
            ...(requesterId ? {recipients: { some: { id: requesterId } }} : {})
        },
        select: {
            id: true,
            title: true,
            content: true,
            createdAt: true,
            images: true,
            createdBy: {
                select: {
                    id: true,
                    name: true,
                    userType: true
                }
            }
        },
        skip: data.limit * (data.page - 1),
        take: data.limit,
        orderBy: {
            createdAt: 'desc'
        }
    });
    return makeResponse(true, 200, '', {
        announcements: announcements.map(ann => ({
            ...ann,
            createdAt: ann.createdAt.toISOString(),
        }))
    });
}