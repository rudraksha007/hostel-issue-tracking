import { Gender, UserType } from "@repo/db/browser";
import z from "zod";

export const GetUsersRequest = z.object({
    types: z.array(z.enum(Object.values(UserType))).default(Object.values(UserType)),
    search: z.string().optional(),
    gender: z.array(z.enum(Object.values(Gender))).default(Object.values(Gender)),
    page: z.number().min(1).default(1),
    pageSize: z.number().min(1).max(100).default(20),
});
export type GetUsersRequestT = z.infer<typeof GetUsersRequest>;

export const GetUsersResponse = z.object({
    users: z.array(z.object({
        id: z.string(),
        name: z.string(),
        email: z.email(),
        phone: z.string(),
        userType: z.enum(Object.values(UserType)),
        gender: z.enum(Object.values(Gender)),
        seat: z.object({
            number: z.string(),
            room: z.string(),
            floor: z.string(),
            block: z.string(),
            hostel: z.string(),
        }).optional(),
    })),
});
export type GetUsersResponseT = z.infer<typeof GetUsersResponse>;