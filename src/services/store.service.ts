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
