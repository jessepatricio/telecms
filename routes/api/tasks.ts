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

// Get all tasks
router.get('/', async (_req: express.Request, res: express.Response): Promise<void> => {
  try {
    const tasks = await prisma.task.findMany({
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
  } catch (error) {
    console.error('Error fetching tasks:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get task by ID
router.get('/:id', async (req: express.Request, res: express.Response): Promise<void> => {
  try {
    const task = await prisma.task.findUnique({
      where: { id: parseInt(req.params['id']!) },
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
  } catch (error) {
    console.error('Error fetching task:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Create new task
router.post('/', async (req: express.Request, res: express.Response): Promise<void> => {
  try {
    const { title, description, status, assignedTo, dueDate } = req.body;

    const task = await prisma.task.create({
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
  } catch (error) {
    console.error('Error creating task:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Update task
router.put('/:id', async (req: express.Request, res: express.Response): Promise<void> => {
  try {
    const { title, description, status, assignedTo, dueDate } = req.body;

    const task = await prisma.task.update({
      where: { id: parseInt(req.params['id']!) },
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
  } catch (error: any) {
    if (error.code === 'P2025') {
      res.status(404).json({ error: 'Task not found' });
      return;
    }
    console.error('Error updating task:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Delete task
router.delete('/:id', async (req: express.Request, res: express.Response): Promise<void> => {
  try {
    await prisma.task.delete({
      where: { id: parseInt(req.params['id']!) }
    });
    
    res.json({ message: 'Task deleted successfully' });
  } catch (error: any) {
    if (error.code === 'P2025') {
      res.status(404).json({ error: 'Task not found' });
      return;
    }
    console.error('Error deleting task:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;
