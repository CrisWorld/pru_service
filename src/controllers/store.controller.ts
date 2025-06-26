import { Request, Response, NextFunction } from "express";
import { BaseController } from "./base.controller";
import { StoreService } from "@/services/store.service";

export class StoreController extends BaseController {
    constructor(private storeService: StoreService) {
        super();
    }

    getBackgrounds = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        await this.handleRequest(req, res, next, async () => {
            // const userId = req.user.userId;
            const userId = "1fc4ceaa-d051-4bcc-9b5e-6fa3bc3a6bf7"
            return await this.storeService.getBackgroundItems(userId);
        });
    }

    getAvatars = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        await this.handleRequest(req, res, next, async () => {
            // const userId = req.user.userId;
            const userId = "1fc4ceaa-d051-4bcc-9b5e-6fa3bc3a6bf7"
            return await this.storeService.getAvatarItems(userId);
        });
    }

}
