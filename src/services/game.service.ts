import redisClient from "@/config/redis";
import { AppError } from "@/utils/appError";

export class GameService {
    async createRoom(room: {
        roomId: string;
        playerIds: string[];
        startedAt: Date;
    }) {
        // let isRoomExists = await redisClient.exists(`room:${room.roomId}`);
        // if (isRoomExists) {
        //     throw new AppError("Room already exists", 409);
        // }
        await this.removeRoom(room.roomId); // Ensure room is removed before creating a new one
        redisClient.set(
            `room:${room.roomId}`, JSON.stringify(room), {
            EX: 60 * 60 // 1 hour expiration
        });
        for (const playerId of room.playerIds) {
            redisClient.set(`room:${room.roomId}:players:${playerId}`, JSON.stringify({
                id: playerId,
                isAdded: false,
            }), { EX: 60 * 60 });
        }
    }

    async getRoom(roomId: string) {
        const roomData = await redisClient.get(`room:${roomId}`);
        if (!roomData) {
            throw new AppError("Room not found", 404);
        }
        return JSON.parse(roomData);
    }

    async removeRoom(roomId: string) {
        const isRoomExists = await redisClient.exists(`room:${roomId}`);
        if (!isRoomExists) {
            throw new AppError("Room not found", 404);
        }
        await redisClient.del(`room:${roomId}`);
        const playerKeys = await redisClient.keys(`room:${roomId}:players:*`);
        if (playerKeys.length > 0) {
            await redisClient.del(playerKeys);
        }
    }

    async isPlayerIsAdded(roomId: string, playerId: string): Promise<boolean> {
        const playerData = await redisClient.get(`room:${roomId}:players:${playerId}`);
        if (!playerData) {
            throw new AppError("Player not found in room", 404);
        }
        const player = JSON.parse(playerData);
        return player.isAdded;
    }

    async updatePlayerStatus(roomId: string, playerId: string, isAdded: boolean) {
        const playerData = await redisClient.get(`room:${roomId}:players:${playerId}`);
        if (!playerData) {
            throw new AppError("Player not found in room", 404);
        }
        const player = JSON.parse(playerData);
        player.isAdded = isAdded;
        await redisClient.set(`room:${roomId}:players:${playerId}`, JSON.stringify(player), {
            KEEPTTL: true // Keep the expiration time
        });
    }
}
