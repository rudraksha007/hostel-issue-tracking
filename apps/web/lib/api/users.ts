import { APIResponseT, CreateUserRequestT, EditUserRequestT, GetUsersRequestT, GetUsersResponseT, makeResponse } from "@repo/shared/types/api";
import axios from "axios";
import { toast } from "react-toastify";
import { BackendBaseURL } from "./api";

const base = `${BackendBaseURL}/users/v1`;
const api = axios.create({
    baseURL: base,
    withCredentials: true,
    validateStatus: () => true,
});
async function getUsers(params: GetUsersRequestT): Promise<GetUsersResponseT['users'] | []>{
    try {
        const res = await api.post<APIResponseT<GetUsersResponseT>>('/get', params);
        if (!res.data.success) throw new Error(res.data.msg || "Failed to fetch users");
        return res.data.data.users;
    } catch (error: any) {
        console.error("Error fetching users:", error.message || error);
        toast.error(error.message || "An error occurred while fetching users");
        return [];
    }
}

async function createUser(data: CreateUserRequestT) {
    try {
        const res = await api.post<APIResponseT>(`/create`, data);
        if (!res.data.success) throw new Error(res.data.msg || "User creation failed");
        toast.success("User created successfully");
        return true;
    } catch (error: any) {
        toast.error(error.message || "An error occurred during user creation");
        return false;
    }
}

async function editUser(data: EditUserRequestT) {
    try {
        const res = await api.post<APIResponseT>(`/edit`, data);
        return res.data;
    } catch (err){
        return makeResponse(false, 500, "Failed to edit user");
    }
}

export const UsersAPI = {
    getUsers,
    createUser,
    editUser,
}