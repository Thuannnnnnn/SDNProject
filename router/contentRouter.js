import express from "express";
import {
  createContent,
  deleteContent,
  getContentById,
  updateContent,
} from "../controller/content/contentController.js";

const contentRouter = express.Router();

/**
 * @swagger
 * tags:
 *   name: Content
 *   description: Content management operations
 */

/**
 * @swagger
 * /api/content/createContent:
 *   post:
 *     tags: [Content]
 *     summary: Create new content
 *     description: Add new content to the course
 *     requestBody:
 *       description: Content object that needs to be added
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               contentName:
 *                 type: string
 *                 example: "Introduction to MongoDB"
 *               contentType:
 *                 type: string
 *                 enum: ["videos", "exams", "docs", "questions"]
 *                 example: "videos"
 *               contentRef:
 *                 type: string
 *                 example: "http://example.com/content"
 *               courseId:
 *                 type: string
 *                 example: "course123"
 *     responses:
 *       201:
 *         description: Content created successfully
 *       400:
 *         description: Error creating content
 *       404:
 *         description: Course not found
 */
contentRouter.post("/createContent", createContent);

/**
 * @swagger
 * /api/content/updateContent:
 *   put:
 *     tags: [Content]
 *     summary: Update content
 *     description: Update existing content in the course
 *     requestBody:
 *       description: Content object that needs to be updated
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               contentId:
 *                 type: string
 *                 example: "content123"
 *               contentName:
 *                 type: string
 *                 example: "Updated Content Name"
 *               contentType:
 *                 type: string
 *                 enum: ["videos", "exams", "docs", "questions"]
 *                 example: "docs"
 *               contentRef:
 *                 type: string
 *                 example: "http://example.com/updated-content"
 *               courseId:
 *                 type: string
 *                 example: "course123"
 *     responses:
 *       200:
 *         description: Content updated successfully
 *       400:
 *         description: Error updating content
 *       404:
 *         description: Content or course not found
 */
contentRouter.put("/updateContent", updateContent);

/**
 * @swagger
 * /api/content/getContentById/{contentId}:
 *   get:
 *     summary: Lấy nội dung theo ID
 *     tags: [Content]
 *     parameters:
 *       - in: path
 *         name: contentId
 *         required: true
 *         description: ID của nội dung
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Nội dung được lấy thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 content:
 *                   type: object
 *                   properties:
 *                     contentId:
 *                       type: string
 *                     contentName:
 *                       type: string
 *                     contentType:
 *                       type: string
 *                     contentRef:
 *                       type: object
 *                       properties:
 *                         _id:
 *                           type: string
 *       404:
 *         description: Nội dung không tìm thấy
 *       500:
 *         description: Lỗi server
 */
contentRouter.get("/getContentById/:contentId", getContentById);

/**
 * @swagger
 * /api/content/deleteContent:
 *   delete:
 *     tags: [Content]
 *     summary: Delete content
 *     description: Delete content from the course
 *     requestBody:
 *       description: Content object that needs to be deleted
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               contentId:
 *                 type: string
 *                 example: "content123"
 *               courseId:
 *                 type: string
 *                 example: "course123"
 *     responses:
 *       200:
 *         description: Content deleted successfully
 *       404:
 *         description: Content or course not found
 *       500:
 *         description: Error deleting content
 */
contentRouter.delete("/deleteContent", deleteContent);

export default contentRouter;
