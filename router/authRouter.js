import {login, validateOtp, changePW, sendOtpForgotPW, register, sendOtpRegister, loginWithGoogle, changPWUser, loginAdmin} from "../controller/auth/authController.js";
import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";

const authRouter = express.Router();
/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Operations for jwt
 */


/**
 * @swagger
 * /api/auth/login/base:
 *   post:
 *     summary: User login with base credentials
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: User email
 *                 example: user@example.com
 *               password:
 *                 type: string
 *                 description: User password
 *                 example: password123
 *     responses:
 *       200:
 *         description: Successfully logged in
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                   description: Authentication token
 *                   example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *       401:
 *         description: Unauthorized, invalid credentials
 *       500:
 *         description: Internal server error
 */
authRouter.post("/login/base", login);
authRouter.post("/fogot-password", sendOtpForgotPW);
authRouter.post("/validate-otp", validateOtp);
authRouter.post("/change-password", changePW);
authRouter.post("/register", register);
authRouter.post("/sendOtpRegister", sendOtpRegister);
authRouter.post("/changPWUser",authMiddleware,changPWUser);


/**
 * @swagger
 * /api/auth/login/withGoogle:
 *   post:
 *     summary: User login with base credentials
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: User email
 *                 example: user@example.com
 *               name:
 *                 type: string
 *                 description: User password
 *                 example: password123
 *     responses:
 *       200:
 *         description: Successfully logged in
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                   description: Authentication token
 *                   example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *       401:
 *         description: Unauthorized, invalid credentials
 *       500:
 *         description: Internal server error
 */
authRouter.post("/login/withGoogle", loginWithGoogle);
/**
 * @swagger
 * /api/auth/login/admin:
 *   post:
 *     summary: User login with base credentials
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 description: username
 *                 example: admin@admin.admin
 *               name:
 *                 type: string
 *                 description: User password
 *                 example: admin
 *     responses:
 *       200:
 *         description: Successfully logged in
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                   description: Authentication token
 *                   example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *       401:
 *         description: Unauthorized, invalid credentials
 *       500:
 *         description: Internal server error
 */
authRouter.post("/login/admin", loginAdmin);
export default authRouter;