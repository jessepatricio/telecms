"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const prisma_1 = require("../../lib/prisma");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const validation_1 = require("../../middleware/validation");
const errorHandler_1 = require("../../middleware/errorHandler");
const router = express_1.default.Router();
router.post('/login', validation_1.validateLogin, (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const { username, password } = req.body;
    const user = await prisma_1.prisma.user.findUnique({
        where: { username },
        include: { role: true }
    });
    if (!user) {
        return res.status(401).json({ error: 'Invalid credentials' });
    }
    const isMatch = await bcryptjs_1.default.compare(password, user.password);
    if (!isMatch) {
        return res.status(401).json({ error: 'Invalid credentials' });
    }
    const token = jsonwebtoken_1.default.sign({
        userId: user.id,
        username: user.username,
        role: user.role?.name || 'user'
    }, 'fallback-secret', { expiresIn: '24h' });
    return res.json({
        token,
        user: {
            _id: user.id,
            username: user.username,
            firstname: user.firstname,
            lastname: user.lastname,
            email: user.email,
            role: user.role?.name || 'user'
        }
    });
}));
router.get('/verify', (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const token = req.headers.authorization?.replace('Bearer ', '');
    if (!token) {
        return res.status(401).json({ error: 'No token provided' });
    }
    const decoded = jsonwebtoken_1.default.verify(token, 'fallback-secret');
    const user = await prisma_1.prisma.user.findUnique({
        where: { id: decoded.userId },
        include: { role: true }
    });
    if (!user) {
        return res.status(401).json({ error: 'Invalid token' });
    }
    return res.json({
        user: {
            _id: user.id,
            username: user.username,
            firstname: user.firstname,
            lastname: user.lastname,
            email: user.email,
            role: user.role?.name || 'user'
        }
    });
}));
exports.default = router;
//# sourceMappingURL=auth.js.map