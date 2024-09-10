import {login, loginWithGoogle} from "../controller/auth/authController.js";
import express from "express";

const authRouter = express.Router();

authRouter.post("/login/base", login);
authRouter.post("/loginWithGoogle/base", loginWithGoogle);

export default authRouter;