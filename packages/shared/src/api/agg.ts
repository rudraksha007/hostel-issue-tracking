import z from "zod";

export const GetHostelsRequest = z.object({
    search: z.string().optional(),
    page: z.number().min(1).default(1),
    pageSize: z.number().min(1).default(10),
});
export type GetHostelsRequestT = z.infer<typeof GetHostelsRequest>;
export const GetHostelsResponse = z.object({
    hostels: z.array(z.object({
        id: z.string(),
        name: z.string(),
        floors: z.number(),
        blocks: z.number(),
        rooms: z.number(),
        seats: z.number(),
    })),
    total: z.number(),
});
export type GetHostelsResponseT = z.infer<typeof GetHostelsResponse>;


export const GetBlocksRequest = z.object({
    hostelId: z.string().optional(),
    search: z.string().optional(),
    page: z.number().min(1).default(1),
    pageSize: z.number().min(1).max(100).default(10),
});
export type GetBlocksRequestT = z.infer<typeof GetBlocksRequest>;
export const GetBlocksResponse = z.object({
    blocks: z.array(z.object({
        id: z.string(),
        name: z.string(),
        building: z.object({
            id: z.string(),
            name: z.string(),
        }),
        floors: z.number(),
        rooms: z.number(),
        seats: z.number(),
    })),
    total: z.number(),
});
export type GetBlocksResponseT = z.infer<typeof GetBlocksResponse>;


export const GetFloorsRequest = z.object({
    hostelId: z.string().optional(),
    blockId: z.string().optional(),
    search: z.string().optional(),
    page: z.number().min(1).default(1),
    pageSize: z.number().min(1).max(100).default(10),
});
export type GetFloorsRequestT = z.infer<typeof GetFloorsRequest>;
export const GetFloorsResponse = z.object({
    floors: z.array(z.object({
        id: z.string(),
        number: z.string(),
        block: z.object({
            id: z.string(),
            name: z.string(),
        }),
        hostel: z.object({
            id: z.string(),
            name: z.string(),
        }),
        rooms: z.number(),
        seats: z.number(),
    })),
    total: z.number(),
});
export type GetFloorsResponseT = z.infer<typeof GetFloorsResponse>;


export const GetRoomsRequest = z.object({
    hostelId: z.string().optional(),
    blockId: z.string().optional(),
    floorId: z.string().optional(),
    search: z.string().optional(),
    page: z.number().min(1).default(1),
    pageSize: z.number().min(1).max(100).default(10),
});
export type GetRoomsRequestT = z.infer<typeof GetRoomsRequest>;
export const GetRoomsResponse = z.object({
    rooms: z.array(z.object({
        id: z.string(),
        roomNo: z.string(),
        floor: z.object({
            id: z.string(),
            number: z.string(),
        }),
        block: z.object({
            id: z.string(),
            name: z.string(),
        }),
        hostel: z.object({
            id: z.string(),
            name: z.string(),
        }),
        seats: z.number(),
    })),
    total: z.number(),
});
export type GetRoomsResponseT = z.infer<typeof GetRoomsResponse>;

export const GetSeatsRequest = z.object({
    hostelId: z.string().optional(),
    blockId: z.string().optional(),
    floorId: z.string().optional(),
    roomId: z.string().optional(),
    search: z.string().optional(),
    page: z.number().min(1).default(1),
    pageSize: z.number().min(1).max(100).default(10),
    unoccupiedOnly: z.boolean().optional().default(false),
});
export type GetSeatsRequestT = z.infer<typeof GetSeatsRequest>;
export const GetSeatsResponse = z.object({
    seats: z.array(z.object({
        id: z.string(),
        number: z.string(),
        room: z.object({
            id: z.string(),
            roomNo: z.string(),
        }),
        floor: z.object({
            id: z.string(),
            number: z.string(),
        }),
        block: z.object({
            id: z.string(),
            name: z.string(),
        }),
        hostel: z.object({
            id: z.string(),
            name: z.string(),
        }),
    })),
    total: z.number(),
});
export type GetSeatsResponseT = z.infer<typeof GetSeatsResponse>;