// modules/user/userRoutes.mjs
import express from 'express';
import { findUserByEmail, createUser } from '../controller/userController.js';

const userRouter = express.Router();

userRouter.get('/email/:email', findUserByEmail);
userRouter.post('/users', createUser);


export default userRouter;
