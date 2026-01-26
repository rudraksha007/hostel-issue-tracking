import { Router } from "express";
import { AnnounceController } from "./controllers/create";
import { AnnFileController } from "./controllers/file";

const r = Router(); // /api/announcement/v1/

r.put('/create', AnnounceController); // PUT /api/announcement/v1/create
r.get("/file", AnnFileController); // GET /api/announcement/v1/file

export { r as v1AnnouncementRouter };