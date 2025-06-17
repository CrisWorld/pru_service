import jwt from "jsonwebtoken";
import { ENV } from "@/config/env";
import { AppError } from "@/utils/appError";
import { logger } from "@/config/logger";
import { ErrorCode } from "@/utils/errorCodes";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export class StoreService {
    async getBackgroundItems(userId: string): Promise<any> {
        return await prisma.background.findMany({
            include: {
                userBackgrounds: {
                    where: {
                        userId: userId,
                    }
                }
            }
        });
    }
    async getAvatarItems(userId: string): Promise<any> {
        return await prisma.avatar.findMany({
            include: {
                userAvatars: {
                    where: {
                        userId: userId,
                    }
                }
            }
        });
    }
}
