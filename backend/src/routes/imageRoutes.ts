import { Router, Response } from 'express';
import path from 'path';
import { uploadImage, validateUploadedFile } from '../middleware/upload';
import { authenticate as authMiddleware } from '../middleware/auth';
import { AppError } from '../middleware/errorHandler';
import logger from '../utils/logger';
import { AuthenticatedRequest } from '../types';

const router = Router();

/**
 * @swagger
 * /api/images/upload:
 *   post:
 *     summary: Upload an image
 *     description: Upload an image file with security validation
 *     tags: [Images]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               image:
 *                 type: string
 *                 format: binary
 *                 description: Image file to upload
 *               type:
 *                 type: string
 *                 enum: [job, reinstatement, profile]
 *                 description: Type of image being uploaded
 *     responses:
 *       200:
 *         description: Image uploaded successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *                   properties:
 *                     url:
 *                       type: string
 *                     filename:
 *                       type: string
 *                     size:
 *                       type: number
 *       400:
 *         description: Bad request - invalid file or validation error
 *       401:
 *         description: Unauthorized - invalid or missing token
 *       413:
 *         description: File too large
 */
router.post('/upload', authMiddleware, uploadImage, async (req: AuthenticatedRequest, res: Response) => {
  try {
    // Validate the uploaded file
    if (!req.file) {
      throw new AppError('No file uploaded', 400);
    }
    validateUploadedFile(req.file);

    const { type = 'general' } = req.body;
    const file = req.file!;

    // Additional security: Check file content (basic magic number check)
    const allowedImageTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (allowedImageTypes.includes(file.mimetype)) {
      // Check for image magic numbers
      const magicNumbers = {
        'image/jpeg': [0xFF, 0xD8, 0xFF],
        'image/png': [0x89, 0x50, 0x4E, 0x47],
        'image/gif': [0x47, 0x49, 0x46],
        'image/webp': [0x52, 0x49, 0x46, 0x46]
      };

      const expectedMagic = magicNumbers[file.mimetype as keyof typeof magicNumbers];
      if (expectedMagic) {
        const fileHeader = file.buffer.slice(0, expectedMagic.length);
        const isValidMagic = expectedMagic.every((byte, index) => fileHeader[index] === byte);
        
        if (!isValidMagic) {
          throw new AppError('File content does not match declared type', 400);
        }
      }
    }

    // Generate secure filename
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(2, 15);
    const extension = path.extname(file.originalname);
    const secureFilename = `${type}_${timestamp}_${randomString}${extension}`;

    // In a real application, you would save the file to a secure location
    // For now, we'll just return the file info
    const fileInfo = {
      url: `/uploads/${secureFilename}`,
      filename: secureFilename,
      originalName: file.originalname,
      size: file.size,
      mimetype: file.mimetype,
      type: type
    };

    logger.info('Image uploaded successfully', {
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

  } catch (error) {
    logger.error('Image upload failed:', {
      error: error instanceof Error ? error.message : 'Unknown error',
      userId: req.user?.id,
      ip: req.ip
    });

    if (error instanceof AppError) {
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

/**
 * @swagger
 * /api/images/health:
 *   get:
 *     summary: Check image service health
 *     description: Simple health check for the image service
 *     tags: [Images]
 *     responses:
 *       200:
 *         description: Service is healthy
 */
router.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'Image service is healthy',
    timestamp: new Date().toISOString()
  });
});

export default router;
