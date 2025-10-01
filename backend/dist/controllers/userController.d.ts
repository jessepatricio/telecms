import { Request, Response, NextFunction } from 'express';
export declare class UserController {
    createUser: (req: Request, res: Response, next: NextFunction) => void;
    getUsers: (req: Request, res: Response, next: NextFunction) => void;
    getUserById: (req: Request, res: Response, next: NextFunction) => void;
    updateUser: (req: Request, res: Response, next: NextFunction) => void;
    deleteUser: (req: Request, res: Response, next: NextFunction) => void;
    deactivateUser: (req: Request, res: Response, next: NextFunction) => void;
    activateUser: (req: Request, res: Response, next: NextFunction) => void;
    getUserStats: (req: Request, res: Response, next: NextFunction) => void;
}
export declare const userController: UserController;
//# sourceMappingURL=userController.d.ts.map