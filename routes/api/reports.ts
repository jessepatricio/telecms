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

// Get reports data
router.get('/', async (req: express.Request, res: express.Response) => {
  try {
    const { type, startDate, endDate } = req.query;

    let whereClause: any = {};
    
    if (startDate && endDate) {
      whereClause.createdAt = {
        gte: new Date(startDate as string),
        lte: new Date(endDate as string)
      };
    }

    let data;
    
    switch (type) {
      case 'jobs':
        data = await prisma.job.findMany({
          where: whereClause,
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
        break;
      case 'tasks':
        data = await prisma.task.findMany({
          where: whereClause,
          include: {
            assignedTo: {
              select: {
                firstname: true,
                lastname: true
              }
            }
          }
        });
        break;
      case 'reinstatements':
        data = await prisma.reinstatement.findMany({
          where: whereClause,
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
        break;
      default:
        return res.status(400).json({ error: 'Invalid report type' });
    }

    res.json(data);
  } catch (error) {
    console.error('Error fetching reports:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;
