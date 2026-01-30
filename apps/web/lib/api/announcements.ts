import { APIResponseT, AnnouncementRequestT, AnnouncementResponseT, GetAnnouncementsRequestT, GetAnnouncementsResponseT, makeResponse } from "@repo/shared/types/api";
import axios from "axios";
import { toast } from "react-toastify";
import { BackendBaseURL } from "./api";

const base = `${BackendBaseURL}/announcement/v1`;
const api = axios.create({
    baseURL: base,
    withCredentials: true,
    validateStatus: () => true,
});

async function createAnnouncement(data: AnnouncementRequestT, files?: File[]): Promise<boolean> {
    try {
        const formData = new FormData();
        formData.append('data', JSON.stringify(data));
        
        if (files) {
            files.forEach((file) => {
                formData.append('files', file);
            });
        }

        const res = await api.put<APIResponseT<AnnouncementResponseT>>('/create', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        
        if (!res.data.success) throw new Error(res.data.msg || "Failed to create announcement");
        toast.success("Announcement created successfully");
        return true;
    } catch (error: any) {
        console.error("Error creating announcement:", error.message || error);
        toast.error(error.message || "An error occurred while creating announcement");
        return false;
    }
}

async function getAnnouncements(data: GetAnnouncementsRequestT): Promise<APIResponseT<GetAnnouncementsResponseT>> {
    try {
        const res = await api.post<APIResponseT<GetAnnouncementsResponseT>>('/get', data);
        return res.data;
    } catch (error) {
        return makeResponse(false, 500, "Failed to fetch announcements");
    }
}

export const AnnouncementsAPI = {
    createAnnouncement,
    getAnnouncements,
};