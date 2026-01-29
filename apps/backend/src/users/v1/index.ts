import { Router } from "express";
import { GetUsersController } from "./controllers/get";
import { CreateUserController } from "@/auth/v1/controllers/create";

const r = Router(); // /api/users/v1
r.post("/get", GetUsersController);
r.post("/create", CreateUserController);


export { r as v1UserRouter };