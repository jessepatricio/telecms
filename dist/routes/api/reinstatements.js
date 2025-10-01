"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const prisma_1 = require("../../lib/prisma");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const router = express_1.default.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
const authenticateToken = (req, res, next) => {
    const token = req.headers.authorization?.replace('Bearer ', '');
    if (!token) {
        return res.status(401).json({ error: 'No token provided' });
    }
    try {
        const decoded = jsonwebtoken_1.default.verify(token, JWT_SECRET);
        req.user = decoded;
        next();
    }
    catch (error) {
        return res.status(401).json({ error: 'Invalid token' });
    }
};
router.use(authenticateToken);
router.get('/', async (req, res) => {
    try {
        const reinstatements = await prisma_1.prisma.reinstatement.findMany({
            include: {
                assignedTo: {
                    select: {
                        firstname: true,
                        lastname: true
                    }
                },
                cabinet: {
                    select: {
                        name: true,
                        location: true
                    }
                }
            }
        });
        res.json(reinstatements);
    }
    catch (error) {
        console.error('Error fetching reinstatements:', error);
        res.status(500).json({ error: 'Server error' });
    }
});
router.get('/:id', async (req, res) => {
    try {
        const reinstatement = await prisma_1.prisma.reinstatement.findUnique({
            where: { id: parseInt(req.params.id) },
            include: {
                assignedTo: {
                    select: {
                        firstname: true,
                        lastname: true
                    }
                },
                cabinet: {
                    select: {
                        name: true,
                        location: true
                    }
                }
            }
        });
        if (!reinstatement) {
            return res.status(404).json({ error: 'Reinstatement not found' });
        }
        res.json(reinstatement);
    }
    catch (error) {
        console.error('Error fetching reinstatement:', error);
        res.status(500).json({ error: 'Server error' });
    }
});
router.post('/', async (req, res) => {
    try {
        const { title, description, status, assignedTo, cabinet, streetNo, streetName, length, width, file } = req.body;
        const reinstatement = await prisma_1.prisma.reinstatement.create({
            data: {
                title,
                description,
                status: status || 'pending',
                assignedToId: assignedTo,
                cabinetId: cabinet,
                streetNo,
                streetName,
                length: length ? parseFloat(length) : null,
                width: width ? parseFloat(width) : null,
                file
            },
            include: {
                assignedTo: {
                    select: {
                        firstname: true,
                        lastname: true
                    }
                },
                cabinet: {
                    select: {
                        name: true,
                        location: true
                    }
                }
            }
        });
        res.status(201).json(reinstatement);
    }
    catch (error) {
        console.error('Error creating reinstatement:', error);
        res.status(500).json({ error: 'Server error' });
    }
});
router.put('/:id', async (req, res) => {
    try {
        const { title, description, status, assignedTo, cabinet, streetNo, streetName, length, width, file } = req.body;
        const reinstatement = await prisma_1.prisma.reinstatement.update({
            where: { id: parseInt(req.params.id) },
            data: {
                title,
                description,
                status,
                assignedToId: assignedTo,
                cabinetId: cabinet,
                streetNo,
                streetName,
                length: length ? parseFloat(length) : null,
                width: width ? parseFloat(width) : null,
                file
            },
            include: {
                assignedTo: {
                    select: {
                        firstname: true,
                        lastname: true
                    }
                },
                cabinet: {
                    select: {
                        name: true,
                        location: true
                    }
                }
            }
        });
        res.json(reinstatement);
    }
    catch (error) {
        if (error.code === 'P2025') {
            return res.status(404).json({ error: 'Reinstatement not found' });
        }
        console.error('Error updating reinstatement:', error);
        res.status(500).json({ error: 'Server error' });
    }
});
router.delete('/:id', async (req, res) => {
    try {
        await prisma_1.prisma.reinstatement.delete({
            where: { id: parseInt(req.params.id) }
        });
        res.json({ message: 'Reinstatement deleted successfully' });
    }
    catch (error) {
        if (error.code === 'P2025') {
            return res.status(404).json({ error: 'Reinstatement not found' });
        }
        console.error('Error deleting reinstatement:', error);
        res.status(500).json({ error: 'Server error' });
    }
});
exports.default = router;
//# sourceMappingURL=reinstatements.js.map