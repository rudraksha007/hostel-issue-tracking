import { AuthError, NotFoundError } from "@repo/shared/errors";
import bcrypt from "bcryptjs";
import { prisma, UserType } from "@repo/db";
import { ENV } from "@/lib/init";
import type { APIResponseT, GetSessionResponseT, LoginRequestT, LoginServiceResult } from "@repo/shared/types/api";

export async function login({ id, password, remember }: LoginRequestT, ipAddress: string, deviceInfo: string): Promise<APIResponseT<LoginServiceResult>> {
    const user = await prisma.user.findFirst({
        where: {
            OR: [
                { email: id },
                { phone: id },
                { id }
            ]
        },
        select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            password: true,
            userType: true,
            gender: true,
            seat: {
                select: {
                    seatNo: true, room: {
                        select: {
                            roomNo: true, floor: {
                                select: {
                                    number: true, block: { select: { name: true, building: { select: { name: true } } } }
                                }
                            }
                        }
                    }
                }
            }
        }
    });

    if (!user) throw new NotFoundError("User not found");
    const isPassValid = bcrypt.compareSync(password, user.password);
    if (!isPassValid) throw new AuthError("Invalid credentials");
    const sessionToken = crypto.randomUUID();
    const age = (!remember ? 60 * 60 : ENV.MAX_SESSION_AGE) * 1000; // 1 hour if not remember, else default max age
    await prisma.session.create({
        data: {
            sessionToken,
            user: {
                connect: {
                    id: user.id
                }
            },
            ipAddress,
            deviceInfo,
            expires: new Date(Date.now() + age)
        },
    });
    const ud: GetSessionResponseT = {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        userType: user.userType,
        gender: user.gender,
        ...(!user.seat ? {} : {
            seat: {
                number: user.seat.seatNo.toString().padStart(3, '0'),
                room: user.seat.room.roomNo.toString().padStart(3, '0'),
                floor: user.seat.room.floor.number,
                block: user.seat.room.floor.block.name,
                hostel: user.seat.room.floor.block.building.name
            }
        }),
        refTime: Date.now()
    };
    const data: LoginServiceResult = {
        id: user.id,
        sessionToken: sessionToken,
        age,
        data: ud
    }
    return { success: true, data, msg: "Login successful", statusCode: 200 };
};