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
        const cabinets = await prisma_1.prisma.cabinet.findMany();
        res.json(cabinets);
    }
    catch (error) {
        console.error('Error fetching cabinets:', error);
        res.status(500).json({ error: 'Server error' });
    }
});
router.get('/:id', async (req, res) => {
    try {
        const cabinet = await prisma_1.prisma.cabinet.findUnique({
            where: { id: parseInt(req.params['id']) }
        });
        if (!cabinet) {
            res.status(404).json({ error: 'Cabinet not found' });
            return;
        }
        res.json(cabinet);
    }
    catch (error) {
        console.error('Error fetching cabinet:', error);
        res.status(500).json({ error: 'Server error' });
    }
});
router.post('/', async (req, res) => {
    try {
        const { name, location, status } = req.body;
        const cabinet = await prisma_1.prisma.cabinet.create({
            data: {
                name,
                location,
                status: status || 'active'
            }
        });
        res.status(201).json(cabinet);
    }
    catch (error) {
        console.error('Error creating cabinet:', error);
        res.status(500).json({ error: 'Server error' });
    }
});
router.put('/:id', async (req, res) => {
    try {
        const { name, location, status } = req.body;
        const cabinet = await prisma_1.prisma.cabinet.update({
            where: { id: parseInt(req.params['id']) },
            data: {
                name,
                location,
                status
            }
        });
        res.json(cabinet);
    }
    catch (error) {
        if (error.code === 'P2025') {
            res.status(404).json({ error: 'Cabinet not found' });
            return;
        }
        console.error('Error updating cabinet:', error);
        res.status(500).json({ error: 'Server error' });
    }
});
router.delete('/:id', async (req, res) => {
    try {
        await prisma_1.prisma.cabinet.delete({
            where: { id: parseInt(req.params['id']) }
        });
        res.json({ message: 'Cabinet deleted successfully' });
    }
    catch (error) {
        if (error.code === 'P2025') {
            res.status(404).json({ error: 'Cabinet not found' });
            return;
        }
        console.error('Error deleting cabinet:', error);
        res.status(500).json({ error: 'Server error' });
    }
});
exports.default = router;
//# sourceMappingURL=cabinets.js.map