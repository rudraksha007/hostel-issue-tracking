import { Priority, ReactionTarget, ReactionType, Status, TimeSlot } from "@repo/db/browser";
import z from "zod";

export const CreateIssueRequest = z.object({
    title: z.string().min(5).max(50),
    description: z.string().min(10).max(500),
    priority: z.enum(Object.values(Priority)).default(Priority.MEDIUM),
    raisedBy: z.string(), // raiser's id
    isPublic: z.boolean().default(false),
    category: z.string().min(3).max(50),
    subCategory: z.string().min(3).max(50),
    timeSlot: z.array(z.enum(Object.values(TimeSlot))).default([]).refine((arr)=> arr.length > 0, { message: "At least one time slot must be selected" }),
    groupTag: z.string().optional(),
    remarks: z.string().max(300).optional()
});
export type CreateIssueRequestT = z.infer<typeof CreateIssueRequest>;


export const CreateIssueResponse = z.object({
    issueId: z.string(),
});
export type CreateIssueResponseT = z.infer<typeof CreateIssueResponse>;


export const EditIssueRequest = z.object({
    issueId: z.string(),
    assignedTo: z.string(),
    title: z.string().min(5).max(50),
    description: z.string().min(10).max(500),
    priority: z.enum(Object.values(Priority)),
    isPublic: z.boolean().default(false),
    remarks: z.string().max(300),
    groupTag: z.string(),
    images: z.array(z.string()).default([]),
});
export type EditIssueRequestT = z.infer<typeof EditIssueRequest>;


export const ReactRequest = z.object({
    target: z.string(),
    targetType: z.enum(Object.values(ReactionTarget)),
    reaction: z.enum(Object.values(ReactionType)),
});
export type ReactRequestT = z.infer<typeof ReactRequest>;

export const CommentRequest = z.object({
    target: z.string(),
    targetType: z.enum([ReactionTarget.ISSUE, ReactionTarget.COMMENT]),
    content: z.string().min(1).max(1000),
});
export type CommentRequestT = z.infer<typeof CommentRequest>;

export const GetIssuesRequest = z.object({
    issueId: z.string().optional(),
    status: z.array(z.enum(Object.values(Status))).default(Object.values(Status)),
    priority: z.array(z.enum(Object.values(Priority))).default(Object.values(Priority)),
    assignedTo: z.string().optional(),
    raisedBy: z.string().optional(),
    warden: z.string().optional(),
    isPublic: z.boolean().default(true),
    groupTag: z.string().optional(),
    page: z.number().min(1).default(1),
    pageSize: z.number().min(1).max(100).default(10),
    sort: z.enum(['OLD_FIRST', 'NEW_FIRST']).default('OLD_FIRST')
});
export type GetIssuesRequestT = z.infer<typeof GetIssuesRequest>;


export const GetIssuesResponse = z.object({
    issues: z.array(z.object({
        id: z.string(),
        title: z.string(),
        description: z.string(),
        priority: z.enum(Object.values(Priority)),
        status: z.enum(Object.values(Status)),
        images: z.array(z.string()),
        createdAt: z.date(),
        updatedAt: z.date(),
        isPublic: z.boolean(),
        remarks: z.string().nullable().optional(),
        raisedBy: z.object({
            id: z.string(),
            name: z.string(),
        }),
        assignedTo: z.object({
            id: z.string(),
            name: z.string(),
        }).nullable(),
        group: z.string(),
    }))
});
export type GetIssuesResponseT = z.infer<typeof GetIssuesResponse>;


export const GetIssueResponse = z.object({
    id: z.string(),
});

export type GetIssueResponseT = z.infer<typeof GetIssueResponse>;