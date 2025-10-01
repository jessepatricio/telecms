import express from 'express';
import { prisma } from '../../lib/prisma';
import { authenticateToken } from '../../middleware/auth';
import { asyncHandler } from '../../middleware/errorHandler';

const router = express.Router();

// Apply authentication middleware to all routes except image retrieval
router.use((req, res, next) => {
  if (req.method === 'GET' && req.path.match(/^\/\d+$/)) {
    // Skip auth for direct image access by ID
    return next();
  }
  return authenticateToken(req, res, next);
});

// Upload image for a job
router.post('/jobs/:jobId', asyncHandler(async (req: express.Request, res: express.Response) => {
  const { jobId } = req.params;
  const { imageData, originalName } = req.body;

  if (!imageData || !originalName) {
    return res.status(400).json({ error: 'Image data and original name are required' });
  }

  // Basic validation for base64 image
  if (!imageData.startsWith('data:image/')) {
    return res.status(400).json({ error: 'Invalid image format. Expected base64 data URL.' });
  }

  // Check if job exists
  const job = await prisma.job.findUnique({
    where: { id: parseInt(jobId) }
  });
  if (!job) {
    return res.status(404).json({ error: 'Job not found' });
  }

  // Extract base64 data
  const base64Data = imageData.split(',')[1];
  const mimeType = imageData.split(';')[0].split(':')[1];
  const size = Math.round((base64Data.length * 3) / 4);

  // Validate file size (5MB max)
  if (size > 5 * 1024 * 1024) {
    return res.status(400).json({ error: 'File size exceeds 5MB limit' });
  }

  // Generate unique filename
  const timestamp = Date.now();
  const extension = originalName.split('.').pop() || 'jpg';
  const filename = `${timestamp}-${Math.random().toString(36).substring(2)}.${extension}`;

  // Save image to database
  const image = await prisma.image.create({
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

// Upload image for a reinstatement
router.post('/reinstatements/:reinstatementId', asyncHandler(async (req: express.Request, res: express.Response) => {
  const { reinstatementId } = req.params;
  const { imageData, originalName } = req.body;

  if (!imageData || !originalName) {
    return res.status(400).json({ error: 'Image data and original name are required' });
  }

  // Basic validation for base64 image
  if (!imageData.startsWith('data:image/')) {
    return res.status(400).json({ error: 'Invalid image format. Expected base64 data URL.' });
  }

  // Check if reinstatement exists
  const reinstatement = await prisma.reinstatement.findUnique({
    where: { id: parseInt(reinstatementId) }
  });
  if (!reinstatement) {
    return res.status(404).json({ error: 'Reinstatement not found' });
  }

  // Extract base64 data
  const base64Data = imageData.split(',')[1];
  const mimeType = imageData.split(';')[0].split(':')[1];
  const size = Math.round((base64Data.length * 3) / 4);

  // Validate file size (5MB max)
  if (size > 5 * 1024 * 1024) {
    return res.status(400).json({ error: 'File size exceeds 5MB limit' });
  }

  // Generate unique filename
  const timestamp = Date.now();
  const extension = originalName.split('.').pop() || 'jpg';
  const filename = `${timestamp}-${Math.random().toString(36).substring(2)}.${extension}`;

  // Save image to database
  const image = await prisma.image.create({
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

// Get image by ID
router.get('/:imageId', asyncHandler(async (req: express.Request, res: express.Response) => {
  const { imageId } = req.params;
  
  const image = await prisma.image.findUnique({
    where: { id: parseInt(imageId) }
  });
  
  if (!image) {
    return res.status(404).json({ error: 'Image not found' });
  }

  // Set appropriate headers
  res.set({
    'Content-Type': image.mimeType,
    'Content-Length': image.size.toString(),
    'Cache-Control': 'public, max-age=31536000' // 1 year cache
  });

  // Convert base64 to buffer and send
  const imageBuffer = Buffer.from(image.data, 'base64');
  res.send(imageBuffer);
}));

// Get images for a job
router.get('/jobs/:jobId', asyncHandler(async (req: express.Request, res: express.Response) => {
  const { jobId } = req.params;
  
  const images = await prisma.image.findMany({
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

// Get images for a reinstatement
router.get('/reinstatements/:reinstatementId', asyncHandler(async (req: express.Request, res: express.Response) => {
  const { reinstatementId } = req.params;
  
  const images = await prisma.image.findMany({
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

// Delete image
router.delete('/:imageId', asyncHandler(async (req: express.Request, res: express.Response) => {
  const { imageId } = req.params;
  
  const image = await prisma.image.findUnique({
    where: { id: parseInt(imageId) }
  });
  
  if (!image) {
    return res.status(404).json({ error: 'Image not found' });
  }

  await prisma.image.delete({
    where: { id: parseInt(imageId) }
  });
  
  res.json({ success: true, message: 'Image deleted successfully' });
}));

export default router;
