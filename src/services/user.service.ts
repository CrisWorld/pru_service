import { PrismaClient } from "@prisma/client";
import { AppError } from "@/utils/appError";

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

  async addPoint(roomName: string) {
    // get all users in the room
    const userPoints: { id: string; pointToAdd: number }[] = [
      { id: "1bc", pointToAdd: 5 },
      { id: "sdddd", pointToAdd: 2 },
    ];

    // 👇 Hàm cập nhật 1 user
    const updateUserPoint = async (user: { id: string; pointToAdd: number }) => {
      return prisma.user.update({
        where: { id: user.id },
        data: {
          point: { increment: user.pointToAdd },
        },
        select: {
          id: true,
          point: true,
        },
      });
    };

    // 👇 Lần cập nhật đầu tiên
    const results = await Promise.allSettled(
      userPoints.map((user) => updateUserPoint(user))
    );

    // 👇 Lọc ra các user bị lỗi
    const failedUsers = results
      .map((result, index) => {
        if (result.status === "rejected") {
          console.error(`Lỗi cập nhật lần 1 cho user ${userPoints[index].id}:`, result.reason);
          return userPoints[index];
        }
        return null;
      })
      .filter(Boolean) as { id: string; pointToAdd: number }[];

    // 👇 Retry cập nhật lại cho các user lỗi
    if (failedUsers.length > 0) {
      const retryResults = await Promise.allSettled(
        failedUsers.map((user) => updateUserPoint(user))
      );

      retryResults.forEach((result, index) => {
        if (result.status === "rejected") {
          console.error(`Lỗi cập nhật lần 2 cho user ${failedUsers[index].id}:`, result.reason);
        } else {
          console.log(`✅ Cập nhật thành công lần 2 cho user ${failedUsers[index].id}`);
        }
      });
    }

    // 👇 Trả về kết quả thành công ban đầu + retry thành công
    const successfulUpdates = results
      .map((result, index) => (result.status === "fulfilled" ? result.value : null))
      .filter(Boolean);

    return successfulUpdates;
  }


}
