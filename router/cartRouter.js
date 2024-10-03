import express from "express";
import {
  addCourseToCart,
  deteleCourse,
  getCartByEmail,
  deleteCourses
} from "../controller/cart/cartController.js";

const cartRouter = express.Router();

/**
 * @swagger
 * tags:
 *   name: Cart
 *   description: Operations for jwt
 */

/**
 * @swagger
 * /api/cart/getByEmail:
 *   get:  # Phương thức GET
 *     summary: Get cart by userGenerated
 *     tags: [Cart]
 *     description: Retrieve a cart for a specific userGenerated address.
 *     parameters:
 *       - name: userGenerated
 *         in: query
 *         required: true
 *         description: The userGenerated email of the user.
 *         schema:
 *           type: string
 *           example: "user@example.com"  # Ví dụ
 *     responses:
 *       '200':
 *         description: Cart retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 Cart:
 *                   type: object
 *                   properties:
 *                     cartId:
 *                       type: string
 *                       description: The ID of the cart.
 *                     courses:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           courseId:
 *                             type: string
 *                             description: The ID of the course.
 *                           updateDate:
 *                             type: string
 *                             format: date-time
 *                             description: The date when the course was last updated.
 *                 message:
 *                   type: string
 *                   description: Success message.
 *       '404':
 *         description: Cart not found
 *       '500':
 *         description: Error while finding cart
 */
cartRouter.get("/getByEmail", getCartByEmail);

/**
 * @swagger
 * /api/cart/addToCart:
 *   post:
 *     summary: Add course to cart
 *     tags: [Cart]
 *     description: Add a specified course to a user's cart.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               cartId:
 *                 type: string
 *               courseId:
 *                 type: string
 *     responses:
 *       '200':
 *         description: Course added to cart successfully
 *       '404':
 *         description: Course or cart not found
 *       '500':
 *         description: Error while adding course to cart
 */
cartRouter.post("/addToCart", addCourseToCart);

/**
 * @swagger
 * /api/cart/deteleCourseOutCart:
 *   post:
 *     summary: Delete course from cart
 *     tags: [Cart]
 *     description: Remove a specified course from a user's cart.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               cartId:
 *                 type: string
 *               courseId:
 *                 type: string
 *     responses:
 *       '200':
 *         description: Course removed from cart successfully
 *       '404':
 *         description: Cart or Course not found
 *       '500':
 *         description: Error while deleting course from cart
 */
cartRouter.post("/deteleCourseOutCart", deteleCourse);
/**
 * @swagger
 * /api/cart/deteleCourseOrder:
 *   delete:
 *     summary: Delete course from cart
 *     tags: [Cart]
 *     description: Remove a specified course from a user's cart.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               cartId:
 *                 type: string
 *               courseId:
 *                 type: string
 *     responses:
 *       '200':
 *         description: Course removed from cart successfully
 *       '404':
 *         description: Cart or Course not found
 *       '500':
 *         description: Error while deleting course from cart
 */
cartRouter.delete("/deteleCourseOrder", deleteCourses);

export default cartRouter;
