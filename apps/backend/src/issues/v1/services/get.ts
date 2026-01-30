import { prisma } from "@repo/db";
import { makeResponse, type APIResponseT, type GetIssuesRequestT, type GetIssuesResponseT } from "@repo/shared/types/api";

export async function getAllIssues(data: GetIssuesRequestT, sort: 'OLD_FIRST' | 'NEW_FIRST' = 'OLD_FIRST'): Promise<APIResponseT<GetIssuesResponseT>> {
    const issues = await prisma.issue.findMany({
        where: {
            ...(data.issueId ? { id: data.issueId } : {
                status: {
                    in: data.status
                },
                priority: {
                    in: data.priority
                },
                ...(data.raisedBy ? { raisedBy: { id: data.raisedBy } } : {}),
                ...(data.assignedTo ? { assignedToId: data.assignedTo } : {}),
                isPublic: data.isPublic,
                ...(data.issueId ? { id: data.issueId } : {}),
                ...(data.groupTag ? { groupTag: data.groupTag } : {})
            }),
        },
        select: {
            id: true,
            title: true,
            description: true,
            priority: true,
            status: true,
            images: true,
            createdAt: true,
            updatedAt: true,
            isPublic: true,
            remarks: true,
            raisedBy: {
                select: {
                    id: true,
                    name: true
                }
            },
            group: {
                select: {
                    id: true,
                }
            },
            assignedTo: {
                select: {
                    id: true,
                    name: true
                }
            }
        },
        skip: (data.page - 1) * data.pageSize,
        take: data.pageSize,
        orderBy: {
            createdAt: sort === 'OLD_FIRST' ? 'asc' : 'desc'
        }
    });
    const formatted = issues.map(iss => ({
        ...iss,
        group: iss.group.id,
    }));
    return makeResponse(true, 200, "Issues fetched successfully", { issues: formatted });
}