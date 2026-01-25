import { Router } from "express";
import { v1IssueRouter } from "./v1";

export const issueRouter = Router(); // /api/issues

issueRouter.use("/v1", v1IssueRouter);