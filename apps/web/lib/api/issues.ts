import axios from "axios";
import { BackendBaseURL } from "./api";
import { APIResponseT, CreateIssueRequestT, GetIssuesRequestT, GetIssuesResponseT, makeResponse } from "@repo/shared/types/api";

const api = axios.create({
    baseURL: `${BackendBaseURL}/issues`,
    withCredentials: true,
    validateStatus: () => true
});

async function getIssues(cfg: Partial<GetIssuesRequestT>): Promise<APIResponseT<GetIssuesResponseT>> {
    try {
        const res = await api.post<APIResponseT<GetIssuesResponseT>>('/v1/get', cfg);
        return res.data;
    } catch (error) {
        return makeResponse(false, 500, "Failed to fetch issues");
    }
}

async function createIssue(data: CreateIssueRequestT, images: File[]): Promise<APIResponseT> {
    try {
        const formData = new FormData();
        formData.append('data', JSON.stringify(data));
        images.forEach((img) => {
            formData.append('images', img);
        });
        const res = await api.put<APIResponseT>('/v1/create', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            }
        });
        return res.data;
    } catch (error) {
        return makeResponse(false, 500, "Failed to create issue");
    }
}

export const IssuesAPI = {
    getIssues,
    createIssue,
}