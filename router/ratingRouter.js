import express from 'express';
import { createRating, getAverageRatingForCourse, hasUserProvidedFeedbackAndRating, getRatingByUserEmail, getRatingsCountByType, updateRating } from '../controller/rating/feedbackandRatingController.js';
import authMiddleware from '../middleware/authMiddleware.js';

const ratingRouter = express.Router();

/**
 * @swagger
 * /api/rating:
 *   post:
 *     summary: Create a new rating
 *     tags: [Rating]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userEmail:
 *                 type: string
 *               ratingPoint:
 *                 type: number
 *                 minimum: 1
 *                 maximum: 5
 *               courseId:
 *                 type: string
 *               feedback:
 *                 type: string
 *     responses:
 *       201:
 *         description: Rating created successfully
 *       400:
 *         description: Invalid input
 *       500:
 *         description: Internal server error
 */
ratingRouter.post('/', authMiddleware, createRating);

/**
 * @swagger
 * /api/rating/course/{courseId}/average:
 *   get:
 *     summary: Get average rating for a course
 *     tags: [Rating]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: courseId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the course
 *     responses:
 *       200:
 *         description: Average rating retrieved successfully
 *       404:
 *         description: Course not found
 *       500:
 *         description: Internal server error
 */
ratingRouter.get('/course/:courseId/average', authMiddleware, getAverageRatingForCourse);

/**
 * @swagger
 * /api/rating/has-provided/{userEmail}/{courseId}:
 *   get:
 *     summary: Check if user has provided feedback and rating for a course
 *     tags: [Rating]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userEmail
 *         required: true
 *         schema:
 *           type: string
 *         description: The email of the user
 *       - in: path
 *         name: courseId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the course
 *     responses:
 *       200:
 *         description: Check completed successfully
 *       404:
 *         description: User or course not found
 *       500:
 *         description: Internal server error
 */
ratingRouter.get('/has-provided/:userEmail/:courseId', authMiddleware, hasUserProvidedFeedbackAndRating);

/**
 * @swagger
 * /api/rating/userRating/{userEmail}:
 *   get:
 *     summary: Get rating by user email
 *     tags: [Rating]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userEmail
 *         required: true
 *         schema:
 *           type: string
 *         description: The email of the user
 *     responses:
 *       200:
 *         description: Rating retrieved successfully
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */
ratingRouter.get('/userRating/:userEmail', authMiddleware, getRatingByUserEmail);

/**
 * @swagger
 * /api/rating/course/{courseId}/ratings-count:
 *   get:
 *     summary: Get the number of ratings of each type from 1 to 5
 *     tags: [Rating]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: courseId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the course
 *     responses:
 *       200:
 *         description: Ratings count retrieved successfully
 *       404:
 *         description: Course not found
 *       500:
 *         description: Internal server error
 */
ratingRouter.get('/course/:courseId/ratings-count', authMiddleware, getRatingsCountByType);

/**
 * @swagger
 * /api/rating/{ratingId}:
 *   put:
 *     summary: Update an existing rating
 *     tags: [Rating]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: ratingId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the rating
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               ratingPoint:
 *                 type: number
 *                 minimum: 1
 *                 maximum: 5
 *               feedback:
 *                 type: string
 *     responses:
 *       200:
 *         description: Rating updated successfully
 *       400:
 *         description: Invalid input
 *       404:
 *         description: Rating not found
 *       500:
 *         description: Internal server error
 */
ratingRouter.put('/:ratingId', authMiddleware, updateRating);

export default ratingRouter;