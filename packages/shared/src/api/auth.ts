import { Gender, UserType } from "@repo/db/browser";
import z from "zod";

export const APIResponse = <T extends z.ZodTypeAny>(dataSchema: T) => z.object({
    success: z.boolean().default(true),
    statusCode: z.number().default(200),
    msg: z.string().optional(),
    data: dataSchema.optional(),
})

export type APIResponseT<T = any> = {
    success: boolean;
    statusCode: number;
    msg?: string;
    data?: T;
};

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
    phone: z.string().min(10),
    userType: z.enum(Object.values(UserType)),
    gender: z.enum(Object.values(Gender)).default(Gender.PREFER_NOT_TO_SAY),
    seat: z.string().optional()
});

export type CreateUserRequestT = z.infer<typeof CreateUserRequest>;