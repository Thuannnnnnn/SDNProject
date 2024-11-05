import express from 'express';
import { updateProfile, updatePassword, getUserInfo, uploadUserAvatar, updateUserAvatar, deleteUserAvatar } from '../controller/profile/editProfileController.js';
import authMiddleware from '../middleware/authMiddleware.js';

const editProfileRouter = express.Router();

/**
 * @swagger
 * /api/profile/update-bio/{userId}:
 *   put:
 *     summary: Update user profile
 *     tags: [Profile]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               bio:
 *                 type: string
 *     responses:
 *       200:
 *         description: Profile updated successfully
 *       400:
 *         description: Invalid input
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */
editProfileRouter.put('/update-bio/:userId', authMiddleware, updateProfile);

/**
 * @swagger
 * /api/profile/update-password/{userId}:
 *   put:
 *     summary: Update user password
 *     tags: [Profile]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               oldPassword:
 *                 type: string
 *               newPassword:
 *                 type: string
 *     responses:
 *       200:
 *         description: Password updated successfully
 *       400:
 *         description: Invalid input
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */
editProfileRouter.put('/update-password/:userId', authMiddleware, updatePassword);

/**
 * @swagger
 * /api/profile/upload-avatar/{userId}:
 *   post:
 *     summary: Upload user avatar
 *     tags: [Profile]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the user
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               avatar:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Avatar uploaded successfully
 *       400:
 *         description: Invalid input or no file uploaded
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */
editProfileRouter.post('/upload-avatar/:userId', authMiddleware, uploadUserAvatar);

/**
 * @swagger
 * /api/profile/update-avatar/{userId}:
 *   put:
 *     summary: Update user avatar
 *     tags: [Profile]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the user
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               avatar:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Avatar updated successfully
 *       400:
 *         description: Invalid input or no file uploaded
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */
editProfileRouter.put('/update-avatar/:userId', authMiddleware, updateUserAvatar);

/**
 * @swagger
 * /api/profile/user-info/{userId}:
 *   get:
 *     summary: Get user info
 *     tags: [Profile]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the user
 *     responses:
 *       200:
 *         description: User info retrieved successfully
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */
editProfileRouter.get('/user-info/:userId', authMiddleware, getUserInfo);

/**
 * @swagger
 * /api/profile/delete-avatar/{userId}:
 *   delete:
 *     summary: Delete user avatar
 *     tags: [Profile]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the user
 *     responses:
 *       200:
 *         description: Avatar deleted successfully
 *       404:
 *         description: User or avatar not found
 *       500:
 *         description: Internal server error
 */
editProfileRouter.delete('/delete-avatar/:userId', authMiddleware, deleteUserAvatar);

export default editProfileRouter;