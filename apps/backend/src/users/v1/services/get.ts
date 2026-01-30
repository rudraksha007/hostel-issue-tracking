import { prisma } from "@repo/db";
import { NotFoundError } from "@repo/shared/errors";
import { makeResponse, type APIResponseT, type GetUsersRequestT, type GetUsersResponseT } from "@repo/shared/types/api";

export async function getUsers(data: GetUsersRequestT, wardenId?: string): Promise<APIResponseT<GetUsersResponseT>> {
    const users = await prisma.user.findMany({
        where: {
            userType: { in: data.types },
            ...(data.search ? {
                OR: [
                    { name: { contains: data.search, mode: 'insensitive' } },
                    { email: { contains: data.search, mode: 'insensitive' } },
                    { phone: { contains: data.search, mode: 'insensitive' } },
                ]
            } : {})
            ,
            ...(data.gender ? { gender: { in: data.gender } } : {}),
            ...(wardenId ? { seat: { room: { floor: { wardens: { some: { id: wardenId } } } } } } : {})
        },
        select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            userType: true,
            gender: true,
            seat: {
                select: {
                    seatNo: true,
                    room: {
                        select: {
                            roomNo: true,
                            floor: {
                                select: {
                                    number: true,
                                    block: {
                                        select: {
                                            name: true,
                                            building: {
                                                select: {
                                                    name: true
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        },
        take: data.pageSize,
        skip: (data.page - 1) * data.pageSize,
    });
    return makeResponse(true, 200, "Users fetched successfully", {
        users: users.map(u => ({
            ...u,
            seat: u.seat ? {
                number: u.seat.seatNo,
                room: u.seat.room.roomNo,
                floor: u.seat.room.floor.number,
                block: u.seat.room.floor.block.name,
                hostel: u.seat.room.floor.block.building.name
            } : undefined
        }))
    });
}

export async function getUserById(userId: string) {
    const user = await prisma.user.findUnique({
        where: { id: userId },
        select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            userType: true,
            seat: {
                select: {
                    id: true,
                    seatNo: true,
                    room: {
                        select: {
                            roomNo: true,
                            floor: {
                                select: {
                                    number: true,
                                    wardens: { 
                                        select: {
                                            id: true
                                        }
                                    },
                                    block: {
                                        select: {
                                            name: true,
                                            building: {
                                                select: {
                                                    name: true
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    });
    if (!user) throw new NotFoundError('User not found');
    const data =  {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        userType: user.userType,
        seat: user.seat ? {
            id: user.seat.id,
            number: user.seat.seatNo,
        } : undefined,
        room: user.seat ? user.seat.room.roomNo : undefined,
        floor: user.seat ? user.seat.room.floor.number : undefined,
        wardens: user.seat ? user.seat.room.floor.wardens.map(w => w.id) : [],
        block: user.seat ? user.seat.room.floor.block.name : undefined,
        hostel: user.seat ? user.seat.room.floor.block.building.name : undefined,
    }
    return makeResponse(true, 200, "User fetched successfully", data);
}