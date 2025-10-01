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
        const jobs = await prisma_1.prisma.job.findMany({
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
                },
                images: {
                    select: {
                        id: true,
                        filename: true,
                        originalName: true,
                        mimeType: true,
                        size: true,
                        createdAt: true
                    }
                }
            }
        });
        res.json(jobs);
    }
    catch (error) {
        console.error('Error fetching jobs:', error);
        res.status(500).json({ error: 'Server error' });
    }
});
router.get('/:id', async (req, res) => {
    try {
        const job = await prisma_1.prisma.job.findUnique({
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
                },
                images: {
                    select: {
                        id: true,
                        filename: true,
                        originalName: true,
                        mimeType: true,
                        size: true,
                        createdAt: true
                    }
                }
            }
        });
        if (!job) {
            return res.status(404).json({ error: 'Job not found' });
        }
        res.json(job);
    }
    catch (error) {
        console.error('Error fetching job:', error);
        res.status(500).json({ error: 'Server error' });
    }
});
router.post('/', async (req, res) => {
    try {
        const { title, description, status, assignedTo, cabinet, dueDate, imageUrl } = req.body;
        const job = await prisma_1.prisma.job.create({
            data: {
                title,
                description,
                status: status || 'pending',
                assignedToId: assignedTo,
                cabinetId: cabinet,
                dueDate: dueDate ? new Date(dueDate) : null,
                imageUrl
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
        res.status(201).json(job);
    }
    catch (error) {
        console.error('Error creating job:', error);
        res.status(500).json({ error: 'Server error' });
    }
});
router.put('/:id', async (req, res) => {
    try {
        const { title, description, status, assignedTo, cabinet, dueDate, imageUrl } = req.body;
        const job = await prisma_1.prisma.job.update({
            where: { id: parseInt(req.params.id) },
            data: {
                title,
                description,
                status,
                assignedToId: assignedTo,
                cabinetId: cabinet,
                dueDate: dueDate ? new Date(dueDate) : null,
                imageUrl
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
        res.json(job);
    }
    catch (error) {
        if (error.code === 'P2025') {
            return res.status(404).json({ error: 'Job not found' });
        }
        console.error('Error updating job:', error);
        res.status(500).json({ error: 'Server error' });
    }
});
router.delete('/:id', async (req, res) => {
    try {
        await prisma_1.prisma.job.delete({
            where: { id: parseInt(req.params.id) }
        });
        res.json({ message: 'Job deleted successfully' });
    }
    catch (error) {
        if (error.code === 'P2025') {
            return res.status(404).json({ error: 'Job not found' });
        }
        console.error('Error deleting job:', error);
        res.status(500).json({ error: 'Server error' });
    }
});
router.post('/:id/images', async (req, res) => {
    try {
        const { id } = req.params;
        const { imageData, originalName } = req.body;
        if (!imageData || !originalName) {
            return res.status(400).json({ error: 'Image data and original name are required' });
        }
        if (!imageData.startsWith('data:image/')) {
            return res.status(400).json({ error: 'Invalid image format. Expected base64 data URL.' });
        }
        const job = await prisma_1.prisma.job.findUnique({
            where: { id: parseInt(id) }
        });
        if (!job) {
            return res.status(404).json({ error: 'Job not found' });
        }
        const base64Data = imageData.split(',')[1];
        const mimeType = imageData.split(';')[0].split(':')[1];
        const size = Math.round((base64Data.length * 3) / 4);
        if (size > 5 * 1024 * 1024) {
            return res.status(400).json({ error: 'File size exceeds 5MB limit' });
        }
        const timestamp = Date.now();
        const extension = originalName.split('.').pop() || 'jpg';
        const filename = `${timestamp}-${Math.random().toString(36).substring(2)}.${extension}`;
        const image = await prisma_1.prisma.image.create({
            data: {
                filename,
                originalName,
                mimeType,
                size,
                data: base64Data,
                jobId: parseInt(id)
            }
        });
        res.status(201).json({
            success: true,
            image: {
                id: image.id,
                filename: image.filename,
                originalName: image.originalName,
                mimeType: image.mimeType,
                size: image.size,
                jobId: image.jobId,
                createdAt: image.createdAt,
                url: `/api/images/${image.id}`
            }
        });
    }
    catch (error) {
        console.error('Error uploading image:', error);
        res.status(500).json({ error: 'Failed to upload image' });
    }
});
router.get('/:id/images', async (req, res) => {
    try {
        const { id } = req.params;
        const images = await prisma_1.prisma.image.findMany({
            where: { jobId: parseInt(id) },
            select: {
                id: true,
                filename: true,
                originalName: true,
                mimeType: true,
                size: true,
                createdAt: true
            },
            orderBy: { createdAt: 'desc' }
        });
        res.json({
            success: true,
            images: images.map(img => ({
                id: img.id,
                filename: img.filename,
                originalName: img.originalName,
                mimeType: img.mimeType,
                size: img.size,
                createdAt: img.createdAt,
                url: `/api/images/${img.id}`
            }))
        });
    }
    catch (error) {
        console.error('Error retrieving job images:', error);
        res.status(500).json({ error: 'Failed to retrieve images' });
    }
});
exports.default = router;
//# sourceMappingURL=jobs.js.map