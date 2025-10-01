import { Request, Response, NextFunction } from 'express';
export declare const createRateLimit: (windowMs: number, max: number, message?: string) => import("express-rate-limit").RateLimitRequestHandler;
export declare const generalRateLimit: import("express-rate-limit").RateLimitRequestHandler;
export declare const authRateLimit: import("express-rate-limit").RateLimitRequestHandler;
export declare const uploadRateLimit: import("express-rate-limit").RateLimitRequestHandler;
export declare const corsOptions: {
    origin: (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => void;
    credentials: boolean;
    optionsSuccessStatus: number;
    methods: string[];
    allowedHeaders: string[];
};
export declare const helmetConfig: (req: import("http").IncomingMessage, res: import("http").ServerResponse, next: (err?: unknown) => void) => void;
export declare const sanitizeRequest: (req: Request, _res: Response, next: NextFunction) => void;
export declare const ipWhitelist: (allowedIPs: string[]) => (req: Request, res: Response, next: NextFunction) => void;
export declare const requestSizeLimit: (maxSize: string) => (req: Request, res: Response, next: NextFunction) => void;
export declare const securityHeaders: (_req: Request, res: Response, next: NextFunction) => void;
export declare const fileUploadSecurity: (req: Request, res: Response, next: NextFunction) => void;
//# sourceMappingURL=security.d.ts.map