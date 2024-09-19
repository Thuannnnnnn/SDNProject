import express from 'express';
import { createCourse, deleteCourse, getAllCourse, updatedCourse } from '../controller/course/courseController.js';

const courseRouter = express.Router();

/**
 * @swagger
 * tags:
 *   name: Courses
 *   description: Course management operations
 */

/**
 * @swagger
 * /api/course/createCourse:
 *   post:
 *     tags: [Courses]
 *     summary: Create a new course
 *     description: Create a new course by providing the necessary data.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               courseName:
 *                 type: string
 *                 example: Introduction to Programming
 *               docLink:
 *                 type: string
 *                 example: http://example.com/document.pdf
 *               posterLink:
 *                 type: string
 *                 example: http://example.com/poster.png
 *               userGenerated:
 *                 type: string
 *                 example: "64e78961234a567bc9def012"
 *               price:
 *                 type: number
 *                 example: 99.99
 *               category:
 *                 type: string
 *                 example: Technology
 *     responses:
 *       201:
 *         description: Course created successfully
 *       400:
 *         description: Missing required fields
 *       500:
 *         description: Internal server error
 */
courseRouter.post('/createCourse', createCourse);


/**
 * @swagger
 * /api/course/updateCourse:
 *   put:
 *     tags: [Courses]
 *     summary: Update an existing course
 *     description: Update a course by providing its courseId and updated data.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               courseId:
 *                 type: string
 *                 example: 64e78961234a567bc9def012
 *               courseName:
 *                 type: string
 *                 example: Updated Course Name
 *               docLink:
 *                 type: string
 *                 example: http://example.com/updated-doc.pdf
 *               posterLink:
 *                 type: string
 *                 example: http://example.com/updated-poster.png
 *               userGenerated:
 *                 type: string
 *                 example: 64e78961234a567bc9def012
 *               price:
 *                 type: number
 *                 example: 79.99
 *               category:
 *                 type: string
 *                 example: Information Technology
 *     responses:
 *       200:
 *         description: Course updated successfully
 *       400:
 *         description: Missing required fields
 *       404:
 *         description: Course not found
 *       500:
 *         description: Internal server error
 */
courseRouter.put('/updateCourse', updatedCourse);

/**
 * @swagger
 * /api/course/getAll:
 *   get:
 *     tags: [Courses]
 *     summary: Get all courses
 *     description: Retrieve a list of all courses.
 *     responses:
 *       200:
 *         description: Successfully retrieved all courses
 *       404:
 *         description: No courses found
 *       500:
 *         description: Internal server error
 */
courseRouter.get('/getAll', getAllCourse);

/**
 * @swagger
 * /api/course/detele:
 *   delete:
 *     tags: [Courses]
 *     summary: Delete a course
 *     description: Delete a course by providing its courseId.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               courseId:
 *                 type: string
 *                 example: 64e78961234a567bc9def012
 *     responses:
 *       200:
 *         description: Course deleted successfully
 *       404:
 *         description: Course not found
 *       500:
 *         description: Internal server error
 */
courseRouter.delete('/delete/:courseId', deleteCourse);

export default courseRouter;
