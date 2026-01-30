import { APIResponseT, GetBlocksRequestT, GetBlocksResponseT, GetFloorsRequestT, GetFloorsResponseT, GetHostelsRequestT, GetHostelsResponseT, GetRoomsRequestT, GetRoomsResponseT, GetSeatsRequestT, GetSeatsResponseT } from "@repo/shared/types/api";
import axios from "axios";
import { toast } from "react-toastify";

const base = `${BackendBaseURL}/agg`;
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
        const res = await api.post<APIResponseT<GetHostelsResponseT>>('/v1/hostels', req);
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
        const res = await api.post<APIResponseT<GetBlocksResponseT>>('/v1/blocks', req);
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
        const res = await api.post<APIResponseT<GetFloorsResponseT>>('/v1/floors', req);
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
        const res = await api.post<APIResponseT<GetRoomsResponseT>>('/v1/rooms', req);
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
        const res = await api.post<APIResponseT<GetSeatsResponseT>>('/v1/seats', req);
        if (!res.data.success) throw new Error(res.data.msg || "Failed to fetch seats");
        return res.data.data.seats;
    } catch (err) {
        toast.error("An error occurred while fetching seats");
        return [];
    }
}

import type { HostelData, Block, Floor, Room } from '../types';
import { BackendBaseURL } from "./api";

type FetchDataType = 'hostels' | 'blocks' | 'floors' | 'rooms' | 'seats';

interface FetchHierarchicalDataParams {
    type: FetchDataType;
    hostelData: HostelData;
    currentSelection: {
        hostel?: string;
        block?: string;
        floor?: string;
        room?: string;
    };
}

/**
 * Fetches hierarchical hostel data (hostels -> blocks -> floors -> rooms -> seats)
 * and merges it into the existing hostel data structure
 */
async function fetchHierarchicalData({
    type,
    hostelData,
    currentSelection
}: FetchHierarchicalDataParams): Promise<HostelData> {
    try {
        const updated = { ...hostelData };

        switch (type) {
            case 'hostels': {
                const data = await getHostels({ page: 1, pageSize: 1000 });
                data.forEach(h => {
                    updated[h.id] = { id: h.id, name: h.name };
                });
                break;
            }
            case 'blocks': {
                if (!currentSelection.hostel) return hostelData;
                const data = await getBlocks(currentSelection.hostel);
                const blockMap: Record<string, Block> = {};
                data.forEach(b => {
                    blockMap[b.id] = { id: b.id, name: b.name };
                });
                if (updated[currentSelection.hostel]) {
                    updated[currentSelection.hostel].blocks = {
                        ...updated[currentSelection.hostel].blocks,
                        ...blockMap
                    };
                }
                break;
            }
            case 'floors': {
                if (!currentSelection.block || !currentSelection.hostel) return hostelData;
                const data = await getFloors(currentSelection.block);
                const floorMap: Record<string, Floor> = {};
                data.forEach(f => {
                    floorMap[f.id] = { id: f.id, number: f.number };
                });
                const hostel = updated[currentSelection.hostel];
                if (hostel?.blocks?.[currentSelection.block]) {
                    hostel.blocks[currentSelection.block].floors = {
                        ...hostel.blocks[currentSelection.block].floors,
                        ...floorMap
                    };
                }
                break;
            }
            case 'rooms': {
                if (!currentSelection.floor || !currentSelection.block || !currentSelection.hostel) {
                    return hostelData;
                }
                const data = await getRooms(currentSelection.floor);
                const roomMap: Record<string, Room> = {};
                data.forEach(r => {
                    roomMap[r.id] = { id: r.id, roomNo: r.roomNo };
                });
                const hostel = updated[currentSelection.hostel];
                const block = hostel?.blocks?.[currentSelection.block];
                const floor = block?.floors?.[currentSelection.floor];
                if (floor) {
                    floor.rooms = { ...floor.rooms, ...roomMap };
                }
                break;
            }
            case 'seats': {
                if (!currentSelection.room || !currentSelection.floor || !currentSelection.block || !currentSelection.hostel) {
                    return hostelData;
                }
                const data = await getSeats(currentSelection.room);
                const seatMap: Record<string, { id: string; seatNo: string }> = {};
                data.forEach(s => {
                    seatMap[s.id] = { id: s.id, seatNo: s.number };
                });
                const hostel = updated[currentSelection.hostel];
                const block = hostel?.blocks?.[currentSelection.block];
                const floor = block?.floors?.[currentSelection.floor];
                const room = floor?.rooms?.[currentSelection.room];
                if (room) {
                    room.seats = { ...room.seats, ...seatMap };
                }
                break;
            }
        }

        return updated;
    } catch (err) {
        console.error(`Error fetching ${type}:`, err);
        return hostelData;
    }
}

export const AggAPI = {
    getHostels,
    getBlocks,
    getFloors,
    getRooms,
    getSeats,
    fetchHierarchicalData
}