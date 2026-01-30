import { Router } from "express";
import { GetUsersController } from "./controllers/get";
import { CreateUserController } from "@/auth/v1/controllers/create";
import { EditUserController } from "./controllers/edit";

const r = Router(); // /api/users/v1
r.post("/get", GetUsersController);
r.post("/create", CreateUserController);
r.post('/edit', EditUserController);

export { r as v1UserRouter };