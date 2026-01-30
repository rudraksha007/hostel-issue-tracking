import { Router, type NextFunction, type Request, type Response } from "express";
import { CreateBlockController, CreateBuildingController } from "./controllers/create";
import { AuthError } from "@repo/shared/errors";
import { getUser, handleAPIError } from "@repo/shared/server";
import { EditFloorController } from "./controllers/edit";

const r = Router(); // /api/management/v1
r.use(authorise); // Authorisation middleware for all routes below
r.put("/create/building", CreateBuildingController); // PUT /api/management/v1/create/building
r.put("/create/block", CreateBlockController); // PUT /api/management/v1/create/block
r.post("/edit/floor", EditFloorController); // POST /api/management/v1/edit/floor 
export { r as v1ManagementRouter };

async function authorise(req: Request, res: Response, next: NextFunction) {
    try {
        if (!req.sessionToken) throw new AuthError("Unauthorized");
        const user = await getUser(req.sessionToken, { id: true, userType: true });
        if (user.userType !== 'ADMIN') throw new AuthError("You are not authorized to perform this action");
        next();
    } catch (err) {
        handleAPIError(err, res);
    }
}