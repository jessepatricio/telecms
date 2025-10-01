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

// Get all roles
router.get('/', async (_req: express.Request, res: express.Response): Promise<void> => {
  try {
    const roles = await prisma.role.findMany();
    res.json(roles);
  } catch (error) {
    console.error('Error fetching roles:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get role by ID
router.get('/:id', async (req: express.Request, res: express.Response): Promise<void> => {
  try {
    const role = await prisma.role.findUnique({
      where: { id: parseInt(req.params['id']!) }
    });
    if (!role) {
      res.status(404).json({ error: 'Role not found' });
      return;
    }
    res.json(role);
  } catch (error) {
    console.error('Error fetching role:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Create new role
router.post('/', async (req: express.Request, res: express.Response): Promise<void> => {
  try {
    const { name, description, permissions } = req.body;

    const role = await prisma.role.create({
      data: {
        name,
        description,
        permissions
      }
    });
    res.status(201).json(role);
  } catch (error) {
    console.error('Error creating role:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Update role
router.put('/:id', async (req: express.Request, res: express.Response): Promise<void> => {
  try {
    const { name, description, permissions } = req.body;

    const role = await prisma.role.update({
      where: { id: parseInt(req.params['id']!) },
      data: {
        name,
        description,
        permissions
      }
    });

    res.json(role);
  } catch (error: any) {
    if (error.code === 'P2025') {
      res.status(404).json({ error: 'Role not found' });
      return;
    }
    console.error('Error updating role:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Delete role
router.delete('/:id', async (req: express.Request, res: express.Response): Promise<void> => {
  try {
    await prisma.role.delete({
      where: { id: parseInt(req.params['id']!) }
    });
    
    res.json({ message: 'Role deleted successfully' });
  } catch (error: any) {
    if (error.code === 'P2025') {
      res.status(404).json({ error: 'Role not found' });
      return;
    }
    console.error('Error deleting role:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;
