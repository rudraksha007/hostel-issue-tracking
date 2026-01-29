import { ClaimStatus } from "@repo/db/browser";
import z from "zod";

export const CreateLostRequest = z.object({
    name: z.string().min(1).max(100),
    description: z.string().min(1).max(1000),
    date: z.date(),
});
export type CreateLostRequestT = z.infer<typeof CreateLostRequest>;

export const CreateReturnRequest = z.object({
    lostId: z.cuid(),
    otp: z.string().length(6),
});
export type CreateReturnRequestT = z.infer<typeof CreateReturnRequest>;

export const CreateClaimRequest = z.object({
    lostId: z.cuid(),
    description: z.string().min(1).max(1000),
});
export type CreateClaimRequestT = z.infer<typeof CreateClaimRequest>;

export const CreateFoundRequest = z.object({
    name: z.string().min(1).max(100),
    description: z.string().min(1).max(1000),
    date: z.date(),
});
export type CreateFoundRequestT = z.infer<typeof CreateFoundRequest>;

export const MarkOwnerRequest = z.object({
    lostId: z.cuid(),
    claimerId: z.cuid(),
    claimId: z.cuid(),
});
export type MarkOwnerRequestT = z.infer<typeof MarkOwnerRequest>;

export const PossesRequest = z.object({
    lostId: z.cuid(),
    otp: z.string().length(6),
});
export type PossesRequestT = z.infer<typeof PossesRequest>;


export const GetItemsRequest = z.object({
    status: z.array(z.enum(Object.values(ClaimStatus))).default(Object.values(ClaimStatus)),
    lostBy: z.array(z.cuid()).default([]),
    page: z.number().min(1).default(1),
    pageSize: z.number().min(1).max(100).default(10),
    sort: z.enum(['OLD_FIRST', 'NEW_FIRST']).default('OLD_FIRST')
});
export type GetItemsRequestT = z.infer<typeof GetItemsRequest>;

export const GetItemsResponse = z.object({
    items: z.array(z.object({
        id: z.string(),
        name: z.string(),
        description: z.string(),
        images: z.array(z.string()),
        status: z.enum(Object.values(ClaimStatus)),
        lostOn: z.date().nullable(),
        foundOn: z.date().nullable(),
        storedOn: z.date().nullable(),
        claimedOn: z.date().nullable(),
        returnedOn: z.date().nullable(),
        lostBy: z.object({
            id: z.string(),
            name: z.string(),
        }).nullable(),
        foundBy: z.object({
            id: z.string(),
            name: z.string(),
        }).nullable(),
        storedBy: z.object({
            id: z.string(),
            name: z.string(),
        }).nullable(),
    }))
});
export type GetItemsResponseT = z.infer<typeof GetItemsResponse>;

export const GetClaimsRequest = z.object({
    lostId: z.cuid().optional(),
    claimer: z.array(z.cuid()).default([]),
    page: z.number().min(1).default(1),
    pageSize: z.number().min(1).max(100).default(10),
    sort: z.enum(['OLD_FIRST', 'NEW_FIRST', 'SIM_ASC', 'SIM_DESC']).default('SIM_DESC')
});
export type GetClaimsRequestT = z.infer<typeof GetClaimsRequest>;

export const GetClaimsResponse = z.object({
    claims: z.array(z.object({
        id: z.string(),
        description: z.string().optional(),
        createdAt: z.date(),
        claimer: z.object({
            id: z.string(),
            name: z.string(),
        }),
        success: z.boolean(),
        similarity: z.number(),
    }))
});
export type GetClaimsResponseT = z.infer<typeof GetClaimsResponse>;