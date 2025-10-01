"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.optionalAuth = exports.authorize = exports.authenticate = void 0;
const jwt_1 = require("@/utils/jwt");
const database_1 = require("@/utils/database");
const logger_1 = __importDefault(require("@/utils/logger"));
const authenticate = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            const response = {
                success: false,
                message: 'Access token is required',
                error: 'No authorization header provided'
            };
            return res.status(401).json(response);
        }
        const token = authHeader.substring(7);
        if (!token) {
            const response = {
                success: false,
                message: 'Access token is required',
                error: 'No token provided'
            };
            return res.status(401).json(response);
        }
        const payload = (0, jwt_1.verifyToken)(token);
        if (payload.type !== 'access') {
            const response = {
                success: false,
                message: 'Invalid token type',
                error: 'Token must be an access token'
            };
            return res.status(401).json(response);
        }
        const user = await database_1.prisma.user.findUnique({
            where: { id: payload.userId },
            include: {
                role: true
            }
        });
        if (!user) {
            const response = {
                success: false,
                message: 'User not found',
                error: 'User associated with token does not exist'
            };
            return res.status(401).json(response);
        }
        const isActive = user.isActive !== undefined ? user.isActive : true;
        if (!isActive) {
            const response = {
                success: false,
                message: 'Account is deactivated',
                error: 'User account is not active'
            };
            return res.status(401).json(response);
        }
        req.user = user;
        return next();
    }
    catch (error) {
        logger_1.default.error('Authentication error:', error);
        const response = {
            success: false,
            message: 'Invalid token',
            error: 'Token verification failed'
        };
        return res.status(401).json(response);
    }
};
exports.authenticate = authenticate;
const authorize = (...roles) => {
    return (req, res, next) => {
        if (!req.user) {
            const response = {
                success: false,
                message: 'Authentication required',
                error: 'User not authenticated'
            };
            return res.status(401).json(response);
        }
        if (!req.user.role) {
            const response = {
                success: false,
                message: 'User role not found',
                error: 'User does not have a role assigned'
            };
            return res.status(403).json(response);
        }
        if (roles.length > 0 && !roles.includes(req.user.role.name)) {
            const response = {
                success: false,
                message: 'Insufficient permissions',
                error: `Access denied. Required roles: ${roles.join(', ')}`
            };
            return res.status(403).json(response);
        }
        return next();
    };
};
exports.authorize = authorize;
const optionalAuth = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return next();
        }
        const token = authHeader.substring(7);
        if (!token) {
            return next();
        }
        const payload = (0, jwt_1.verifyToken)(token);
        if (payload.type !== 'access') {
            return next();
        }
        const user = await database_1.prisma.user.findUnique({
            where: { id: payload.userId },
            include: {
                role: true
            }
        });
        const isActive = user.isActive !== undefined ? user.isActive : true;
        if (user && isActive) {
            req.user = user;
        }
        return next();
    }
    catch (error) {
        return next();
    }
};
exports.optionalAuth = optionalAuth;
//# sourceMappingURL=auth.js.map