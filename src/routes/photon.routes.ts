import { Router } from "express";
import { AuthController } from "@/controllers/auth.controller";
import { AuthService } from "@/services/auth.service";
import { validateRequest } from "@/middleware/validateRequest";
import { loginSchema, signupSchema, verifyEmailSchema, resendVerificationSchema, forgotPasswordSchema, resetPasswordSchema } from "@/validators/auth.validator";
import { requireAuth } from "@/middleware/authMiddleware";
import { verificationLimiter } from "@/middleware/rateLimiter";
import { PhotonService } from "@/services/photon.service";
import { PhotonController } from "@/controllers/photon.controller";

const router = Router();

// Initialize services and controller
const photonService = new PhotonService();
const photonController = new PhotonController(photonService);

router.get("/auth", photonController.vertifyToken);

export default router;
