import { prisma } from "@repo/db";
import { makeResponse, type APIResponseT, type EditFloorRequestT } from "@repo/shared/types/api";

export async function editFloor(data: EditFloorRequestT): Promise<APIResponseT> {
    if (!data.name && !data.warden) return makeResponse(false, 400, "No data to update", null);
    await prisma.floor.update({
        where: { id: data.floorId },
        data: {
            ...(data.name ? { number: data.name } : {}),
            wardens: {
                ...(data.warden && data.warden.add ? {connect: data.warden.add.map(id => ({ id }))} : {}),
                ...(data.warden && data.warden.remove ? {disconnect: data.warden.remove.map(id => ({ id }))} : {})
            }
        }
    });
    return makeResponse(true, 200, "Floor updated successfully", null);
}