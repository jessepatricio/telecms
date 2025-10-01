"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sanitizeRequest = exports.securityHeaders = exports.helmetConfig = void 0;
const helmet_1 = __importDefault(require("helmet"));
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
});
const securityHeaders = (req, res, next) => {
    res.removeHeader('X-Powered-By');
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'DENY');
    res.setHeader('X-XSS-Protection', '1; mode=block');
    res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
    res.setHeader('Permissions-Policy', 'geolocation=(), microphone=(), camera=()');
    next();
};
exports.securityHeaders = securityHeaders;
const sanitizeRequest = (req, res, next) => {
    if (req.body && typeof req.body === 'object') {
        const sanitizeObject = (obj) => {
            if (typeof obj === 'string') {
                return obj.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
            }
            if (Array.isArray(obj)) {
                return obj.map(sanitizeObject);
            }
            if (obj && typeof obj === 'object') {
                const sanitized = {};
                for (const key in obj) {
                    if (obj.hasOwnProperty(key)) {
                        sanitized[key] = sanitizeObject(obj[key]);
                    }
                }
                return sanitized;
            }
            return obj;
        };
        req.body = sanitizeObject(req.body);
    }
    next();
};
exports.sanitizeRequest = sanitizeRequest;
//# sourceMappingURL=security.js.map