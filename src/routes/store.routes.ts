import { Router } from "express";
import { requireAuth } from "@/middleware/authMiddleware";
import { verificationLimiter } from "@/middleware/rateLimiter";
import { StoreService } from "@/services/store.service";
import { StoreController } from "@/controllers/store.controller";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Store
 *   description: Store management endpoints
 */


// Initialize services and controller
const storeService = new StoreService();
const storeController = new StoreController(storeService);

// router.use(requireAuth);

/**
 * @swagger
 * /store/backgrounds:
 *   get:
 *     summary: Get store backgrounds
 *     tags: [Store]
 *     responses:
 *       200:
 *         description: List of backgrounds
 */
router.get("/backgrounds", storeController.getBackgrounds);

/**
 * @swagger
 * /store/avatars:
 *   get:
 *     summary: Get store avatars
 *     tags: [Store]
 *     responses:
 *       200:
 *         description: List of avatars
 */
router.get("/avatars", storeController.getAvatars);

export default router;
