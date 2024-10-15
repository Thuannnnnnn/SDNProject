import express from "express";
import {
  createProcessForUser,
  deleteProcess,
  getProcessByCourseIdAndEmail,
  getProcessByEmail,
  updateProcessContent,
} from "../controller/processStudy/processController.js";

const processRouter = express.Router();

/**
 * @swagger
 * tags:
 *   name: Process
 *   description: Operations for managing user processes
 */
/**
 * @swagger
 * /api/process/course/{courseId}/email/{email}:
 *   get:
 *     summary: Lấy thông tin process theo courseId và email
 *     tags: [Process]
 *     parameters:
 *       - in: path
 *         name: courseId
 *         schema:
 *           type: string
 *         required: true
 *         description: ID của khóa học
 *       - in: path
 *         name: email
 *         schema:
 *           type: string
 *         required: true
 *         description: Email của người dùng
 *     responses:
 *       200:
 *         description: Lấy thông tin process thành công
 *       404:
 *         description: Process không tồn tại
 *       500:
 *         description: Lỗi hệ thống
 */
processRouter.get("/course/:courseId/email/:email", getProcessByCourseIdAndEmail);

processRouter.get("/email/:email", getProcessByEmail);

/**
 * @swagger
 * /api/process/create:
 *   post:
 *     summary: Create a learning process for a user
 *     tags: [Process]
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
 *                 example: "abc123"
 *               userEmail:
 *                 type: string
 *                 description: Email của người dùng
 *                 example: "user@example.com"
 *     responses:
 *       201:
 *         description: Process created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Tạo process thành công."
 *                 data:
 *                   type: object
 *       500:
 *         description: Internal server error
 */
processRouter.post("/create", createProcessForUser);

/**
 * @swagger
 * /api/process/update/{processId}:
 *   patch:
 *     summary: Update the completion status of a specific content in a process
 *     tags: [Process]
 *     parameters:
 *       - in: path
 *         name: processId
 *         schema:
 *           type: string
 *         required: true
 *         description: ID của process cần cập nhật
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               contentId:
 *                 type: string
 *                 description: ID của nội dung cần cập nhật
 *                 example: "content123"
 *               isComplete:
 *                 type: boolean
 *                 description: Trạng thái hoàn thành
 *                 example: true
 *     responses:
 *       200:
 *         description: Process updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Cập nhật tiến trình học thành công."
 *                 data:
 *                   type: object
 *       404:
 *         description: Process or content not found
 *       500:
 *         description: Internal server error
 */
processRouter.patch("/update/:processId", updateProcessContent);

/**
 * @swagger
 * /api/process/delete/{processId}:
 *   delete:
 *     summary: Delete a process
 *     tags: [Process]
 *     parameters:
 *       - in: path
 *         name: processId
 *         schema:
 *           type: string
 *         required: true
 *         description: ID của process cần xóa
 *     responses:
 *       200:
 *         description: Process deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Xóa process thành công."
 *                 data:
 *                   type: object
 *       404:
 *         description: Process not found
 *       500:
 *         description: Internal server error
 */
processRouter.delete("/delete/:processId", deleteProcess);

export default processRouter;
