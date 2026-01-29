import { getUser } from "@repo/shared/server";
import { handleAPIError } from "@repo/shared/server";
import { CreateClaimRequest, CreateLostRequest, CreateReturnRequest, MarkOwnerRequest, PossesRequest, sendResponse } from "@repo/shared/types/api";
import type { Request, Response } from "express";
import { claimItem, createFoundItem, createLostItem, markOwner, possesItem, storeItem } from "../services/create";
import { AuthError } from "@repo/shared/errors";

export async function CreateLostController(req: Request, res: Response) {
    try {
        if (!req.sessionToken) throw new AuthError("No active session found");
        const user = await getUser(req.sessionToken, { id: true });
        const data = CreateLostRequest.parse(req.body);
        const r = await createLostItem(user.id, req.files || [], data);
        sendResponse(res, r);
    } catch (err) {
        handleAPIError(err, res);
    }
}

export async function CreateFoundController(req: Request, res: Response) {
    try {
        if (!req.sessionToken) throw new AuthError("No active session found");
        const user = await getUser(req.sessionToken, { id: true });
        const data = CreateLostRequest.parse(req.body);
        const r = await createFoundItem(user.id, req.files || [], data);
        sendResponse(res, r);
    } catch (err) {
        handleAPIError(err, res);
    }
}

export async function CreateStoreController(req: Request, res: Response) {
    try {
        if (!req.sessionToken) throw new AuthError("No active session found");
        const user = await getUser(req.sessionToken, { id: true, userType: true });
        if (user.userType !== 'WARDEN') throw new AuthError("Unauthorized to store items");
        const data = CreateReturnRequest.parse(req.body); // warden gives the otp to the person returning the item
        const r = await storeItem(user.id, user.id, data);
        sendResponse(res, r);
    } catch (err) {
        handleAPIError(err, res);
    }
}


export async function CreateClaimController(req: Request, res: Response) {
    try {
        if (!req.sessionToken) throw new AuthError("No active session found");
        const user = await getUser(req.sessionToken, { id: true });
        const data = CreateClaimRequest.parse(req.body); // warden gives the otp to the person returning the item
        const r = await claimItem(user.id, data);
        sendResponse(res, r);
    } catch (err) {
        handleAPIError(err, res);
    }
}

export async function MarkOwnerController(req: Request, res: Response) {
    try {
        if (!req.sessionToken) throw new AuthError("No active session found");
        const user = await getUser(req.sessionToken, { id: true, userType: true });
        if (user.userType !== 'WARDEN') throw new AuthError("Unauthorized to mark owners");
        const data = MarkOwnerRequest.parse(req.body);
        const r = await markOwner(data);
        sendResponse(res, r);
    } catch (err) {
        handleAPIError(err, res);
    }
}

export async function PossesController(req: Request, res: Response) {
    try {
        if (!req.sessionToken) throw new AuthError("No active session found");
        const user = await getUser(req.sessionToken, { id: true });
        const data = PossesRequest.parse(req.body);
        const r = await possesItem(user.id, data);
        sendResponse(res, r);
    } catch (err) {
        handleAPIError(err, res);
    }
}