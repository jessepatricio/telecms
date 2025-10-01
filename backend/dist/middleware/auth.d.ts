import { Request, Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '@/types';
export declare const authenticate: (req: Request, res: Response, next: NextFunction) => Promise<void | Response<any, Record<string, any>>>;
export declare const authorize: (...roles: string[]) => (req: AuthenticatedRequest, res: Response, next: NextFunction) => void | Response<any, Record<string, any>>;
export declare const optionalAuth: (req: Request, res: Response, next: NextFunction) => Promise<void>;
//# sourceMappingURL=auth.d.ts.map