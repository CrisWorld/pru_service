import { PrismaClient } from "@prisma/client";
import { AppError } from "@/utils/appError";
import { ErrorCode } from "@/utils/errorCodes";

const prisma = new PrismaClient();

export class UserService {
  async getAllUsers(page = 1, limit = 10) {
    const skip = (page - 1) * limit;
    return await prisma.user.findMany({
      take: limit,
      skip,
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  async getUserById(id: string) {
    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        point: true,
        Setting: {
          select: {
            avatar: true,
            background: true,
          }
        },
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      throw new AppError("User not found", 404);
    }

    return user;
  }

  async getUserInventory(id: string) {
    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        userAvatars: {
          select: {
            avatar: true,
          }
        },
        userBackgrounds: {
          select: {
            background: true,
          }
        }
      },
    });

    if (!user) {
      throw new AppError("User not found", 404);
    }

    return user;
  }

  async updateUser(
    id: string,
    data: Partial<{
      name: string;
      email: string;
      role: "ADMIN" | "USER";
    }>
  ) {
    return prisma.user.update({
      where: { id },
      data,
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  async deleteUser(id: string) {
    await prisma.user.delete({
      where: { id },
    });
  }

  async createUser(data: {
    name: string;
    email: string;
    password: string;
    role?: "ADMIN" | "USER";
  }) {
    return prisma.user.create({
      data,
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  async addPoint(userId: string, pointToAdd: number) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        point: true,
      },
    });

    if (!user) {
      throw new AppError("User not found", 404);
    }

    // Update user's points
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        point: { increment: pointToAdd },
      },
      select: {
        id: true,
        point: true,
      },
    });

    return updatedUser;
  }

  async buyAvatar(userId: string, avatarId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        name: true,
        point: true,
        userAvatars: {
          where: { avatarId },
        },
      },
    });

    if (!user) {
      throw new AppError("User not found", 404);
    }

    // Check if user already owns the avatar
    if (user.userAvatars.length > 0) {
      throw new AppError("User already owns this avatar", 400, ErrorCode.ALREADY_EXISTS);
    }

    // Check if user has enough points
    const avatar = await prisma.avatar.findUnique({
      where: { id: avatarId },
      select: {
        price: true,
      },
    });

    if (!avatar) {
      throw new AppError("Avatar not found", 404);
    }

    if (user.point < avatar.price) {
      throw new AppError("Not enough points", 400, ErrorCode.NOT_ENOUGH_POINTS);
    }

    // Deduct points from user
    await prisma.user.update({
      where: { id: userId },
      data: {
        point: { decrement: avatar.price },
      },
    });

    // Proceed with the purchase
    const newUserAvatar = await prisma.userAvatar.create({
      data: {
        userId,
        avatarId,
      },
    });

    return newUserAvatar;
  }

  async buyBackground(userId: string, backgroundId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        name: true,
        point: true,
        userBackgrounds: {
          where: { backgroundId },
        },
      },
    });

    if (!user) {
      throw new AppError("User not found", 404);
    }

    // Check if user already owns the background
    if (user.userBackgrounds.length > 0) {
      throw new AppError("User already owns this background", 400, ErrorCode.ALREADY_EXISTS);
    }

    // Check if user has enough points
    const background = await prisma.background.findUnique({
      where: { id: backgroundId },
      select: {
        price: true,
      },
    });

    if (!background) {
      throw new AppError("Background not found", 404);
    }

    if (user.point < background.price) {
      throw new AppError("Not enough points", 400, ErrorCode.NOT_ENOUGH_POINTS);
    }

    // Deduct points from user
    await prisma.user.update({
      where: { id: userId },
      data: {
        point: { decrement: background.price },
      },
    });

    // Proceed with the purchase
    const newUserBackground = await prisma.userBackground.create({
      data: {
        userId,
        backgroundId,
      },
    });

    return newUserBackground;
  }

  async changeAvatar(userId: string, avatarId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        Setting: {
          select: {
            avatar: true,
          }
        },
        userAvatars: {
          where: { avatarId },
        },
      },
    });

    if (!user) {
      throw new AppError("User not found", 404);
    }

    // Check if user owns the avatar
    if (user.userAvatars.length === 0) {
      throw new AppError("User does not own this avatar", 400, ErrorCode.NOT_FOUND);
    }

    // Update user's avatar setting
    return prisma.setting.update({
      where: { userId },
      data: {
        avatar: {
          connect: { id: avatarId }
        }
      },
      select: {
        avatar: true,
      },
    });
  }

  changeBackground = async (userId: string, backgroundId: string) => {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        Setting: {
          select: {
            background: true,
          }
        },
        userBackgrounds: {
          where: { backgroundId },
        },
      },
    });

    if (!user) {
      throw new AppError("User not found", 404);
    }

    // Check if user owns the background
    if (user.userBackgrounds.length === 0) {
      throw new AppError("User does not own this background", 400, ErrorCode.NOT_FOUND);
    }

    // Update user's background setting
    return prisma.setting.update({
      where: { userId },
      data: {
        background: {
          connect: { id: backgroundId }
        }
      },
      select: {
        background: true,
      },
    });
  }



}
