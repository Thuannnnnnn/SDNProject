import express from "express";
import cors from "cors";
import connectDB from "./config/connectDB.js";
import authRouter from "./router/authRouter.js";
import uploadRouter from "./router/uploadRouter.js";
import cookieParser from "cookie-parser";
import authMiddleware from "./middleware/authMiddleware.js";
import { quizzRouter } from "./router/quizzRouter.js";
import { specs, swaggerUi } from "./config/swagger.js";
import courseRouter from "./router/courseRouter.js";
import morgan from "morgan";
import contentRouter from "./router/contentRouter.js";
import examRouter from "./router/examRouter.js";
import cartRouter from "./router/cartRouter.js";
import coursePurchasedrouter from "./router/coursePurchased.js";
import payMentrouter from "./router/paymentRouter.js";
const app = express();
const port = 3030;

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));
app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(morgan("combined"));
connectDB();
app.get("/", (req, res) => {
  res.send("Hello World!");
});
app.use("/api/course", authMiddleware, courseRouter);
app.use("/api/content",authMiddleware, contentRouter);
app.use("/api/cart", cartRouter);
app.use("/api/auth", authRouter);
app.use("/api/quizz",authMiddleware, quizzRouter);
app.use("/api/upload",authMiddleware, uploadRouter);
app.use("/api/exam",authMiddleware, examRouter);
app.use("/api/coursePurchased",authMiddleware, coursePurchasedrouter);
app.use("/api/payment",authMiddleware, payMentrouter);
app.get("/", (req, res) => {
  res.send("Hello, Swagger!");
});

app.listen(port, () => {});
