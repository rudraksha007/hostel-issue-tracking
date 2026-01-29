import { Gender, UserType } from "@repo/db/browser";
import z from "zod";
import { isValidPhone } from "..";


export const LoginRequest = z.object({
    id: z.string(),
    password: z.string(),
    remember: z.boolean().optional().default(false),
});

export type LoginRequestT = z.infer<typeof LoginRequest>;

export const SignupRequest = z.object({
    id: z.string(),
    password: z.string(),
});

export type SignupRequestT = z.infer<typeof SignupRequest>;

export const CreateUserRequest = z.object({
    name: z.string(),
    email: z.email(),
    phone: z.string().min(10).refine(inp=>isValidPhone(inp), { message: "Invalid phone number" }),
    userType: z.enum(Object.values(UserType)),
    gender: z.enum(Object.values(Gender)).default(Gender.PREFER_NOT_TO_SAY),
    seat: z.string().optional()
});

export type CreateUserRequestT = z.infer<typeof CreateUserRequest>;


export const GetSessionResponse = z.object({
    id: z.string(),
    name: z.string(),
    userType: z.enum(Object.values(UserType)),
    email: z.email(),
    phone: z.string().min(10).max(16).refine(inp=>isValidPhone(inp), { message: "Invalid phone number" }),
    gender: z.enum(Object.values(Gender)),
    seat: z.object({
        number: z.string(),
        room: z.string(),
        floor: z.string(),
        block: z.string(),
        hostel: z.string(),
    }).optional(),
    refTime: z.number()
});
export type GetSessionResponseT = z.infer<typeof GetSessionResponse>;
export type LoginServiceResult = {
    id: string;
    sessionToken: string;
    age: number;
    data: GetSessionResponseT
}
