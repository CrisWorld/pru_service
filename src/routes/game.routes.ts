import { Router } from "express";
import { requireAuth } from "@/middleware/authMiddleware";
import { GameService } from "@/services/game.service";
import { UserService } from "@/services/user.service";
import { GameController } from "@/controllers/game.controller";
import { GeminiService } from "@/services/gemini.service";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Game
 *   description: Game management endpoints
 */

// Init services & controller
const gameService = new GameService();
const userService = new UserService();
const geminiService = new GeminiService();
const gameController = new GameController(gameService, userService, geminiService);

// Middleware bảo vệ route
router.use(requireAuth);

/**
 * @swagger
 * /game/add-point:
 *   post:
 *     summary: Add point for user after game ends
 *     tags: [Game]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               roomId:
 *                 type: string
 *               point:
 *                 type: number
 *     responses:
 *       200:
 *         description: Point added successfully
 */
router.post("/add-point", gameController.addPoint);

/**
 * @swagger
 * /game/create-room:
 *   post:
 *     summary: Create a new game room
 *     tags: [Game]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               roomId:
 *                 type: string
 *               playerIds:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       200:
 *         description: Room created successfully
 */
router.post("/create-room", gameController.createRoom);

/**
 * @swagger
 * /game/remove-room:
 *   delete:
 *     summary: Remove a game room
 *     tags: [Game]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               roomId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Room removed successfully
 */
router.delete("/remove-room", gameController.removeRoom);

/**
 * @swagger
 * /game/ask-ai:
 *   post:
 *     summary: Ask Gemini AI to suggest questions and summarize context
 *     tags: [Game]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               question:
 *                 type: string
 *               context:
 *                 type: string
 *                 required: false   
 *     responses:
 *       200:
 *         description: AI responded with suggested questions and context summary
 */
router.post("/ask-ai", gameController.askAI);

export default router;
