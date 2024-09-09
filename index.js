import express from 'express';
import cors from 'cors';
import connectDB from './config/connectDB.js';
import userRouter from './router/userRouter.js';
import authRouter from './router/authRouter.js';
import cookieParser from 'cookie-parser';
import authMiddleware from './middleware/authMiddleware.js';
const app = express();
const port = 8080;

app.use(cors());
app.use(express.json());
app.use(cookieParser());
connectDB();
app.get('/', (req, res) => {
  res.send('Hello World!');
});
app.use('/api/user', userRouter);
// app.get('/', (req, res) => {
//   res.send("Hello");
// });
app.use('/api/user', authMiddleware, userRouter);
app.use('/api/auth', authRouter);

app.listen(port, () => {
});
