"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const path_1 = __importDefault(require("path"));
const upload_1 = require("../middleware/upload");
const auth_1 = require("../middleware/auth");
const errorHandler_1 = require("../middleware/errorHandler");
const logger_1 = __importDefault(require("../utils/logger"));
const router = (0, express_1.Router)();
router.post('/upload', auth_1.authenticate, upload_1.uploadImage, async (req, res) => {
    try {
        if (!req.file) {
            throw new errorHandler_1.AppError('No file uploaded', 400);
        }
        (0, upload_1.validateUploadedFile)(req.file);
        const { type = 'general' } = req.body;
        const file = req.file;
        const allowedImageTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
        if (allowedImageTypes.includes(file.mimetype)) {
            const magicNumbers = {
                'image/jpeg': [0xFF, 0xD8, 0xFF],
                'image/png': [0x89, 0x50, 0x4E, 0x47],
                'image/gif': [0x47, 0x49, 0x46],
                'image/webp': [0x52, 0x49, 0x46, 0x46]
            };
            const expectedMagic = magicNumbers[file.mimetype];
            if (expectedMagic) {
                const fileHeader = file.buffer.slice(0, expectedMagic.length);
                const isValidMagic = expectedMagic.every((byte, index) => fileHeader[index] === byte);
                if (!isValidMagic) {
                    throw new errorHandler_1.AppError('File content does not match declared type', 400);
                }
            }
        }
        const timestamp = Date.now();
        const randomString = Math.random().toString(36).substring(2, 15);
        const extension = path_1.default.extname(file.originalname);
        const secureFilename = `${type}_${timestamp}_${randomString}${extension}`;
        const fileInfo = {
            url: `/uploads/${secureFilename}`,
            filename: secureFilename,
            originalName: file.originalname,
            size: file.size,
            mimetype: file.mimetype,
            type: type
        };
        logger_1.default.info('Image uploaded successfully', {
            userId: req.user?.id,
            filename: secureFilename,
            size: file.size,
            type: type,
            ip: req.ip
        });
        return res.json({
            success: true,
            message: 'Image uploaded successfully',
            data: fileInfo
        });
    }
    catch (error) {
        logger_1.default.error('Image upload failed:', {
            error: error instanceof Error ? error.message : 'Unknown error',
            userId: req.user?.id,
            ip: req.ip
        });
        if (error instanceof errorHandler_1.AppError) {
            return res.status(error.statusCode).json({
                success: false,
                message: error.message,
                error: 'Image upload failed'
            });
        }
        return res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: 'Image upload failed'
        });
    }
});
router.get('/health', (req, res) => {
    res.json({
        success: true,
        message: 'Image service is healthy',
        timestamp: new Date().toISOString()
    });
});
exports.default = router;
//# sourceMappingURL=imageRoutes.js.map