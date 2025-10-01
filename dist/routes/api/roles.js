"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const prisma_1 = require("../../lib/prisma");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const router = express_1.default.Router();
const JWT_SECRET = process.env['JWT_SECRET'] || 'fallback-secret';
const authenticateToken = (req, res, next) => {
    const token = req.headers.authorization?.replace('Bearer ', '');
    if (!token) {
        res.status(401).json({ error: 'No token provided' });
        return;
    }
    try {
        const decoded = jsonwebtoken_1.default.verify(token, JWT_SECRET);
        req.user = decoded;
        next();
    }
    catch (error) {
        res.status(401).json({ error: 'Invalid token' });
        return;
    }
};
router.use(authenticateToken);
router.get('/', async (_req, res) => {
    try {
        const roles = await prisma_1.prisma.role.findMany();
        res.json(roles);
    }
    catch (error) {
        console.error('Error fetching roles:', error);
        res.status(500).json({ error: 'Server error' });
    }
});
router.get('/:id', async (req, res) => {
    try {
        const role = await prisma_1.prisma.role.findUnique({
            where: { id: parseInt(req.params['id']) }
        });
        if (!role) {
            res.status(404).json({ error: 'Role not found' });
            return;
        }
        res.json(role);
    }
    catch (error) {
        console.error('Error fetching role:', error);
        res.status(500).json({ error: 'Server error' });
    }
});
router.post('/', async (req, res) => {
    try {
        const { name, description, permissions } = req.body;
        const role = await prisma_1.prisma.role.create({
            data: {
                name,
                description,
                permissions
            }
        });
        res.status(201).json(role);
    }
    catch (error) {
        console.error('Error creating role:', error);
        res.status(500).json({ error: 'Server error' });
    }
});
router.put('/:id', async (req, res) => {
    try {
        const { name, description, permissions } = req.body;
        const role = await prisma_1.prisma.role.update({
            where: { id: parseInt(req.params['id']) },
            data: {
                name,
                description,
                permissions
            }
        });
        res.json(role);
    }
    catch (error) {
        if (error.code === 'P2025') {
            res.status(404).json({ error: 'Role not found' });
            return;
        }
        console.error('Error updating role:', error);
        res.status(500).json({ error: 'Server error' });
    }
});
router.delete('/:id', async (req, res) => {
    try {
        await prisma_1.prisma.role.delete({
            where: { id: parseInt(req.params['id']) }
        });
        res.json({ message: 'Role deleted successfully' });
    }
    catch (error) {
        if (error.code === 'P2025') {
            res.status(404).json({ error: 'Role not found' });
            return;
        }
        console.error('Error deleting role:', error);
        res.status(500).json({ error: 'Server error' });
    }
});
exports.default = router;
//# sourceMappingURL=roles.js.map