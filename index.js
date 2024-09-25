import express from "express";
import cors from "cors";
import connectDB from "./config/connectDB.js";
import authRouter from "./router/authRouter.js";
import uploadRouter from "./router/uploadRouter.js";
import cookieParser from "cookie-parser";
//import authMiddleware from "./middleware/authMiddleware.js";
import { quizzRouter } from "./router/quizzRouter.js";
import { specs, swaggerUi } from "./config/swagger.js";
import courseRouter from "./router/courseRouter.js";
import morgan from "morgan";
import contentRouter from "./router/contentRouter.js";
import examRouter from "./router/examRouter.js"; // Import examRouter
import cartRouter from "./router/cartRouter.js";
const app = express();
const port = 8080;

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));
app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:3000",
    methods: ["GET", "POST", "PUT", "DELETE"],
  })
);
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(morgan("combined"));
connectDB();
app.get("/", (req, res) => {
  res.send("Hello World!");
});
// app.get('/', (req, res) => {
//   res.send("Hello");
// });
app.use("/api/course", courseRouter);
app.use("/api/content",contentRouter);
app.use("/api/cart", cartRouter);
app.use("/api/auth", authRouter);
app.use("/api/quizz", quizzRouter);
app.use("/api/upload", uploadRouter);
app.use("/api/exam", examRouter); // Tích hợp examRouter
app.get("/", (req, res) => {
  res.send("Hello, Swagger!");
});

app.listen(port, () => {});
