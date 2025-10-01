"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.strictRateLimit = exports.authRateLimit = exports.generalRateLimit = void 0;
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const logger_1 = __importDefault(require("@/utils/logger"));
const windowMs = parseInt(process.env['RATE_LIMIT_WINDOW_MS'] || '900000');
const maxRequests = parseInt(process.env['RATE_LIMIT_MAX_REQUESTS'] || '100');
exports.generalRateLimit = (0, express_rate_limit_1.default)({
    windowMs,
    max: maxRequests,
    message: {
        success: false,
        message: 'Too many requests',
        error: 'Rate limit exceeded. Please try again later.'
    },
    standardHeaders: true,
    legacyHeaders: false,
    handler: (req, res) => {
        logger_1.default.warn('Rate limit exceeded:', {
            ip: req.ip,
            url: req.url,
            method: req.method,
            userAgent: req.get('User-Agent')
        });
        res.status(429).json({
            success: false,
            message: 'Too many requests',
            error: 'Rate limit exceeded. Please try again later.'
        });
    }
});
exports.authRateLimit = (0, express_rate_limit_1.default)({
    windowMs: 15 * 60 * 1000,
    max: 5,
    message: {
        success: false,
        message: 'Too many authentication attempts',
        error: 'Too many login attempts. Please try again later.'
    },
    standardHeaders: true,
    legacyHeaders: false,
    skipSuccessfulRequests: true,
    handler: (req, res) => {
        logger_1.default.warn('Auth rate limit exceeded:', {
            ip: req.ip,
            url: req.url,
            method: req.method,
            userAgent: req.get('User-Agent')
        });
        res.status(429).json({
            success: false,
            message: 'Too many authentication attempts',
            error: 'Too many login attempts. Please try again later.'
        });
    }
});
exports.strictRateLimit = (0, express_rate_limit_1.default)({
    windowMs: 15 * 60 * 1000,
    max: 3,
    message: {
        success: false,
        message: 'Too many requests',
        error: 'Rate limit exceeded. Please try again later.'
    },
    standardHeaders: true,
    legacyHeaders: false,
    handler: (req, res) => {
        logger_1.default.warn('Strict rate limit exceeded:', {
            ip: req.ip,
            url: req.url,
            method: req.method,
            userAgent: req.get('User-Agent')
        });
        res.status(429).json({
            success: false,
            message: 'Too many requests',
            error: 'Rate limit exceeded. Please try again later.'
        });
    }
});
//# sourceMappingURL=rateLimiter.js.map