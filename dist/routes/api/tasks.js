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
        const tasks = await prisma_1.prisma.task.findMany({
            include: {
                assignedTo: {
                    select: {
                        firstname: true,
                        lastname: true
                    }
                }
            }
        });
        res.json(tasks);
    }
    catch (error) {
        console.error('Error fetching tasks:', error);
        res.status(500).json({ error: 'Server error' });
    }
});
router.get('/:id', async (req, res) => {
    try {
        const task = await prisma_1.prisma.task.findUnique({
            where: { id: parseInt(req.params['id']) },
            include: {
                assignedTo: {
                    select: {
                        firstname: true,
                        lastname: true
                    }
                }
            }
        });
        if (!task) {
            res.status(404).json({ error: 'Task not found' });
            return;
        }
        res.json(task);
    }
    catch (error) {
        console.error('Error fetching task:', error);
        res.status(500).json({ error: 'Server error' });
    }
});
router.post('/', async (req, res) => {
    try {
        const { title, description, status, assignedTo, dueDate } = req.body;
        const task = await prisma_1.prisma.task.create({
            data: {
                title,
                description,
                status: status || 'pending',
                assignedToId: assignedTo,
                dueDate: dueDate ? new Date(dueDate) : null
            },
            include: {
                assignedTo: {
                    select: {
                        firstname: true,
                        lastname: true
                    }
                }
            }
        });
        res.status(201).json(task);
    }
    catch (error) {
        console.error('Error creating task:', error);
        res.status(500).json({ error: 'Server error' });
    }
});
router.put('/:id', async (req, res) => {
    try {
        const { title, description, status, assignedTo, dueDate } = req.body;
        const task = await prisma_1.prisma.task.update({
            where: { id: parseInt(req.params['id']) },
            data: {
                title,
                description,
                status,
                assignedToId: assignedTo,
                dueDate: dueDate ? new Date(dueDate) : null
            },
            include: {
                assignedTo: {
                    select: {
                        firstname: true,
                        lastname: true
                    }
                }
            }
        });
        res.json(task);
    }
    catch (error) {
        if (error.code === 'P2025') {
            res.status(404).json({ error: 'Task not found' });
            return;
        }
        console.error('Error updating task:', error);
        res.status(500).json({ error: 'Server error' });
    }
});
router.delete('/:id', async (req, res) => {
    try {
        await prisma_1.prisma.task.delete({
            where: { id: parseInt(req.params['id']) }
        });
        res.json({ message: 'Task deleted successfully' });
    }
    catch (error) {
        if (error.code === 'P2025') {
            res.status(404).json({ error: 'Task not found' });
            return;
        }
        console.error('Error deleting task:', error);
        res.status(500).json({ error: 'Server error' });
    }
});
exports.default = router;
//# sourceMappingURL=tasks.js.map