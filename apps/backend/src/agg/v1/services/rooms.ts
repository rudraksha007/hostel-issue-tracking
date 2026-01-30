import { prisma } from "@repo/db";
import { makeResponse, type APIResponseT, type GetRoomsRequestT, type GetRoomsResponseT } from "@repo/shared/types/api";

export async function getRooms(data: GetRoomsRequestT): Promise<APIResponseT<GetRoomsResponseT>> {
    const rooms = await prisma.room.findMany({
        where: {
            ...(data.floorId ? { floorId: data.floorId } : {}),
            ...(data.blockId ? { floor: { blockId: data.blockId } } : {}),
            ...(data.hostelId ? { floor: { block: { buildingId: data.hostelId } } } : {}),
            ...(data.search ? { OR: [{ id: { contains: data.search } }, { roomNo: { contains: data.search } }] } : {})
        },
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
            },
            seats: {
                select: {
                    id: true,
                    userId: true
                }
            }
        }
    });
    const d: GetRoomsResponseT['rooms'] = rooms.map(r => ({
        id: r.id,
        roomNo: r.roomNo,
        floor: {
            id: r.floor.id,
            number: r.floor.number,
        },
        block: {
            id: r.floor.block.id,
            name: r.floor.block.name,
        },
        hostel: {
            id: r.floor.block.building.id,
            name: r.floor.block.building.name,
        },
        seats: r.seats.length,
        occupiedSeats: r.seats.filter(seat => seat.userId !== null).length
    }));
    return makeResponse(true, 200, "Rooms fetched successfully", {
        rooms: d,
        total: d.length,
    })
} 