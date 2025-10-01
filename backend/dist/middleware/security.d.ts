import { Request, Response, NextFunction } from 'express';
export declare const helmetConfig: (req: import("http").IncomingMessage, res: import("http").ServerResponse, next: (err?: unknown) => void) => void;
export declare const securityHeaders: (req: Request, res: Response, next: NextFunction) => void;
export declare const sanitizeRequest: (req: Request, res: Response, next: NextFunction) => void;
//# sourceMappingURL=security.d.ts.map