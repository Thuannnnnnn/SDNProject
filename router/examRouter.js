import express from "express";
import {
  getAllExams,
  createExam,
  deleteExam,
  updateExam,
} from "../controller/exam/examController.js";

const examRouter = express.Router();

/**
 * @swagger
 * tags:
 *   name: Exams
 *   description: Exam management operations
 */

/**
 * @swagger
 * /api/exam/create:
 *   post:
 *     tags: [Exams]
 *     summary: Create a new exam
 *     description: Create a new exam by providing examId, courseId, and content.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               examId:
 *                 type: string
 *                 example: exam_123
 *               courseId:
 *                 type: string
 *                 example: course_456
 *               content:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     questionText:
 *                       type: string
 *                       example: What is the capital of France?
 *                     answers:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           answerText:
 *                             type: string
 *                             example: Paris
 *                           isCorrect:
 *                             type: boolean
 *                             example: true
 *     responses:
 *       201:
 *         description: Exam created successfully
 *       400:
 *         description: Missing required fields or invalid data
 *       500:
 *         description: Internal server error
 */
examRouter.post("/create", createExam);

/**
 * @swagger
 * /api/exam/getAll:
 *   get:
 *     tags: [Exams]
 *     summary: Get all exams
 *     description: Retrieve a list of all exams.
 *     responses:
 *       200:
 *         description: Successfully retrieved all exams
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   examId:
 *                     type: string
 *                     example: exam_123
 *                   courseId:
 *                     type: string
 *                     example: course_456
 *                   content:
 *                     type: array
 *                     items:
 *                       type: object
 *                       properties:
 *                         questionText:
 *                           type: string
 *                           example: What is the capital of France?
 *                         answers:
 *                           type: array
 *                           items:
 *                             type: object
 *                             properties:
 *                               answerText:
 *                                 type: string
 *                                 example: Paris
 *                               isCorrect:
 *                                 type: boolean
 *                                 example: true
 *       500:
 *         description: Internal server error
 */
examRouter.get("/getAll", getAllExams);

/**
 * @swagger
 * /api/exam/update:
 *   put:
 *     tags: [Exams]
 *     summary: Update an existing exam
 *     description: Update the content of an existing exam by providing the examId and updated content.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               examId:
 *                 type: string
 *                 example: exam_123
 *               content:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     questionText:
 *                       type: string
 *                       example: What is the capital of France?
 *                     answers:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           answerText:
 *                             type: string
 *                             example: Paris
 *                           isCorrect:
 *                             type: boolean
 *                             example: true
 *     responses:
 *       200:
 *         description: Exam updated successfully
 *       400:
 *         description: Missing required fields or invalid data
 *       404:
 *         description: Exam not found
 *       500:
 *         description: Internal server error
 */
examRouter.put("/update", updateExam);

/**
 * @swagger
 * /api/exam/delete:
 *   delete:
 *     tags: [Exams]
 *     summary: Delete an exam
 *     description: Delete an exam by providing its examId.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               examId:
 *                 type: string
 *                 example: exam_123
 *     responses:
 *       200:
 *         description: Exam deleted successfully
 *       404:
 *         description: Exam not found
 *       500:
 *         description: Internal server error
 */
examRouter.delete("/delete", deleteExam);

export default examRouter;
