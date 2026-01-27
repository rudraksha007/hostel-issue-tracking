import { Router } from "express";
import * as c from "./controllers/create";

const r = Router(); // /api/lnf/v1

r.put("/create/lost", c.CreateLostController);    // PUT  /api/lnf/v1/create/lost
r.put("/create/found", c.CreateFoundController);  // PUT  /api/lnf/v1/create/found
r.post("/store", c.CreateStoreController);         // POST /api/lnf/v1/store
r.post("/claim", c.CreateClaimController);    // POST /api/lnf/v1/claim
r.post("/mark", c.MarkOwnerController);         // POST /api/lnf/v1/mark
r.post("/posses", c.PossesController);         // POST /api/lnf/v1/posses

export { r as v1LnfRouter };