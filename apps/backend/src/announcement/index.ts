import { Router } from "express";
import { v1AnnouncementRouter } from "./v1";

const r = Router(); // /api/announcement/

r.use('/v1', v1AnnouncementRouter); // /api/announcement/v1/

export { r as announcementRouter };