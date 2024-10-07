import express from "express";
import * as quizz from '../controller/quizz/quizzController.js';
import multer from 'multer';




export const quizzRouter = express.Router();

quizzRouter.get("/questions", quizz.getQuestions);

quizzRouter.post("/questions", quizz.addQuestions);

quizzRouter.delete("/questions", quizz.dropQuestions);

quizzRouter.get("/result",quizz.getResult);

quizzRouter.post("/result", quizz.storeResult);

quizzRouter.delete("/result", quizz.dropResults);

const storage = multer.memoryStorage();
const upload = multer({ storage });

quizzRouter.post('/upload', upload.single('file'), quizz.importQuestions);