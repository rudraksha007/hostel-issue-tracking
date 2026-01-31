import { createAnnouncement } from "@/announcement/v1/services/create";
import type { UploadedFile } from "@/lib/init";
import { getSimilarityScore } from "@/lib/model";
import { ClaimStatus, prisma } from "@repo/db";
import { AuthError, DuplicateActionError, ImpossibleTaskError, NotFoundError } from "@repo/shared/errors";
import { makeResponse, type APIResponseT, type CreateClaimRequestT, type CreateLostRequestT, type CreateReturnRequestT, type MarkOwnerRequestT, type PossesRequestT } from "@repo/shared/types/api";

function generateOtp(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
}

const statusMap: Record<ClaimStatus, number> = {
    'LOST': 0,
    'FOUND': 1,
    'STORED': 2,
    'CLAIMED': 3,
    'RETURNED': 4
}

export async function createLostItem(id: string, images: UploadedFile[], data: CreateLostRequestT): Promise<APIResponseT> {
    await prisma.lostItem.create({
        data: {
            name: data.name,
            description: data.description,
            lostOn: data.date,
            images: images.map(file => file.path),
            lostBy: { connect: { id } },
            StoreOtp: generateOtp(),
            claimOtp: generateOtp()
        }
    });
    return makeResponse(true, 201, "Lost item reported successfully");
}

export async function createFoundItem(id: string, images: UploadedFile[], data: CreateLostRequestT): Promise<APIResponseT> {
    await prisma.lostItem.create({
        data: {
            name: data.name,
            description: data.description,
            foundOn: data.date,
            images: images.map(file => file.path),
            foundBy: { connect: { id } },
            claimOtp: generateOtp(),
            StoreOtp: generateOtp()
        }
    });
    return makeResponse(true, 201, "Found item reported successfully");
}

export async function storeItem(returnerId: string, wardenId: string, data: CreateReturnRequestT): Promise<APIResponseT> {
    const item = await prisma.lostItem.findUnique({
        where: { id: data.lostId },
        select: {
            StoreOtp: true,
            status: true
        }
    });
    if (!item) throw new NotFoundError("Lost item does not exist");
    else if (statusMap[item.status] >= statusMap['STORED']) throw new DuplicateActionError("Item has already been processed");
    if (item.StoreOtp !== data.otp) throw new AuthError("Invalid OTP provided");
    await prisma.lostItem.update({
        where: { id: data.lostId },
        data: {
            foundBy: {
                connect: { id: returnerId }
            },
            storedBy: {
                connect: { id: wardenId }
            },
            foundOn: new Date(),
            status: ClaimStatus.STORED,
            storedOn: new Date()
        }
    });
    return makeResponse(true, 200, "Item return recorded successfully");
}

export async function claimItem(claimerId: string, data: CreateClaimRequestT): Promise<APIResponseT> {
    const item = await prisma.lostItem.findUnique({
        where: { id: data.lostId },
        select: {
            status: true,
            description: true
        }
    });
    if (!item) throw new NotFoundError("Lost item does not exist");
    else if (statusMap[item.status] >= statusMap['CLAIMED']) throw new DuplicateActionError("Item has already been claimed or collected");
    const similarity = await getSimilarityScore(data.description, item.description);
    await prisma.claim.create({
        data: {
            lostItem: {
                connect: { id: data.lostId }
            },
            claimer: {
                connect: { id: claimerId }
            },
            description: data.description,
            similarity
        }
    });
    return makeResponse(true, 200, "Item claim recorded successfully");
}

export async function markOwner(data: MarkOwnerRequestT): Promise<APIResponseT> {
    const claim = await prisma.claim.findUnique({
        where: { id: data.claimId },
        select: {
            lostItemId: true,
            lostItem: {
                select: {
                    claimOtp: true,
                    status: true,
                    lostById: true,
                    name: true,
                    storedBy: { select: { name: true, gender: true } }
                }
            },
        }
    });
    if (!claim) throw new NotFoundError("Claim does not exist");
    else if (claim.lostItem.status !== ClaimStatus.STORED) throw new DuplicateActionError("Item is not available for claiming");
    else if (claim.lostItem.lostById !== data.claimerId) throw new ImpossibleTaskError("Ownership can only be marked to the original owner of the item");
    await prisma.claim.update({
        where: { id: data.claimId },
        data: {
            success: true,
            lostItem: {
                update: {
                    status: ClaimStatus.CLAIMED,
                    lostBy: {
                        connect: { id: data.claimerId }
                    }
                }
            }
        }
    });

    await createAnnouncement({
        title: "Lost and Found: Item Claimed",
        content: `You have successfully claimed your lost item (${claim.lostItem.name}). ` +
            `Please share this OTP: ${claim.lostItem.claimOtp} with ${claim.lostItem.storedBy!.gender === 'FEMALE' ? 'Ms.' : 'Mr.'}` +
            `${claim.lostItem.storedBy!.name} to collect your item from the lost and found center.`,
        targeting: {
            users: [data.claimerId],
            userTypes: [],
            hostels: [],
            blocks: [],
            wardens: [],
            floors: [],
            rooms: []
        }
    }, "1", []);
    return makeResponse(true, 200, "Owner marked successfully");
}

export async function possesItem(posseserId: string, data: PossesRequestT): Promise<APIResponseT> {
    const item = await prisma.lostItem.findUnique({
        where: { id: data.lostId },
        select: {
            lostById: true,
            claimOtp: true,
            status: true
        }
    });
    if (!item) throw new NotFoundError("Lost item does not exist");
    else if (item.status !== ClaimStatus.CLAIMED) throw new DuplicateActionError("Item is not ready for collection");
    else if (item.lostById !== posseserId) throw new AuthError("You are not authorized to collect this item");
    if (item.claimOtp !== data.otp) throw new AuthError("Invalid OTP provided");
    await prisma.lostItem.update({
        where: { id: data.lostId },
        data: {
            status: ClaimStatus.RETURNED
        }
    });
    return makeResponse(true, 200, "Item possession recorded successfully");
}