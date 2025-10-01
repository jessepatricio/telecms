import express from 'express';
import { prisma } from '../../lib/prisma';
import jwt from 'jsonwebtoken';

const router = express.Router();

const JWT_SECRET = process.env['JWT_SECRET'] || 'fallback-secret';

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

// Get all cabinets
router.get('/', async (_req: express.Request, res: express.Response): Promise<void> => {
  try {
    const cabinets = await prisma.cabinet.findMany();
    res.json(cabinets);
  } catch (error) {
    console.error('Error fetching cabinets:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get cabinet by ID
router.get('/:id', async (req: express.Request, res: express.Response): Promise<void> => {
  try {
    const cabinet = await prisma.cabinet.findUnique({
      where: { id: parseInt(req.params['id']!) }
    });
    if (!cabinet) {
      res.status(404).json({ error: 'Cabinet not found' });
      return;
    }
    res.json(cabinet);
  } catch (error) {
    console.error('Error fetching cabinet:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Create new cabinet
router.post('/', async (req: express.Request, res: express.Response): Promise<void> => {
  try {
    const { name, location, status } = req.body;

    const cabinet = await prisma.cabinet.create({
      data: {
        name,
        location,
        status: status || 'active'
      }
    });
    res.status(201).json(cabinet);
  } catch (error) {
    console.error('Error creating cabinet:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Update cabinet
router.put('/:id', async (req: express.Request, res: express.Response): Promise<void> => {
  try {
    const { name, location, status } = req.body;

    const cabinet = await prisma.cabinet.update({
      where: { id: parseInt(req.params['id']!) },
      data: {
        name,
        location,
        status
      }
    });

    res.json(cabinet);
  } catch (error: any) {
    if (error.code === 'P2025') {
      res.status(404).json({ error: 'Cabinet not found' });
      return;
    }
    console.error('Error updating cabinet:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Delete cabinet
router.delete('/:id', async (req: express.Request, res: express.Response): Promise<void> => {
  try {
    await prisma.cabinet.delete({
      where: { id: parseInt(req.params['id']!) }
    });
    
    res.json({ message: 'Cabinet deleted successfully' });
  } catch (error: any) {
    if (error.code === 'P2025') {
      res.status(404).json({ error: 'Cabinet not found' });
      return;
    }
    console.error('Error deleting cabinet:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;
