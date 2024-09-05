import express from 'express';
import cors from 'cors';
import connectDB from './config/connectDB.js';
import userRouter from './router/userRouter.js';
const app = express();
const port = 6868;

app.use(cors());
app.use(express.json());
connectDB();

app.use('/api/user', userRouter);

app.listen(port, () => {
});
