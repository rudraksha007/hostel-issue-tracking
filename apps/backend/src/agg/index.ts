import { Router } from "express";
import { v1AggRouter } from "./v1";

const r = Router(); // /api/agg
r.use('/v1', v1AggRouter);
export { r as aggRouter };