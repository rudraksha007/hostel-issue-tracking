import { prisma } from "@repo/db";
import { makeResponse, type APIResponseT, type GetClaimsRequestT, type GetClaimsResponseT, type GetItemsRequestT, type GetItemsResponseT } from "@repo/shared/types/api";

export async function getItems(data: GetItemsRequestT): Promise<APIResponseT<GetItemsResponseT>> {
    const res = await prisma.lostItem.findMany({
        where: {
            AND: [
                ...(data.status ? [{ status: { in: data.status } }] : []),
                ...(data.lostBy ? [{ lostById: { in: data.lostBy } }] : [])
            ]
        },
        orderBy: {
            createdAt: data.sort === 'NEW_FIRST' ? 'desc' : 'asc'
        },
        skip: (data.page - 1) * data.pageSize,
        take: data.pageSize,
        select: {
            id: true,
            name: true,
            description: true,
            images: true,
            status: true,
            lostOn: true,
            foundOn: true,
            storedOn: true,
            returnedOn: true,
            claims: {
                where: { success: true },
                select: {
                    createdAt: true
                }
            },
            lostBy: {
                select: {
                    id: true,
                    name: true,
                }
            },
            foundBy: {
                select: {
                    id: true,
                    name: true,
                }
            },
            storedBy: {
                select: {
                    id: true,
                    name: true,
                }
            }
        }
    });
    const items = res.map(item => ({
        id: item.id,
        name: item.name,
        description: item.description,
        images: item.images,
        status: item.status,
        lostOn: item.lostOn,
        foundOn: item.foundOn,
        storedOn: item.storedOn,
        claimedOn: item.claims?.length > 0 ? item.claims[0]!.createdAt : null,
        returnedOn: item.returnedOn,
        lostBy: item.lostBy,
        foundBy: item.foundBy,
        storedBy: item.storedBy,
    }));
    return makeResponse(true, 200, "Lost and found items fetched successfully", { items });
}

function getOrderClause(sort: 'OLD_FIRST' | 'NEW_FIRST' | "SIM_ASC" | "SIM_DESC") {
    if (sort === 'OLD_FIRST') return { createdAt: 'asc' as const };
    else if (sort === 'NEW_FIRST') return { createdAt: 'desc' as const };
    else if (sort === 'SIM_ASC') return { similarity: 'asc' as const };
    else if (sort === 'SIM_DESC') return { similarity: 'desc' as const };
    else return undefined;
}

export async function getClaims(data: GetClaimsRequestT): Promise<APIResponseT<GetClaimsResponseT>> {
    const res = await prisma.claim.findMany({
        where: {
            ...(data.lostId ? { lostItemId: data.lostId } : {}),
            ...(data.claimer.length > 0 ? { claimerId: { in: data.claimer } } : {})
        },
        orderBy: getOrderClause(data.sort),
        skip: (data.page - 1) * data.pageSize,
        take: data.pageSize,
        select: {
            id: true,
            description: true,
            createdAt: true,
            claimer: {
                select: {
                    id: true,
                    name: true,
                }
            },
            success: true,
            similarity: true,
        }
    });
    const claims = res.map(claim => ({
        id: claim.id,
        description: claim.description || undefined,
        createdAt: claim.createdAt,
        claimer: claim.claimer,
        success: claim.success,
        similarity: claim.similarity,
    }));
    return makeResponse(true, 200, "Claims fetched successfully", { claims });
} 