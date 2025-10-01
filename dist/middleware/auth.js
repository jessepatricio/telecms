"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.optionalAuth = exports.requireManager = exports.requireAdmin = exports.requireRole = exports.authenticateToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const prisma_1 = require("../lib/prisma");
const JWT_SECRET = process.env['JWT_SECRET'] || 'fallback-secret';
const authenticateToken = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        const token = authHeader && authHeader.split(' ')[1];
        if (!token) {
            res.status(401).json({ error: 'Access token required' });
            return;
        }
        const decoded = jsonwebtoken_1.default.verify(token, JWT_SECRET);
        const user = await prisma_1.prisma.user.findUnique({
            where: { id: decoded.userId },
            include: { role: true }
        });
        if (!user) {
            res.status(401).json({ error: 'Invalid token - user not found' });
            return;
        }
        req.user = {
            userId: user.id,
            username: user.username,
            role: user.role?.name || 'user'
        };
        next();
    }
    catch (error) {
        console.error('Authentication error:', error);
        res.status(401).json({ error: 'Invalid token' });
    }
};
exports.authenticateToken = authenticateToken;
const requireRole = (roles) => {
    return (req, res, next) => {
        if (!req.user) {
            res.status(401).json({ error: 'Authentication required' });
            return;
        }
        if (!roles.includes(req.user.role)) {
            res.status(403).json({ error: 'Insufficient permissions' });
            return;
        }
        next();
    };
};
exports.requireRole = requireRole;
exports.requireAdmin = (0, exports.requireRole)(['admin']);
exports.requireManager = (0, exports.requireRole)(['admin', 'manager']);
const optionalAuth = async (req, _res, next) => {
    try {
        const authHeader = req.headers.authorization;
        const token = authHeader && authHeader.split(' ')[1];
        if (token) {
            const decoded = jsonwebtoken_1.default.verify(token, JWT_SECRET);
            const user = await prisma_1.prisma.user.findUnique({
                where: { id: decoded.userId },
                include: { role: true }
            });
            if (user) {
                req.user = {
                    userId: user.id,
                    username: user.username,
                    role: user.role?.name || 'user'
                };
            }
        }
    }
    catch (error) {
        console.warn('Optional auth failed:', error);
    }
    next();
};
exports.optionalAuth = optionalAuth;
//# sourceMappingURL=auth.js.map