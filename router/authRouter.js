import {login} from "../controller/auth/authController.js";
import express from "express";

const authRouter = express.Router();

authRouter.post("/login/base", login);

export default authRouter;