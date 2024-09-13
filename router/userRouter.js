import express from 'express';
import { findUserByEmail, createUser, findUserall } from '../controller/userController.js';

const userRouter = express.Router();

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: Operations related to users
 */


/**
 * @swagger
 * /api/user/users/{email}:
 *   get:
 *     tags: [Users]
 *     summary: Find a user by email
 *     description: Retrieve a user based on their email address.
 *     parameters:
 *       - in: path
 *         name: email
 *         required: true
 *         description: The email of the user to retrieve.
 *         schema:
 *           type: string
 *           example: johndoe@example.com
 *     responses:
 *       200:
 *         description: User found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Users'
 *       404:
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: User not found
 *       500:
 *         description: Internal server error
 */
userRouter.get('/email/:email', findUserByEmail);



/**
 * @swagger
 * api/user/createUsers:
 *   post:
 *     tags: [Users]
 *     summary: Create a new user
 *     description: Create a new user with the provided data (name, email, password, role, gender, phoneNumber).
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: John Doe
 *               email:
 *                 type: string
 *                 example: johndoe@example.com
 *               password:
 *                 type: string
 *                 example: secret123
 *               role:
 *                 type: string
 *                 example: user
 *               gender:
 *                 type: string
 *                 example: male
 *               phoneNumber:
 *                 type: string
 *                 example: "123456789"
 *     responses:
 *       201:
 *         description: User created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: User created successfully!
 *                 user:
 *                   $ref: '#/components/schemas/Users'
 *       400:
 *         description: Error creating user
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Error creating user
 *                 error:
 *                   type: string
 */
userRouter.post('/createUsers', createUser);

/**
 * @swagger
 * api/user/findAll:
 *   get:
 *     summary: Get all users
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully retrieved all users
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Users'
 *       404:
 *         description: No users found
 *       500:
 *         description: Internal server error
 */
userRouter.get('/findAll',findUserall);

export default userRouter;
