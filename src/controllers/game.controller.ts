import { Request, Response, NextFunction } from "express";
import { BaseController } from "./base.controller";
import { GameService } from "@/services/game.service";
import { AppError } from "@/utils/appError";
import { UserService } from "@/services/user.service";

export class GameController extends BaseController {
    constructor(private gameService: GameService, private userService: UserService) {
        super();
    }

    addPoint = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        await this.handleRequest(req, res, next, async () => {
            const userId = req.user.userId;
            const { roomId, point } = req.body;
            if ((await this.gameService.isPlayerIsAdded(roomId, userId))) throw new AppError("Player already added", 400);
            await this.userService.addPoint(userId, point);
            await this.gameService.updatePlayerStatus(roomId, userId, true);
            return {
                message: "Point added successfully",
            }
        });
    }

    createRoom = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        await this.handleRequest(req, res, next, async () => {
            const { roomId, playerIds } = req.body;
            if (!roomId || !playerIds || playerIds.length === 0) {
                throw new AppError("Room ID and player IDs are required", 400);
            }
            await this.gameService.createRoom({
                roomId,
                playerIds,
                startedAt: new Date(),
            });
            return { message: "Room created successfully" };
        });
    };

    removeRoom = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        await this.handleRequest(req, res, next, async () => {
            const { roomId } = req.body;
            if (!roomId) {
                throw new AppError("Room ID is required", 400);
            }
            await this.gameService.removeRoom(roomId);
            return { message: "Room removed successfully" };
        });
    }

}
