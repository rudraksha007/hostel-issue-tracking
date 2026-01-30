import { prisma } from "@repo/db";
import { NotFoundError } from "@repo/shared/errors";
import { makeResponse, type APIResponseT, type EditUserRequestT } from "@repo/shared/types/api";
import bcrypt from "bcryptjs";

export async function editUser(data: EditUserRequestT): Promise<APIResponseT> {
    try {
        await prisma.user.update({
            where: { id: data.id },
            data: {
                ...(data.name ? { name: data.name } : {}),
                ...(data.email ? { email: data.email } : {}),
                ...(data.phone ? { phone: data.phone } : {}),
                ...(data.password ? { password: bcrypt.hashSync(data.password, 10) } : {}),
                ...(data.adminOnly ? {
                    ...(data.adminOnly.userType ? { userType: data.adminOnly.userType } : {}),
                    ...(data.adminOnly.gender ? { gender: data.adminOnly.gender } : {}),
                } : {}),
                ...(data.seatId ? { seat: { connect: { id: data.seatId } } } : {}),
                ...(data.clearSeat && !data.seatId ? { seat: { disconnect: true } } : {}),
            }
        });
        return makeResponse(true, 200, "User edited successfully");
    } catch (err: any){
        if (err.code === 'P2025') {
            throw new NotFoundError('User not found');
        }
        throw err;
    }
}