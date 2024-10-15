import  {getAllUsers}  from "../controller/user/userController.js";
import express from "express";

const userRouter = express.Router();

userRouter.get('/getAllUser', getAllUsers);
export default userRouter;