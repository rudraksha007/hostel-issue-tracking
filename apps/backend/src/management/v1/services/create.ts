import { Prisma, prisma } from "@repo/db";
import { InvalidInputError, NotFoundError } from "@repo/shared/errors";
import { makeResponse, type APIResponseT, type CreateBlockRequestT, type CreateFloorRequestT, type CreateHostelRequestT } from "@repo/shared/types/api";

export async function createHostel(data: CreateHostelRequestT): Promise<APIResponseT> {
    await prisma.building.create({
        data: {
            name: data.name,
            type: data.type
        }
    });
    return makeResponse(true, 201, "Hostel created successfully");
}

export async function createBlock(data: CreateBlockRequestT): Promise<APIResponseT> {
    const hostel = await prisma.building.findUnique({
        where: { id: data.hostelId },
        select: { type: true }
    });
    if (!hostel) throw new NotFoundError("Hostel not found");
    if (hostel.type !== 'BOTH' && hostel.type !== data.type) throw new InvalidInputError(`${hostel.type} hostel cannot have ${data.type} blocks`);
    const maxFloorDigits = Math.floor(Math.log10(data.populate?.floors ?? 1)) + 1;
    const maxRoomDigits = Math.floor(Math.log10(data.populate?.roomsPerFloor ?? 1)) + 1;
    const maxSeatDigits = Math.floor(Math.log10(data.populate?.capacityPerRoom ?? 1)) + 1;
    await prisma.$transaction(async (tx) => {
        const block = await tx.block.create({
            data: {
                name: data.name,
                type: data.type,
                building: { connect: { id: data.hostelId } },
                floors: {
                    createMany: {
                        data: [
                            { number: "01", }
                        ]
                    }
                },
                ...(data.populate ? {
                    floors: {
                        createMany: {
                            data: Array.from({ length: data.populate?.floors ?? 0 }, (_, i) => ({
                                number: `${(i + 1).toString().padStart(maxFloorDigits, '0')}`,
                            }))
                        }
                    }
                } : {})
            },
            select: {
                floors: {
                    select: { id: true }
                }
            }
        });
        const floorIds = block.floors.map(f => f.id);
        if (!data.populate) return;
        let seatData: { seatNo: string; roomId: string }[] = [];
        for (const [i, floorId] of floorIds.entries()) {
            const rooms = await tx.room.createManyAndReturn({
                data: Array.from({ length: data.populate.roomsPerFloor }, (_, j) => ({
                    roomNo: `${j + 1}`.padStart(maxRoomDigits, '0'),
                    floorId: floorId,
                })),
                select: { id: true }
            });
            const roomIds = rooms.map(r => r.id);
            for (const roomId of roomIds) {
                const seatsOfRoom = Array.from({ length: data.populate.capacityPerRoom }, (_, k) => ({
                    seatNo: `${k + 1}`.padStart(maxSeatDigits, '0'),
                    roomId: roomId,
                }));
                seatData = seatData.concat(seatsOfRoom);
            }
        }
        if (seatData.length > 0) {
            await tx.seat.createMany({
                data: seatData
            });
        }
    })
    return makeResponse(true, 201, "Block created successfully");
}

export async function createFloor(data: CreateFloorRequestT): Promise<APIResponseT> {
    try {
        const maxDigits = Math.floor(Math.log10(data.rooms)) + 1;
        const maxSeatDigits = Math.floor(Math.log10(data.capacityPerRoom)) + 1;
        await prisma.floor.create({
            data: {
                number: data.name,
                block: { connect: { id: data.blockId } },
                wardens: { connect: data.wardens.map(w => ({ id: w })) },
                rooms: {
                    createMany: {
                        data: Array.from({ length: data.rooms }, (_, i) => ({
                            roomNo: `${(i + 1).toString().padStart(maxDigits, '0')}`,
                            seats: {
                                createMany: {
                                    data: Array.from({ length: data.capacityPerRoom }, (_, j) => ({
                                        seatNo: `${(j + 1).toString().padStart(maxSeatDigits, '0')}`
                                    }))
                                }
                            }
                        }))
                    }
                }
            }
        });
        return makeResponse(true, 201, "Floor created successfully");
    } catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
            if (error.code === 'P2025') throw new NotFoundError("Invalid block of warden Id provided");
        }
        throw error;
    }
}