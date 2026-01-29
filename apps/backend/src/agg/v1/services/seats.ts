import { prisma } from "@repo/db";
import { makeResponse, type APIResponseT, type GetSeatsRequestT, type GetSeatsResponseT } from "@repo/shared/types/api";

export async function getSeats(data: GetSeatsRequestT): Promise<APIResponseT<GetSeatsResponseT>> {
    const seats = await prisma.seat.findMany({
        where: {
            ...(data.roomId ? { roomId: data.roomId } : {}),
            ...(data.floorId ? { room: { floorId: data.floorId } } : {}),
            ...(data.blockId ? { room: { floor: { blockId: data.blockId } } } : {}),
            ...(data.hostelId ? { room: { floor: { block: { buildingId: data.hostelId } } } } : {}),
            ...(data.search ? { OR: [{ id: { contains: data.search } }, { seatNo: { contains: data.search } }] } : {}),
            ...(data.unoccupiedOnly ? { userId: null } : {}),
        },
        select: {
            id: true,
            seatNo: true,
            room: {
                select: {
                    id: true,
                    roomNo: true,
                    floor: {
                        select: {
                            id: true,
                            number: true,
                            block: {
                                select: {
                                    id: true,
                                    name: true,
                                    building: {
                                        select: {
                                            id: true,
                                            name: true
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            },
            user: {
                select: {
                    id: true,
                    name: true,
                    email: true,
                    phone: true,
                }
            }
        }
    });
    const d: GetSeatsResponseT['seats'] = seats.map(s => ({
        id: s.id,
        number: s.seatNo,
        room: {
            id: s.room.id,
            roomNo: s.room.roomNo,
        },
        floor: {
            id: s.room.floor.id,
            number: s.room.floor.number,
        },
        block: {
            id: s.room.floor.block.id,
            name: s.room.floor.block.name,
        },
        hostel: {
            id: s.room.floor.block.building.id,
            name: s.room.floor.block.building.name,
        },
    }));
    return makeResponse(true, 200, "Seats fetched successfully", {
        seats: d,
        total: d.length,
    })
}