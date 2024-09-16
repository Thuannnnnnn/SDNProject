import express from "express";
import * as quizz from '../controller/quizz/quizzController.js';

export const quizzRouter = express.Router();

quizzRouter.get("/questions", quizz.getQuestions);

quizzRouter.post("/questions", quizz.insertquestions);

quizzRouter.delete("/questions", quizz.dropquestion);

quizzRouter.get("/result",quizz.getResult)

quizzRouter.post("/result", quizz.storeResult)

quizzRouter.delete("/result", quizz.dropresult)