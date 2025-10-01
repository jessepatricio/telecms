import { Request, Response, NextFunction } from 'express';
import winston from 'winston';
declare const logger: winston.Logger;
export interface ApiError extends Error {
    statusCode?: number;
    isOperational?: boolean;
}
export declare class AppError extends Error implements ApiError {
    statusCode: number;
    isOperational: boolean;
    constructor(message: string, statusCode?: number);
}
export declare const errorHandler: (err: any, req: Request, res: Response, _next: NextFunction) => void;
export declare const handleUnhandledRejection: () => void;
export declare const handleUncaughtException: () => void;
export declare const notFound: (req: Request, _res: Response, next: NextFunction) => void;
export declare const asyncHandler: (fn: Function) => (req: Request, res: Response, next: NextFunction) => void;
export { logger };
//# sourceMappingURL=errorHandler.d.ts.map