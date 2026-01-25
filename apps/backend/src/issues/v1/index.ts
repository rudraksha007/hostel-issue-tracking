import { Router } from "express";
import { CreateIssueController } from "./controllers/create";

export const v1IssueRouter = Router(); // /api/issues/v1/

v1IssueRouter.put("/create", CreateIssueController); // PUT /api/issues/v1/create