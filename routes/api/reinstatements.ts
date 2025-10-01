import express from 'express';
import { prisma } from '../../lib/prisma';
import jwt from 'jsonwebtoken';

const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// Middleware to verify JWT token
const authenticateToken = (req: express.Request, res: express.Response, next: express.NextFunction) => {
  const token = req.headers.authorization?.replace('Bearer ', '');
  
  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as any;
    (req as any).user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Invalid token' });
  }
};

// Apply authentication middleware to all routes
router.use(authenticateToken);

// Get all reinstatements
router.get('/', async (req: express.Request, res: express.Response) => {
  try {
    const reinstatements = await prisma.reinstatement.findMany({
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
  } catch (error) {
    console.error('Error fetching reinstatements:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get reinstatement by ID
router.get('/:id', async (req: express.Request, res: express.Response) => {
  try {
    const reinstatement = await prisma.reinstatement.findUnique({
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
  } catch (error) {
    console.error('Error fetching reinstatement:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Create new reinstatement
router.post('/', async (req: express.Request, res: express.Response) => {
  try {
    const { title, description, status, assignedTo, cabinet, streetNo, streetName, length, width, file } = req.body;

    const reinstatement = await prisma.reinstatement.create({
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
  } catch (error) {
    console.error('Error creating reinstatement:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Update reinstatement
router.put('/:id', async (req: express.Request, res: express.Response) => {
  try {
    const { title, description, status, assignedTo, cabinet, streetNo, streetName, length, width, file } = req.body;

    const reinstatement = await prisma.reinstatement.update({
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
  } catch (error: any) {
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Reinstatement not found' });
    }
    console.error('Error updating reinstatement:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Delete reinstatement
router.delete('/:id', async (req: express.Request, res: express.Response) => {
  try {
    await prisma.reinstatement.delete({
      where: { id: parseInt(req.params.id) }
    });
    
    res.json({ message: 'Reinstatement deleted successfully' });
  } catch (error: any) {
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Reinstatement not found' });
    }
    console.error('Error deleting reinstatement:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;
