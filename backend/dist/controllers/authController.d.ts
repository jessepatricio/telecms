import { Request, Response, NextFunction } from 'express';
export declare class AuthController {
    login: (req: Request, res: Response, next: NextFunction) => void;
    register: (req: Request, res: Response, next: NextFunction) => void;
    refreshToken: (req: Request, res: Response, next: NextFunction) => void;
    verifyToken: (req: Request, res: Response, next: NextFunction) => void;
    changePassword: (req: Request, res: Response, next: NextFunction) => void;
    logout: (req: Request, res: Response, next: NextFunction) => void;
    getProfile: (req: Request, res: Response, next: NextFunction) => void;
    updateProfile: (req: Request, res: Response, next: NextFunction) => void;
}
export declare const authController: AuthController;
//# sourceMappingURL=authController.d.ts.map