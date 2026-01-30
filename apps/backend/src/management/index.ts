import { Router } from "express";
import { v1ManagementRouter } from "./v1";

const r = Router(); // /api/management
r.use('/v1', v1ManagementRouter);

export {r as managementRouter};