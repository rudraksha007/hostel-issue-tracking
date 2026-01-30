import { APIResponseT, CreateBlockRequestT, CreateHostelRequestT, EditFloorRequestT } from "@repo/shared/types/api";
import axios from "axios";
import { BackendBaseURL } from "./api";
import { PlaceType } from "@repo/db/browser";

const api = axios.create({
    baseURL: `${BackendBaseURL}/management`,
    withCredentials: true,
    validateStatus: () => true,
});

async function createHostel(data: CreateHostelRequestT): Promise<APIResponseT> {
    try {
        const res = await api.put<APIResponseT>(`/v1/create/building`, data);
        return res.data;
    } catch (error) {
        return { success: false, statusCode: 500, msg: "An error occurred while creating hostel", data: null };
    }
}

export type AddBlockFormData = {
    name: string;
    type: PlaceType;
    populate?: {
        floors: number;
        roomsPerFloor: number;
        capacityPerRoom: number;
    }
}

async function createBlock(hostelId: string, data: AddBlockFormData): Promise<APIResponseT> {
    try {
        const res = await api.put<APIResponseT>(`/v1/create/block`, { hostelId, ...data } as CreateBlockRequestT);
        return res.data;
    } catch (error) {
        return { success: false, statusCode: 500, msg: "An error occurred while creating block", data: null };
    }
}

async function editFloor(data: EditFloorRequestT): Promise<APIResponseT> {
    try {
        const res = await api.post<APIResponseT>(`/v1/edit/floor`, data);
        return res.data;
    } catch (error) {
        return { success: false, statusCode: 500, msg: "An error occurred while editing floor", data: null };
    }
}

export const ManagementAPI = {
    createHostel,
    createBlock,
    editFloor,
}