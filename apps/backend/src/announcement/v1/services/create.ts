import type { UploadedFile } from "@/lib/init";
import { prisma } from "@repo/db";
import { ServerError } from "@repo/shared/errors";
import { makeResponse, type AnnouncementRequestT, type AnnouncementResponseT, type APIResponseT } from "@repo/shared/types/api";

export async function createAnnouncement(data: AnnouncementRequestT, author: string, images: UploadedFile[] = []): Promise<APIResponseT<AnnouncementResponseT>> {
    let anId: string | null = null;
    await prisma.$transaction(async tx => {
        data.targeting.users = data.targeting.users.concat([author]);
        const d = await tx.user.findMany({
            where: {
                OR: [
                    { id: { in: data.targeting.users } },
                    { userType: { in: data.targeting.userTypes } },
                    {
                        seat: {
                            room: {
                                OR: [
                                    ...(data.targeting.rooms.length ? [{ id: { in: data.targeting.rooms } }] : []),
                                    {
                                        floor: {
                                            OR: [
                                                ...(data.targeting.floors.length ? [{ id: { in: data.targeting.floors } }] : []),
                                                ...(data.targeting.wardens.length ? [{ wardens: { some: { id: { in: data.targeting.wardens } } } }] : []),
                                                {
                                                    block: {
                                                        OR: [
                                                            ...(data.targeting.blocks.length ? [{ id: { in: data.targeting.blocks } }] : []),
                                                            ...(data.targeting.hostels.length ? [{ buildingId: { in: data.targeting.hostels } }] : [])
                                                        ]
                                                    }
                                                }
                                            ]
                                        }
                                    }
                                ]
                            }
                        }
                    }
                ]
            }
        });
        anId = (await tx.announcement.create({
            data: {
                title: data.title,
                content: data.content,
                targetPolicy: data.targeting,
                images: images.map(img => img.name),
                createdBy: {
                    connect: { id: author }
                },
                recipients: {
                    connect: d.map(u => ({ id: u.id }))
                }
            }
        })).id;
    });
    if (!anId) throw new ServerError(500, "Failed to create announcement");
    return makeResponse(true, 201, "Announcement created successfully", { announcementId: anId });
}