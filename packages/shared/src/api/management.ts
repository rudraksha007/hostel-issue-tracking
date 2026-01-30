import { PlaceType } from "@repo/db/browser";
import z from "zod";

export const CreateHostelRequest = z.object({
    name: z.string().min(3).max(100),
    type: z.enum(Object.values(PlaceType))
});
export type CreateHostelRequestT = z.infer<typeof CreateHostelRequest>;


export const CreateBlockRequest = z.object({
    hostelId: z.cuid(),
    name: z.string().min(1).max(50),
    type: z.enum(Object.values(PlaceType)),
    populate: z.object({
        floors: z.number().min(1),
        roomsPerFloor: z.number().min(1),
        capacityPerRoom: z.number().min(1),
    }).optional()
});
export type CreateBlockRequestT = z.infer<typeof CreateBlockRequest>;

export const CreateFloorRequest = z.object({
    blockId: z.cuid(),
    name: z.string().min(1).max(50),
    wardens: z.array(z.cuid()).optional().default([]),
    rooms: z.number().min(1),
    capacityPerRoom: z.number().min(1)
});
export type CreateFloorRequestT = z.infer<typeof CreateFloorRequest>;

export const EditFloorRequest = z.object({
    floorId: z.cuid(),
    name: z.string().min(1).max(50).optional(),
    warden: z.object({
        add: z.array(z.cuid()).optional().default([]),
        remove: z.array(z.cuid()).optional().default([])
    }).optional().default({ add: [], remove: [] }),
});
export type EditFloorRequestT = z.infer<typeof EditFloorRequest>;

export const CreateRoomRequest = z.object({
    floorId: z.cuid(),
    number: z.string().min(1),
    capacity: z.number().min(1)
});
export type CreateRoomRequestT = z.infer<typeof CreateRoomRequest>;
