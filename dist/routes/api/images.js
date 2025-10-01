"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const prisma_1 = require("../../lib/prisma");
const auth_1 = require("../../middleware/auth");
const errorHandler_1 = require("../../middleware/errorHandler");
const router = express_1.default.Router();
router.use((req, res, next) => {
    if (req.method === 'GET' && req.path.match(/^\/\d+$/)) {
        return next();
    }
    return (0, auth_1.authenticateToken)(req, res, next);
});
router.post('/jobs/:jobId', (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const { jobId } = req.params;
    const { imageData, originalName } = req.body;
    if (!imageData || !originalName) {
        return res.status(400).json({ error: 'Image data and original name are required' });
    }
    if (!imageData.startsWith('data:image/')) {
        return res.status(400).json({ error: 'Invalid image format. Expected base64 data URL.' });
    }
    const job = await prisma_1.prisma.job.findUnique({
        where: { id: parseInt(jobId) }
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
            jobId: parseInt(jobId)
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
}));
router.post('/reinstatements/:reinstatementId', (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const { reinstatementId } = req.params;
    const { imageData, originalName } = req.body;
    if (!imageData || !originalName) {
        return res.status(400).json({ error: 'Image data and original name are required' });
    }
    if (!imageData.startsWith('data:image/')) {
        return res.status(400).json({ error: 'Invalid image format. Expected base64 data URL.' });
    }
    const reinstatement = await prisma_1.prisma.reinstatement.findUnique({
        where: { id: parseInt(reinstatementId) }
    });
    if (!reinstatement) {
        return res.status(404).json({ error: 'Reinstatement not found' });
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
            reinstatementId: parseInt(reinstatementId)
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
            reinstatementId: image.reinstatementId,
            createdAt: image.createdAt,
            url: `/api/images/${image.id}`
        }
    });
}));
router.get('/:imageId', (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const { imageId } = req.params;
    const image = await prisma_1.prisma.image.findUnique({
        where: { id: parseInt(imageId) }
    });
    if (!image) {
        return res.status(404).json({ error: 'Image not found' });
    }
    res.set({
        'Content-Type': image.mimeType,
        'Content-Length': image.size.toString(),
        'Cache-Control': 'public, max-age=31536000'
    });
    const imageBuffer = Buffer.from(image.data, 'base64');
    res.send(imageBuffer);
}));
router.get('/jobs/:jobId', (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const { jobId } = req.params;
    const images = await prisma_1.prisma.image.findMany({
        where: { jobId: parseInt(jobId) },
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
}));
router.get('/reinstatements/:reinstatementId', (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const { reinstatementId } = req.params;
    const images = await prisma_1.prisma.image.findMany({
        where: { reinstatementId: parseInt(reinstatementId) },
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
}));
router.delete('/:imageId', (0, errorHandler_1.asyncHandler)(async (req, res) => {
    const { imageId } = req.params;
    const image = await prisma_1.prisma.image.findUnique({
        where: { id: parseInt(imageId) }
    });
    if (!image) {
        return res.status(404).json({ error: 'Image not found' });
    }
    await prisma_1.prisma.image.delete({
        where: { id: parseInt(imageId) }
    });
    res.json({ success: true, message: 'Image deleted successfully' });
}));
exports.default = router;
//# sourceMappingURL=images.js.map