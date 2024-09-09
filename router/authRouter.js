import {login, sendOtp, validateOtp, changePW} from "../controller/auth/authController.js";
import express from "express";

const authRouter = express.Router();

authRouter.post("/login/base", login);
authRouter.post("/fogot-password", sendOtp);
authRouter.post("/validate-otp", validateOtp);
authRouter.post("/change-password", changePW);

export default authRouter;