import { Router } from "express";
import { v1UserRouter } from "./v1";

const r = Router(); // /api/users

r.use("/v1", v1UserRouter);

export { r as usersRouter };