import { Router } from "express";
import { v1LnfRouter } from "./v1";

const r = Router(); // /api/lnf/

r.use("/v1", v1LnfRouter); // /api/lnf/v1

export { r as lnfRouter };