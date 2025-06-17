import { Router } from "express";
import { UserController } from "@/controllers/user.controller";
import { UserService } from "@/services/user.service";
import { validateRequest } from "@/middleware/validateRequest";
// import { requireAuth, requireRole } from "@/middleware/authMiddleware";
import { requireAuth } from "@/middleware/authMiddleware";
import {
  createUserSchema,
  updateUserSchema,
} from "@/validators/user.validator";
import { cache } from "@/middleware/cacheMiddleware";

const router = Router();
const userService = new UserService();
const userController = new UserController(userService);

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: User management endpoints
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *         name:
 *           type: string
 *         email:
 *           type: string
 *           format: email
 *         role:
 *           type: string
 *           enum: [ADMIN, USER]
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 */

// Protected routes - all routes require authentication
router.use(requireAuth);

// /**
//  * @swagger
//  * /users:
//  *   get:
//  *     summary: Get all users (Admin only)
//  *     tags: [Users]
//  *     security:
//  *       - bearerAuth: []
//  *     responses:
//  *       200:
//  *         description: List of users
//  *         content:
//  *           application/json:
//  *             schema:
//  *               type: array
//  *               items:
//  *                 $ref: '#/components/schemas/User'
//  *       401:
//  *         description: Unauthorized
//  *       403:
//  *         description: Forbidden - Admin only
//  */
// router.get(
//   "/",
//   // requireRole(["ADMIN"]),
//   cache({ duration: 300 }), // Cache for 5 minutes
//   userController.getAll
// );

/**
 * @swagger
 * /users/profile:
 *   get:
 *     summary: Get user by ID
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: User details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       404:
 *         description: User not found
 */
router.get(
  "/profile",
  cache({ duration: 60 }), // Cache for 1 minute
  userController.getProfile
);

// /**
//  * @swagger
//  * /users:
//  *   post:
//  *     summary: Create new user (Admin only)
//  *     tags: [Users]
//  *     security:
//  *       - bearerAuth: []
//  *     requestBody:
//  *       required: true
//  *       content:
//  *         application/json:
//  *           schema:
//  *             type: object
//  *             required:
//  *               - name
//  *               - email
//  *               - password
//  *             properties:
//  *               name:
//  *                 type: string
//  *                 minLength: 2
//  *               email:
//  *                 type: string
//  *                 format: email
//  *               password:
//  *                 type: string
//  *                 format: password
//  *                 minLength: 8
//  *     responses:
//  *       201:
//  *         description: User created
//  *       400:
//  *         description: Invalid input
//  *       403:
//  *         description: Forbidden - Admin only
//  */
// router.post(
//   "/",
//   // requireRole(["ADMIN"]),
//   validateRequest(createUserSchema),
//   userController.create
// );

// /**
//  * @swagger
//  * /users/{id}:
//  *   delete:
//  *     summary: Delete user (Admin only)
//  *     tags: [Users]
//  *     security:
//  *       - bearerAuth: []
//  *     parameters:
//  *       - in: path
//  *         name: id
//  *         required: true
//  *         schema:
//  *           type: string
//  *           format: uuid
//  *     responses:
//  *       200:
//  *         description: User deleted
//  *       403:
//  *         description: Forbidden - Admin only
//  *       404:
//  *         description: User not found
//  */
// router.delete("/:id",
//   // requireRole(["ADMIN"]),
//   userController.delete);

/**
* @swagger
* /users/buy-avatar/{avatarId}:
*   post:
*     summary: Buy avatar for user
*     tags: [Users]
*     security:
*       - bearerAuth: []
*     parameters:
*       - in: path
*         name: avatarId
*         required: true
*         schema:
*           type: string
*           format: uuid
*     responses:
*       200:
*         description: Avatar purchased successfully
*       400:
*         description: User already owns this avatar or invalid input or not enough points
*       404:
*         description: User not found
*/
router.post("/buy-avatar/:avatarId",
  userController.buyAvatar);

/**
* @swagger
* /users/buy-background/{backgroundId}:
*   post:
*     summary: Buy background for user
*     tags: [Users]
*     security:
*       - bearerAuth: []
*     parameters:
*       - in: path
*         name: backgroundId
*         required: true
*         schema:
*           type: string
*           format: uuid
*     responses:
*       200:
*         description: Background purchased successfully
*       400:
*         description: User already owns this background or invalid input or not enough points
*       404:
*         description: User not found
*/
router.post("/buy-background/:backgroundId",
  userController.buyBackground);

/**
* @swagger
* /users/change-avatar/{avatarId}:
*   post:
*     summary: Change avatar for user
*     tags: [Users]
*     security:
*       - bearerAuth: []
*     parameters:
*       - in: path
*         name: avatarId
*         required: true
*         schema:
*           type: string
*           format: uuid
*     responses:
*       200:
*         description: Avatar changed successfully
*       400:
*         description: User do not owns this avatar or invalid input
*       404:
*         description: User not found
*/
router.put("/change-avatar/:avatarId",
  userController.changeAvatar
);

/**
* @swagger
* /users/change-background/{backgroundId}:
*   post:
*     summary: Change background for user
*     tags: [Users]
*     security:
*       - bearerAuth: []
*     parameters:
*       - in: path
*         name: backgroundId
*         required: true
*         schema:
*           type: string
*           format: uuid
*     responses:
*       200:
*         description: Background changed successfully
*       400:
*         description: User do not owns this background or invalid input
*       404:
*         description: User not found
*/
router.put("/change-background/:backgroundId",
  userController.changeBackground
);

/**
* @swagger
* /users/inventory:
*   get:
*     summary: Get user inventory
*     tags: [Users]
*     security:
*       - bearerAuth: []
*     responses:
*       200:
*         description: User inventory retrieved successfully
*       404:
*         description: User not found
*/
router.get("/inventory",
  userController.getInventory);
export default router;
