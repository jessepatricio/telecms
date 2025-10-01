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

// Get dashboard statistics
router.get('/', async (req: express.Request, res: express.Response) => {
  try {
    const [
      totalUsers,
      totalTasks,
      totalJobs,
      totalCabinets,
      totalReinstatements,
      pendingTasks,
      pendingJobs,
      completedTasks,
      completedJobs
    ] = await Promise.all([
      prisma.user.count(),
      prisma.task.count(),
      prisma.job.count(),
      prisma.cabinet.count(),
      prisma.reinstatement.count(),
      prisma.task.count({ where: { status: 'pending' } }),
      prisma.job.count({ where: { status: 'pending' } }),
      prisma.task.count({ where: { status: 'completed' } }),
      prisma.job.count({ where: { status: 'completed' } })
    ]);

    const stats = {
      totalUsers,
      totalTasks,
      totalJobs,
      totalCabinets,
      totalReinstatements,
      pendingTasks,
      pendingJobs,
      completedTasks,
      completedJobs
    };

    res.json(stats);
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;
