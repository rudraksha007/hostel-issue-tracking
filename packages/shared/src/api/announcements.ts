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