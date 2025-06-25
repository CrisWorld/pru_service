import { Request, Response, NextFunction } from "express";
import { BaseController } from "./base.controller";
import { GameService } from "@/services/game.service";
import { AppError } from "@/utils/appError";
import { UserService } from "@/services/user.service";
import { GeminiService, MessageType } from "@/services/gemini.service";

export class GameController extends BaseController {
    constructor(
        private gameService: GameService,
        private userService: UserService,
        private geminiService: GeminiService
    ) {
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

    askAI = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        await this.handleRequest(req, res, next, async () => {
            const { question, context } = req.body;

            if (!question) {
                throw new AppError("Both 'question' and 'context' are required", 400);
            }

            const defaultContext = `
                "Veil of Legends" là một trò chơi suy luận xã hội (social deduction game) trực tuyến nhiều người chơi, lấy bối cảnh các địa danh lịch sử nổi tiếng của Việt Nam. Người chơi sẽ hóa thân thành những nhân vật lịch sử, cùng nhau khám phá và thảo luận về một địa điểm bí mật, trong khi đó một gián điệp ẩn danh trà trộn trong số họ, có nhiệm vụ đoán đúng địa điểm và tránh bị lộ tẩy. Game kết hợp yếu tố vui vẻ của suy luận với kiến thức văn hóa, lịch sử Việt Nam.
                Đối với "Thường Dân" (Người biết địa điểm): Phát hiện ra ai là gián điệp bằng cách lắng nghe các câu hỏi, câu trả lời, tìm ra sự mâu thuẫn trong lập luận của gián điệp, và bỏ phiếu buộc tội đúng người.
                Đối với "Gián Điệp": Tìm cách đoán ra địa điểm bí mật mà không để lộ mình là gián điệp. Gieo rắc sự nghi ngờ, làm nhiễu thông tin, khiến thường dân buộc tội nhầm lẫn. Tránh bị buộc tội và bị bỏ phiếu loại khỏi trò chơi.
                Bạn chỉ được gợi ý các câu hỏi và không can thiệp trực tiếp vào trò chơi.
                `;

            const messages: MessageType[] = [
                {
                    role: "user",
                    parts: [{ text: defaultContext }]
                }
            ];
            if (context) {
                messages.push({
                    role: "user",
                    parts: [{ text: context }]
                });
            }
            messages.push({
                role: "user",
                parts: [{ text: question + "trả lời bằng tiếng việt" }]
            });

            const result = await this.geminiService.postAnswer(messages);

            const rawText = result?.candidates?.[0]?.content?.parts?.[0]?.text;
            if (!rawText) {
                throw new AppError("Invalid response from AI", 500);
            }

            let parsed;
            try {
                parsed = JSON.parse(rawText);
            } catch (err) {
                throw new AppError("Failed to parse AI response", 500);
            }

            return {
                context: parsed.context_summary,
                suggestions: parsed.suggested_questions
            };
        });
    }


}
