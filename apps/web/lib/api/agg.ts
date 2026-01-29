import { APIResponseT, GetBlocksRequestT, GetBlocksResponseT, GetFloorsRequestT, GetFloorsResponseT, GetHostelsRequestT, GetHostelsResponseT, GetRoomsRequestT, GetRoomsResponseT, GetSeatsRequestT, GetSeatsResponseT } from "@repo/shared/types/api";
import axios from "axios";
import { toast } from "react-toastify";

const base = 'http://localhost:3001/api/agg/v1';
const api = axios.create({
    baseURL: base,
    withCredentials: true,
    validateStatus: () => true,
});

// type HostelData = {
//     id: string;
//     name: string;
//     blocks: {
//         id: string;
//         name: string;
//         floors: {
//             id: string;
//             number: string;
//             rooms: {
//                 id: string;
//                 roomNo: string;
//                 seats: {
//                     id: string;
//                     seatNo: string;
//                 }
//             }[]
//         }[]
//     }[];
// }

async function getHostels(req: GetHostelsRequestT): Promise<GetHostelsResponseT['hostels'] | []> {
    try {
        const res = await api.post<APIResponseT<GetHostelsResponseT>>('/hostels', req);
        if (!res.data.success) throw new Error(res.data.msg || "Failed to fetch hostels");
        return res.data.data.hostels;
    } catch (error) {
        toast.error("An error occurred while fetching hostels");
        return [];
    }
}

async function getBlocks(hostelId: string) {
    try {
        const req: GetBlocksRequestT = {
            hostelId,
            page: 1,
            pageSize: 100,
        }
        const res = await api.post<APIResponseT<GetBlocksResponseT>>('/blocks', req);
        if (!res.data.success) throw new Error(res.data.msg || "Failed to fetch blocks");
        return res.data.data.blocks;
    } catch (err) {
        toast.error("An error occurred while fetching blocks");
        return [];
    }
}

async function getFloors(blockId: string) {
    try {
        const req: GetFloorsRequestT = {
            blockId,
            page: 1,
            pageSize: 100,
        }
        const res = await api.post<APIResponseT<GetFloorsResponseT>>('/floors', req);
        if (!res.data.success) throw new Error(res.data.msg || "Failed to fetch floors");
        return res.data.data.floors;
    } catch (err) {
        toast.error("An error occurred while fetching floors");
        return [];
    }
}

async function getRooms(floorId: string) {
    try {
        const req: GetRoomsRequestT = {
            floorId,
            page: 1,
            pageSize: 100,
        }
        const res = await api.post<APIResponseT<GetRoomsResponseT>>('/rooms', req);
        if (!res.data.success) throw new Error(res.data.msg || "Failed to fetch rooms");
        return res.data.data.rooms;
    } catch (err) {
        toast.error("An error occurred while fetching rooms");
        return [];
    }
}

async function getSeats(roomId: string) {
    try {
        const req: GetSeatsRequestT = {
            roomId, page: 1, pageSize: 100, unoccupiedOnly: true
        }
        const res = await api.post<APIResponseT<GetSeatsResponseT>>('/seats', req);
        if (!res.data.success) throw new Error(res.data.msg || "Failed to fetch seats");
        return res.data.data.seats;
    } catch (err) {
        toast.error("An error occurred while fetching seats");
        return [];
    }
}

export const AggAPI = {
    getHostels,
    getBlocks,
    getFloors,
    getRooms,
    getSeats
}