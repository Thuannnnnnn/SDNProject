import {login, sendOtp, validateOtp, changePW} from "../controller/auth/authController.js";
import express from "express";

const authRouter = express.Router();

authRouter.post("/login/base", login);
authRouter.post("/fogot-password", sendOtpForgotPW);
authRouter.post("/validate-otp", validateOtp);
authRouter.post("/change-password", changePW);
authRouter.post("/register", register);
authRouter.post("/sendOtpRegister", sendOtpRegister);

export default authRouter;