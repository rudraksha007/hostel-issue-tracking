import { APIResponseT, GetSessionResponse, GetSessionResponseT, LoginRequestT, LoginServiceResult, SignupRequestT } from "@repo/shared/types/api";
import axios from "axios";
import { toast } from "react-toastify";

const base = 'http://localhost:3001/api/auth';
const api = axios.create({
    baseURL: base,
    withCredentials: true,
    validateStatus: () => true,
});

async function login(data: LoginRequestT) {
    try {
        const res = await api.post<APIResponseT<LoginServiceResult>>(`/v1/login`, data);
        if (!res.data.success) throw new Error(res.data.msg || "Login failed");
        toast.success("Login successful");
        localStorage.setItem("session-data", JSON.stringify(res.data.data.data));
        return res.data.data.data;
    } catch (error: any) {
        toast.error(error.message || "An error occurred during login");
        return null;
    }
}

async function logout() {
    try {
        const res = await api.post<APIResponseT>(`/v1/logout`);
        if (!res.data.success) throw new Error(res.data.msg || "Logout failed");
        toast.success("Logout successful");
    } catch (error: any) {
        toast.error(error.message || "An error occurred during logout");
    }
}

async function signup(data: SignupRequestT) {
    try {
        const res = await api.post<APIResponseT>(`/v1/signup`, data);
        if (!res.data.success) throw new Error(res.data.msg || "Signup failed");
        toast.success("Signup successful");
        return true;
    } catch (error: any) {
        toast.error(error.message || "An error occurred during signup");
        return false;
    }
}

async function getSessionUser() {
    try {
        const data = await GetSessionResponse.safeParseAsync(JSON.parse(localStorage.getItem("session-data") || "{}"));
        if (data.success) {
            // if more than 5 minutes have passed since refTime, refresh session data
            if (Date.now() - data.data.refTime < 5 * 60 * 1000) return data.data;
        }
        const res = await api.get<APIResponseT<GetSessionResponseT>>('/v1/session');
        if (!res.data.success) throw new Error(res.data.msg || "Failed to get session");
        localStorage.setItem("session-data", JSON.stringify(res.data.data));
        return res.data.data;
    } catch (error) {
        toast.error("An error occurred while fetching session data");   
        return null;
    }
}

export const AuthAPI = {
    login,
    logout,
    signup,
    getSessionUser
};