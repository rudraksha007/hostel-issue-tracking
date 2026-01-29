import { prisma } from "@repo/db";
import { makeResponse, type APIResponseT, type GetHostelsRequestT, type GetHostelsResponseT } from "@repo/shared/types/api";

export async function getHostels(data: GetHostelsRequestT): Promise<APIResponseT<GetHostelsResponseT>> {
    const hostels = await prisma.building.findMany({
        where: {
            ...(data.search ? {
                OR: [{ id: { contains: data.search } }, { name: { contains: data.search } }]
            }: {}),
        },
        select: {
            id: true,
            name: true,
            _count: {
                select: { blocks: true }
            },
            blocks: {
                select: {
                    _count: {
                        select: { floors: true }
                    },
                    floors: {
                        select: {
                            _count: {
                                select: { rooms: true }
                            },
                            rooms: {
                                select: {
                                    _count: {
                                        select: { seats: true }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        },
        skip: (data.page - 1) * data.pageSize,
        take: data.pageSize,
    });
    let seats = 0, rooms = 0, floors = 0;
    for(const h of hostels) {
        for(const b of h.blocks) {
            for(const f of b.floors) {
                for(const r of f.rooms) {
                    seats += r._count.seats;
                }
                rooms += f._count.rooms;
            }
            floors += b._count.floors;
        }
    }
    const d: GetHostelsResponseT['hostels'] = hostels.map(h=> ({
        id: h.id,
        name: h.name,
        blocks: h._count.blocks,
        floors,
        rooms,
        seats,
    }));
    return makeResponse(true, 200, "Hostels fetched successfully", {
        hostels: d,
        total: d.length,
    });
}