import express from 'express';
import { prisma } from '../../lib/prisma';
import jwt from 'jsonwebtoken';

const router = express.Router();

const JWT_SECRET = process.env['JWT_SECRET'] || 'your-secret-key';

// Middleware to verify JWT token
const authenticateToken = (req: express.Request, res: express.Response, next: express.NextFunction): void => {
  const token = req.headers.authorization?.replace('Bearer ', '');
  
  if (!token) {
    res.status(401).json({ error: 'No token provided' });
    return;
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as any;
    (req as any).user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
    return;
  }
};

// Apply authentication middleware to all routes
router.use(authenticateToken);

// Get all jobs
router.get('/', async (_req: express.Request, res: express.Response): Promise<void> => {
  try {
    const jobs = await prisma.job.findMany({
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
  } catch (error) {
    console.error('Error fetching jobs:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get job by ID
router.get('/:id', async (req: express.Request, res: express.Response): Promise<void> => {
  try {
    const job = await prisma.job.findUnique({
      where: { id: parseInt(req.params['id']!) },
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
      res.status(404).json({ error: 'Job not found' });
      return;
    }
    res.json(job);
  } catch (error) {
    console.error('Error fetching job:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Create new job
router.post('/', async (req: express.Request, res: express.Response) => {
  try {
    const { title, description, status, assignedTo, cabinet, dueDate, imageUrl } = req.body;

    const job = await prisma.job.create({
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
  } catch (error) {
    console.error('Error creating job:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Update job
router.put('/:id', async (req: express.Request, res: express.Response): Promise<void> => {
  try {
    const { title, description, status, assignedTo, cabinet, dueDate, imageUrl } = req.body;

    const job = await prisma.job.update({
      where: { id: parseInt(req.params['id']!) },
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
  } catch (error: any) {
    if (error.code === 'P2025') {
      res.status(404).json({ error: 'Job not found' });
      return;
    }
    console.error('Error updating job:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Delete job
router.delete('/:id', async (req: express.Request, res: express.Response): Promise<void> => {
  try {
    await prisma.job.delete({
      where: { id: parseInt(req.params['id']!) }
    });
    
    res.json({ message: 'Job deleted successfully' });
  } catch (error: any) {
    if (error.code === 'P2025') {
      res.status(404).json({ error: 'Job not found' });
      return;
    }
    console.error('Error deleting job:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Upload image for a job
router.post('/:id/images', async (req: express.Request, res: express.Response): Promise<void> => {
  try {
    const id = req.params['id']!;
    const { imageData, originalName } = req.body;

    if (!imageData || !originalName) {
      res.status(400).json({ error: 'Image data and original name are required' });
      return;
    }

    // Basic validation for base64 image
    if (!imageData.startsWith('data:image/')) {
      res.status(400).json({ error: 'Invalid image format. Expected base64 data URL.' });
      return;
    }

    // Check if job exists
    const job = await prisma.job.findUnique({
      where: { id: parseInt(id) }
    });
    if (!job) {
      res.status(404).json({ error: 'Job not found' });
      return;
    }

    // Extract base64 data
    const base64Data = imageData.split(',')[1];
    const mimeType = imageData.split(';')[0].split(':')[1];
    const size = Math.round((base64Data.length * 3) / 4);

    // Validate file size (5MB max)
    if (size > 5 * 1024 * 1024) {
      res.status(400).json({ error: 'File size exceeds 5MB limit' });
      return;
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
        jobId: parseInt(id!)
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
  } catch (error) {
    console.error('Error uploading image:', error);
    res.status(500).json({ error: 'Failed to upload image' });
  }
});

// Get images for a job
router.get('/:id/images', async (req: express.Request, res: express.Response): Promise<void> => {
  try {
    const id = req.params['id']!;
    
    const images = await prisma.image.findMany({
      where: { jobId: parseInt(id!) },
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
  } catch (error) {
    console.error('Error retrieving job images:', error);
    res.status(500).json({ error: 'Failed to retrieve images' });
  }
});

export default router;
