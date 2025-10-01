"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.fileUploadSecurity = exports.securityHeaders = exports.requestSizeLimit = exports.ipWhitelist = exports.sanitizeRequest = exports.helmetConfig = exports.corsOptions = exports.uploadRateLimit = exports.authRateLimit = exports.generalRateLimit = exports.createRateLimit = void 0;
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const helmet_1 = __importDefault(require("helmet"));
const createRateLimit = (windowMs, max, message) => {
    return (0, express_rate_limit_1.default)({
        windowMs,
        max,
        message: message || 'Too many requests from this IP, please try again later.',
        standardHeaders: true,
        legacyHeaders: false,
        handler: (_req, res) => {
            res.status(429).json({
                error: 'Too many requests',
                message: 'Rate limit exceeded. Please try again later.',
                retryAfter: Math.round(windowMs / 1000)
            });
        }
    });
};
exports.createRateLimit = createRateLimit;
exports.generalRateLimit = (0, exports.createRateLimit)(parseInt(process.env['RATE_LIMIT_WINDOW_MS'] || '900000'), parseInt(process.env['RATE_LIMIT_MAX_REQUESTS'] || '100'));
exports.authRateLimit = (0, exports.createRateLimit)(15 * 60 * 1000, 5, 'Too many login attempts, please try again later.');
exports.uploadRateLimit = (0, exports.createRateLimit)(60 * 1000, 10, 'Too many file uploads, please try again later.');
exports.corsOptions = {
    origin: (origin, callback) => {
        const allowedOrigins = process.env['CORS_ORIGIN']?.split(',') || ['http://localhost:3000'];
        if (!origin)
            return callback(null, true);
        if (allowedOrigins.includes(origin)) {
            callback(null, true);
        }
        else {
            callback(new Error('Not allowed by CORS'), false);
        }
    },
    credentials: true,
    optionsSuccessStatus: 200,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
};
exports.helmetConfig = (0, helmet_1.default)({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            styleSrc: ["'self'", "'unsafe-inline'"],
            scriptSrc: ["'self'"],
            imgSrc: ["'self'", "data:", "https:"],
            connectSrc: ["'self'"],
            fontSrc: ["'self'"],
            objectSrc: ["'none'"],
            mediaSrc: ["'self'"],
            frameSrc: ["'none'"],
        },
    },
    crossOriginEmbedderPolicy: false,
    hsts: {
        maxAge: 31536000,
        includeSubDomains: true,
        preload: true
    }
});
const sanitizeRequest = (req, _res, next) => {
    const sanitize = (obj) => {
        if (typeof obj === 'string') {
            return obj
                .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
                .replace(/<[^>]*>/g, '')
                .trim();
        }
        if (typeof obj === 'object' && obj !== null) {
            const sanitized = {};
            for (const key in obj) {
                if (obj.hasOwnProperty(key)) {
                    sanitized[key] = sanitize(obj[key]);
                }
            }
            return sanitized;
        }
        return obj;
    };
    if (req.body) {
        req.body = sanitize(req.body);
    }
    if (req.query) {
        req.query = sanitize(req.query);
    }
    if (req.params) {
        req.params = sanitize(req.params);
    }
    next();
};
exports.sanitizeRequest = sanitizeRequest;
const ipWhitelist = (allowedIPs) => {
    return (req, res, next) => {
        const clientIP = req.ip || req.connection.remoteAddress || req.socket.remoteAddress;
        if (allowedIPs.length === 0 || allowedIPs.includes(clientIP || '')) {
            next();
        }
        else {
            res.status(403).json({
                error: 'Forbidden',
                message: 'Access denied from this IP address'
            });
        }
    };
};
exports.ipWhitelist = ipWhitelist;
const requestSizeLimit = (maxSize) => {
    return (req, res, next) => {
        const contentLength = parseInt(req.get('content-length') || '0');
        const maxBytes = parseInt(maxSize.replace(/\D/g, ''));
        if (contentLength > maxBytes) {
            res.status(413).json({
                error: 'Payload Too Large',
                message: `Request size exceeds ${maxSize} limit`
            });
            return;
        }
        next();
    };
};
exports.requestSizeLimit = requestSizeLimit;
const securityHeaders = (_req, res, next) => {
    res.removeHeader('X-Powered-By');
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'DENY');
    res.setHeader('X-XSS-Protection', '1; mode=block');
    res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
    res.setHeader('Permissions-Policy', 'geolocation=(), microphone=(), camera=()');
    next();
};
exports.securityHeaders = securityHeaders;
const fileUploadSecurity = (req, res, next) => {
    const allowedTypes = process.env['ALLOWED_FILE_TYPES']?.split(',') || [
        'image/jpeg',
        'image/png',
        'image/gif',
        'image/webp'
    ];
    const maxSize = parseInt(process.env['MAX_FILE_SIZE'] || '5242880');
    if (req.files) {
        const files = Array.isArray(req.files) ? req.files : Object.values(req.files).flat();
        for (const file of files) {
            if (!allowedTypes.includes(file.mimetype)) {
                res.status(400).json({
                    error: 'Invalid file type',
                    message: `File type ${file.mimetype} is not allowed`
                });
                return;
            }
            if (file.size > maxSize) {
                res.status(400).json({
                    error: 'File too large',
                    message: `File size exceeds ${maxSize} bytes limit`
                });
                return;
            }
        }
    }
    next();
};
exports.fileUploadSecurity = fileUploadSecurity;
//# sourceMappingURL=security.js.map