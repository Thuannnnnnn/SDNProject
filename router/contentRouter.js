import express from "express";
import {
  createContent,
  deleteContent,
  getAllContent,
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
 *                 example: "Video"
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
 *     requestBody:
 *       description: Content object that needs to be updated
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               contentName:
 *                 type: string
 *                 example: "Updated Content Name"
 *               contentType:
 *                 type: string
 *                 example: "Updated Type"
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
 *         description: Content not found
 */
contentRouter.put("/updateContent", updateContent);

/**
 * @swagger
 * /api/content/getAllContent:
 *   get:
 *     tags: [Content]
 *     summary: Retrieve all contents
 *     responses:
 *       200:
 *         description: List of contents
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   contentName:
 *                     type: string
 *                     example: "Introduction to MongoDB"
 *                   contentType:
 *                     type: string
 *                     example: "Video"
 *                   contentRef:
 *                     type: string
 *                     example: "http://example.com/content"
 *                   courseId:
 *                     type: string
 *                     example: "course123"
 *       404:
 *         description: No contents found
 */
contentRouter.get("/getAllContent", getAllContent);

/**
 * @swagger
 * /api/content/deleteContent:
 *   delete:
 *     tags: [Content]
 *     summary: Delete content
 *     requestBody:
 *       description: Content ID to be deleted
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
 *         description: Content not found
 *       500:
 *         description: Error deleting content
 */
contentRouter.delete("/deleteContent", deleteContent);

export default contentRouter;
