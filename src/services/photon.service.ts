import jwt from "jsonwebtoken";
import { ENV } from "@/config/env";
import { AppError } from "@/utils/appError";
import { logger } from "@/config/logger";
import { ErrorCode } from "@/utils/errorCodes";


export class PhotonService {
    async vertifyToken(token: string): Promise<{ userId: string } | null> {
        try {
            const decoded = jwt.verify(token, ENV.JWT_SECRET);
            return decoded as { userId: string };
        } catch (error) {
            logger.error({
                message: "Token verification failed",
                context: "PhotonService.vertifyToken",
                error: error instanceof Error ? error.message : "Unknown error",
            });
            throw new AppError("Invalid token", 401, ErrorCode.INVALID_TOKEN);
        }
    }
}
