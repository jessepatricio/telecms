import { Request, Response, NextFunction } from 'express';

export const userAuthenticated = function(req: Request, res: Response, next: NextFunction): void {
    if ((req as any).isAuthenticated()) {
        return next();
    }
    res.redirect('/login');
};

export default {
    userAuthenticated
};

