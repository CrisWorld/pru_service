import { Request, Response, NextFunction } from "express";
import { BaseController } from "./base.controller";
import { PhotonService } from "@/services/photon.service";

export class PhotonController extends BaseController {
    constructor(private photoService: PhotonService) {
        super();
    }

    vertifyToken = async (request: Request, response: Response, next: NextFunction): Promise<void> => {
        await this.handleRequest(request, response, next, async () => {
            const token = request.query.token;

            if (!token || typeof token !== "string") {
                return response.json({
                    ResultCode: 2,
                    Message: "Missing or invalid token",
                });
            }

            const user = await this.photoService.vertifyToken(token); // trả về null nếu sai

            if (!user) {
                return response.json({
                    ResultCode: 3,
                    Message: "Token verification failed",
                });
            }

            return response.json({
                ResultCode: 1,
                UserId: user.userId, // có thể dùng user.email nếu bạn muốn
            });
        });
    }


}
