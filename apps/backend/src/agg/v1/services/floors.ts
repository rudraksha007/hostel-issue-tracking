import { prisma } from "@repo/db";
import { makeResponse, type APIResponseT, type GetFloorsRequestT, type GetFloorsResponseT } from "@repo/shared/types/api";

export async function getFloors(data: GetFloorsRequestT): Promise<APIResponseT<GetFloorsResponseT>> {
    const floor = await prisma.floor.findMany({
        where: {
            ...(data.blockId ? { blockId: data.blockId } : {}),
            ...(data.hostelId ? { block: { buildingId: data.hostelId } } : {}),
            ...(data.search ? { OR: [{ id: { contains: data.search } }, { number: { contains: data.search } }] } : {})
        },
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
            },
            _count: {
                select: { rooms: true }
            },
            rooms: {
                select: {
                    _count: { select: { seats: true } },
                }
            }
        },
        skip: (data.page - 1) * data.pageSize,
        take: data.pageSize,
    });
    const d: GetFloorsResponseT["floors"] = floor.map(f => {
        let seats = 0;
        for (const r of f.rooms) {
            seats += r._count.seats;
        }
        return {
            id: f.id,
            number: f.number,
            block: {
                id: f.block.id,
                name: f.block.name,
            },
            hostel: {
                id: f.block.building.id,
                name: f.block.building.name
            },
            rooms: f._count.rooms,
            seats
        };
    });
    return makeResponse(true, 200, "Floors fetched successfully", {
        floors: d,
        total: d.length,
    });
}