import { AuthError } from "@repo/shared/errors";
import { getUser, handleAPIError } from "@repo/shared/server";
import { makeResponse, sendResponse, type GetSessionResponseT } from "@repo/shared/types/api";
import type { Request, Response } from "express";

export async function GetSessionController(req: Request, res: Response) {
    try {
        if (!req.sessionToken) throw new AuthError("No active session found");
        const user = await getUser(req.sessionToken, {
            id: true,
            name: true,
            email: true,
            userType: true,
            phone: true,
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
        });
        const data: GetSessionResponseT = {
            id: user.id,
            name: user.name,
            email: user.email,
            phone: user.phone,
            userType: user.userType,
            gender: user.gender,
            ...(!user.seat ? {} : {
                seat: {
                    number: user.seat.seatNo,
                    room: user.seat.room.roomNo,
                    floor: user.seat.room.floor.number,
                    block: user.seat.room.floor.block.name,
                    hostel: user.seat.room.floor.block.building.name
                }
            }),
            refTime: Date.now()
        };
        sendResponse(res, makeResponse(true, 200, "Session fetched successfully", data));
    } catch (err) {
        handleAPIError(err, res);
    }
}