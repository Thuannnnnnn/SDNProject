import express from "express";
import {
  createOrUpdateExam,
  getExamByCourseId,
  getExamById,
  submitExam,
  getExamAttemptsByUser,
  getExamResultByUser,
  hasUserAttemptedExam,
  getExamAll
} from "../controller/exams/examsController.js";

const examRouter = express.Router();

/**
 * @swagger
 * tags:
 *   name: Exams
 *   description: Operations for managing exams
 */

/**
 * @swagger
 * /api/exams/createOrUpdate:
 *   post:
 *     summary: Create or update an exam
 *     tags: [Exams]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               courseId:
 *                 type: string
 *                 description: ID của khóa học
 *               userEmail:
 *                 type: string
 *                 description: Email của người dùng (admin)
 *               questionNumber:
 *                 type: number
 *                 description: Số lượng câu hỏi cho bài thi
 *     responses:
 *       201:
 *         description: Exam created/updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 *                 data:
 *                   type: object
 *       403:
 *         description: Only admins can create or update exams
 *       404:
 *         description: Course not found
 *       500:
 *         description: Internal server error
 */
examRouter.post("/createOrUpdate", createOrUpdateExam);

/**
 * @swagger
 * /api/exams/course/{courseId}:
 *   get:
 *     summary: Get exam details by course ID
 *     tags: [Exams]
 *     parameters:
 *       - in: path
 *         name: courseId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của khóa học
 *     responses:
 *       200:
 *         description: Exam details retrieved successfully
 *       404:
 *         description: Course or exam not found
 *       500:
 *         description: Internal server error
 */
examRouter.get("/course/:courseId", getExamByCourseId);

/**
 * @swagger
 * /api/exams/{examId}:
 *   get:
 *     summary: Get exam details by exam ID
 *     tags: [Exams]
 *     parameters:
 *       - in: path
 *         name: examId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của bài thi
 *     responses:
 *       200:
 *         description: Exam details retrieved successfully
 *       404:
 *         description: Exam not found
 *       500:
 *         description: Internal server error
 */
examRouter.get("/:examId", getExamById);

/**
 * @swagger
 * /api/exams/submit:
 *   post:
 *     summary: Submit exam attempt
 *     tags: [Exams]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               examId:
 *                 type: string
 *                 description: ID của bài thi
 *               userEmail:
 *                 type: string
 *                 description: Email của người dùng
 *               answers:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: Danh sách câu trả lời của người dùng
 *     responses:
 *       200:
 *         description: Exam submitted successfully
 *       404:
 *         description: Exam not found
 *       400:
 *         description: Number of answers does not match the number of questions
 *       500:
 *         description: Internal server error
 */
examRouter.post("/submit", submitExam);

/**
 * @swagger
 * /api/exams/user/{userEmail}/attempts:
 *   get:
 *     summary: Get all exam attempts by user
 *     tags: [Exams]
 *     parameters:
 *       - in: path
 *         name: userEmail
 *         required: true
 *         schema:
 *           type: string
 *         description: Email của người dùng
 *     responses:
 *       200:
 *         description: Exam attempts retrieved successfully
 *       404:
 *         description: No exam attempts found for this user
 *       500:
 *         description: Internal server error
 */
examRouter.get("/user/:userEmail/attempts", getExamAttemptsByUser);
examRouter.get("/result/:courseId/:userEmail", getExamResultByUser);
examRouter.get("/:examId/:userEmail/attempted", hasUserAttemptedExam);
examRouter.get("/resultAll/getAll", getExamAll);
export default examRouter;
