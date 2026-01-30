import { UserType } from "@repo/db/browser";
import z from "zod";

export const AnnouncementRequest = z.object({
    title: z.string().min(5).max(100),
    content: z.string().min(10).max(1000),
    targeting: z.object({
        userTypes: z.array(z.enum(Object.values(UserType))).default(Object.values(UserType)),
        wardens: z.array(z.string()).default([]),
        users: z.array(z.string()).default([]),
        rooms: z.array(z.string()).default([]),
        floors: z.array(z.string()).default([]),
        blocks: z.array(z.string()).default([]),
        hostels: z.array(z.string()).default([]),
    })
});
export const AnnouncementResponse = z.object({
    announcementId: z.string(),
});
export type AnnouncementRequestT = z.infer<typeof AnnouncementRequest>;
export type AnnouncementResponseT = z.infer<typeof AnnouncementResponse>;


export const GetAnnouncementsRequest = z.object({
    id: z.cuid().optional(),
    page: z.number().min(1).default(1),
    limit: z.number().min(1).max(100).default(10),
});
export type GetAnnouncementsRequestT = z.infer<typeof GetAnnouncementsRequest>;

export const GetAnnouncementsResponse = z.object({
    announcements: z.array(z.object({
        id: z.string(),
        title: z.string(),
        content: z.string(),
        createdAt: z.string(),
        createdBy: z.object({
            id: z.string(),
            name: z.string(),
            userType: z.enum(Object.values(UserType)),
        }),
        images: z.array(z.string()),
    })),

});
export type GetAnnouncementsResponseT = z.infer<typeof GetAnnouncementsResponse>;