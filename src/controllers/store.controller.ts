import { Request, Response, NextFunction } from "express";
import { BaseController } from "./base.controller";
import { StoreService } from "@/services/store.service";

export class StoreController extends BaseController {
    constructor(private storeService: StoreService) {
        super();
    }

    getBackgrounds = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        await this.handleRequest(req, res, next, async () => {
            const userId = req.user.userId;
            return await this.storeService.getBackgroundItems(userId);
        });
    }

    getAvatars = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        await this.handleRequest(req, res, next, async () => {
            const userId = req.user.userId;
            return await this.storeService.getAvatarItems(userId);
        });
    }

}
