import { Router } from "express";
import { v1Router } from "./v1";

export const authRouter = Router(); // /api/auth

authRouter.use("/v1", v1Router); 