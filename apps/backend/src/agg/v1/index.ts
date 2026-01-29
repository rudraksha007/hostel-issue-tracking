import { Router } from "express";
import { GetHostelsController } from "./controllers/hostels";
import { GetBlocksController } from "./controllers/blocks";
import { GetFloorsController } from "./controllers/floors";
import { GetRoomsController } from "./controllers/rooms";
import { GetSeatsController } from "./controllers/seats";

const r = Router(); // /api/agg/v1

r.post('/hostels', GetHostelsController);   // POST /api/agg/v1/hostels
r.post('/blocks', GetBlocksController);     // POST /api/agg/v1/blocks
r.post('/floors', GetFloorsController);     // POST /api/agg/v1/floors
r.post('/rooms', GetRoomsController);       // POST /api/agg/v1/rooms
r.post('/seats', GetSeatsController);       // POST /api/agg/v1/seats


export { r as v1AggRouter };