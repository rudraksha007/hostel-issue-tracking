import { Router } from "express";
import { CreateIssueController } from "./controllers/create";
import { EditIssueController } from "./controllers/edit";
import { ReactController } from "./controllers/react";
import { CommentController } from "./controllers/comment";
import { GetIssueController, GetIssuesController } from "./controllers/get";
import { IssueFileController } from "./controllers/file";

const r = Router(); // /api/issues/v1/

r.put("/create", CreateIssueController);    // PUT  /api/issues/v1/create
r.post("/edit", EditIssueController);       // POST /api/issues/v1/edit
r.post("/react", ReactController);          // POST /api/issues/v1/react
r.put("/comment", CommentController);       // PUT  /api/issues/v1/comment
r.post("/get", GetIssuesController);        // POST /api/issues/v1/get
r.get("/get/:id", GetIssueController);      // GET  /api/issues/v1/get/:id
r.get("/file", IssueFileController);        // GET  /api/issues/v1/file

export { r as v1IssuesRouter };