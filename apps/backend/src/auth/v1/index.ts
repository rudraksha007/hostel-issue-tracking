import { Router } from "express";
import { LoginController } from "./controllers/login";
import { CreateUserController } from "./controllers/create";
import { SignupController } from "./controllers/signup";
import { LogoutController } from "./controllers/logout";

export const v1Router = Router(); // /api/auth/v1

v1Router.post("/login", LoginController);
v1Router.post("/create", CreateUserController);
v1Router.post("/signup", SignupController);
v1Router.post("/logout", LogoutController);