import { Priority } from "@repo/db/browser";
import z from "zod";

export const CreateIssueRequest = z.object({
    title: z.string().min(5).max(50),
    description: z.string().min(10).max(500),
    priority: z.enum(Object.values(Priority)).default(Priority.MEDIUM),
    raisedBy: z.string(), // raiser's id
    isPublic: z.boolean().default(false),
    remarks: z.string().max(300).optional()
});
export type CreateIssueRequestT = z.infer<typeof CreateIssueRequest>;


export const CreateIssueResponse = z.object({
    issueId: z.string(),
});
export type CreateIssueResponseT = z.infer<typeof CreateIssueResponse>;
