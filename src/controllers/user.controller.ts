import { Request, Response, NextFunction } from "express";
import { UserService } from "@/services/user.service";
import { BaseController } from "./base.controller";
import { AppError } from "@/utils/appError";

export class UserController extends BaseController {
  constructor(private userService: UserService) {
    super();
  }

  getAll = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    await this.handleRequest(req, res, next, async () => {
      return await this.userService.getAllUsers();
    });
  };

  create = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    await this.handleRequest(req, res, next, async () => {
      return await this.userService.createUser(req.body);
    });
  };

  update = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    await this.handleRequest(req, res, next, async () => {
      return await this.userService.updateUser(req.params.id, req.body);
    });
  };

  delete = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    await this.handleRequest(req, res, next, async () => {
      await this.userService.deleteUser(req.params.id);
      return null;
    });
  };

  getProfile = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    await this.handleRequest(req, res, next, async () => {
      return await this.userService.getUserById(req.user.userId);
    });
  }

  addPoint = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    await this.handleRequest(req, res, next, async () => {
      const { roomName } = req.params;
      return await this.userService.addPoint(roomName);
    });
  }

  buyAvatar = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    await this.handleRequest(req, res, next, async () => {
      const { avatarId } = req.params;
      const userId = req.user.userId;

      if (!avatarId) {
        throw new AppError("Avatar ID is required", 400);
      }

      return await this.userService.buyAvatar(userId, avatarId);
    });
  }

  buyBackground = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    await this.handleRequest(req, res, next, async () => {
      const { backgroundId } = req.params;
      const userId = req.user.userId;

      if (!backgroundId) {
        throw new AppError("Background ID is required", 400);
      }

      return await this.userService.buyBackground(userId, backgroundId);
    });
  }

  changeAvatar = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    await this.handleRequest(req, res, next, async () => {
      const { avatarId } = req.params;
      const userId = req.user.userId;

      if (!avatarId) {
        throw new AppError("Avatar ID is required", 400);
      }

      return await this.userService.changeAvatar(userId, avatarId);
    });
  }

  changeBackground = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    await this.handleRequest(req, res, next, async () => {
      const { backgroundId } = req.params;
      const userId = req.user.userId;

      if (!backgroundId) {
        throw new AppError("Background ID is required", 400);
      }

      return await this.userService.changeBackground(userId, backgroundId);
    });
  }

  getInventory = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    await this.handleRequest(req, res, next, async () => {
      const userId = req.user.userId;
      return await this.userService.getUserInventory(userId);
    });
  }
}
