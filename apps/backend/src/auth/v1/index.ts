import { Router } from "express";
import { LoginController } from "./controllers/login";
import { CreateUserController, FirstAdmin } from "./controllers/create";
import { SignupController } from "./controllers/signup";
import { LogoutController } from "./controllers/logout";
import { GetSessionController } from "./controllers/session";

export const v1Router = Router(); // /api/auth/v1

v1Router.post("/login", LoginController);
v1Router.post("/create", CreateUserController);
v1Router.post("/signup", SignupController);
v1Router.post("/logout", LogoutController);
v1Router.get("/fa", FirstAdmin);
v1Router.get("/session", GetSessionController);