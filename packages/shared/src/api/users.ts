import { Gender, UserType } from "@repo/db/browser";
import z from "zod";

export const GetUsersRequest = z.object({
    types: z.array(z.enum(Object.values(UserType))).default(Object.values(UserType)).optional(),
    search: z.string().optional(),
    gender: z.array(z.enum(Object.values(Gender))).default(Object.values(Gender)).optional(),
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

export const EditUserRequest = z.object({
    id: z.cuid(),
    name: z.string().min(1).max(100).optional(),
    email: z.email().optional(),
    phone: z.string().min(7).max(15).optional(),
    password: z.string().min(6).max(100).optional(),
    adminOnly: z.object({
        userType: z.enum(Object.values(UserType)).optional(),
        gender: z.enum(Object.values(Gender)).optional(),
    }).optional(),
    seatId: z.cuid().optional(),
    clearSeat: z.boolean().optional(),
}).refine(
    (data) => !(data.clearSeat && data.seatId),
    { message: "Cannot provide both clearSeat and seatId", path: ["seatId"] }
);
export type EditUserRequestT = z.infer<typeof EditUserRequest>;