import { prisma } from "@repo/db";
import { makeResponse, type APIResponseT, type GetBlocksRequestT, type GetBlocksResponseT } from "@repo/shared/types/api";

export async function getBlocks(data: GetBlocksRequestT): Promise<APIResponseT<GetBlocksResponseT>> {
    const blocks = await prisma.block.findMany({
        where: {
            ...(data.hostelId ? { buildingId: data.hostelId } : {}),
            ...(data.search ? { OR: [{ id: { contains: data.search } }, { name: { contains: data.search } }] } : {})
        },
        select: {
            id: true,
            name: true,
            building: {
                select: {
                    id: true,
                    name: true
                }
            },
            _count: {
                select: { floors: true }
            },
            floors: {
                select: {
                    _count: { select: { rooms: true } },
                    rooms: {
                        select: {
                            _count: { select: { seats: true } },
                        }
                    }
                }
            }
        }
    });
    const d: GetBlocksResponseT["blocks"] = blocks.map(b => {
        let seats = 0;
        for (const f of b.floors) {
            for (const r of f.rooms) {
                seats += r._count.seats;
            }
        }
        return {
            id: b.id,
            name: b.name,
            building: {
                id: b.building.id,
                name: b.building.name
            },
            floors: b._count.floors,
            rooms: b.floors.reduce((acc, f) => acc + f._count.rooms, 0),
            seats
        };
    });
    return makeResponse(true, 200, "Blocks fetched successfully", {
        blocks: d,
        total: d.length,
    });
}