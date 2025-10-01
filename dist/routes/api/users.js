"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const prisma_1 = require("../../lib/prisma");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const auth_1 = require("../../middleware/auth");
const validation_1 = require("../../middleware/validation");
const errorHandler_1 = require("../../middleware/errorHandler");
const router = express_1.default.Router();
router.use(auth_1.authenticateToken);
router.get('/', validation_1.validatePagination, (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const { page = 1, limit = 10 } = req.query;
    const offset = (Number(page) - 1) * Number(limit);
    const [users, total] = await Promise.all([
        prisma_1.prisma.user.findMany({
            include: { role: true },
            skip: offset,
            take: Number(limit),
            orderBy: { createdAt: 'desc' }
        }),
        prisma_1.prisma.user.count()
    ]);
    return res.json({
        users,
        pagination: {
            page: Number(page),
            limit: Number(limit),
            total,
            pages: Math.ceil(total / Number(limit))
        }
    });
}));
router.get('/:id', validation_1.validateId, (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const userId = parseInt(req.params['id']);
    const user = await prisma_1.prisma.user.findUnique({
        where: { id: userId },
        include: { role: true }
    });
    if (!user) {
        return res.status(404).json({ error: 'User not found' });
    }
    return res.json(user);
}));
router.post('/', auth_1.requireAdmin, validation_1.validateUser, (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const { username, firstname, lastname, email, password, role } = req.body;
    const existingUser = await prisma_1.prisma.user.findUnique({ where: { username } });
    if (existingUser) {
        return res.status(400).json({ error: 'Username already exists' });
    }
    const existingEmail = await prisma_1.prisma.user.findUnique({ where: { email } });
    if (existingEmail) {
        return res.status(400).json({ error: 'Email already exists' });
    }
    const hashedPassword = await bcryptjs_1.default.hash(password, 12);
    const user = await prisma_1.prisma.user.create({
        data: {
            username,
            firstname,
            lastname,
            email,
            password: hashedPassword,
            roleId: role
        },
        include: { role: true }
    });
    return res.status(201).json(user);
}));
router.put('/:id', validation_1.validateId, validation_1.validateUserUpdate, (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const { username, firstname, lastname, email, role, password } = req.body;
    const userId = parseInt(req.params['id']);
    const updateData = { username, firstname, lastname, email, roleId: role };
    if (password) {
        updateData.password = await bcryptjs_1.default.hash(password, 12);
    }
    const user = await prisma_1.prisma.user.update({
        where: { id: userId },
        data: updateData,
        include: { role: true }
    });
    return res.json(user);
}));
router.delete('/:id', auth_1.requireAdmin, validation_1.validateId, (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const userId = parseInt(req.params['id']);
    await prisma_1.prisma.user.delete({
        where: { id: userId }
    });
    return res.json({ message: 'User deleted successfully' });
}));
exports.default = router;
//# sourceMappingURL=users.js.map