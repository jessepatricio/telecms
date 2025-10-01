import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { prisma } from '../lib/prisma';

const JWT_SECRET = process.env['JWT_SECRET'] || 'fallback-secret';

export interface AuthenticatedRequest extends Request {
  user?: {
    userId: number;
    username: string;
    role: string;
  };
}

// JWT Authentication Middleware
export const authenticateToken = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      res.status(401).json({ error: 'Access token required' });
      return;
    }

    const decoded = jwt.verify(token, JWT_SECRET) as any;
    
    // Verify user still exists in database
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      include: { role: true }
    });

    if (!user) {
      res.status(401).json({ error: 'Invalid token - user not found' });
      return;
    }

    req.user = {
      userId: user.id,
      username: user.username,
      role: user.role?.name || 'user'
    };

    next();
  } catch (error) {
    console.error('Authentication error:', error);
    res.status(401).json({ error: 'Invalid token' });
  }
};

// Role-based authorization middleware
export const requireRole = (roles: string[]) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({ error: 'Authentication required' });
      return;
    }

    if (!roles.includes(req.user.role)) {
      res.status(403).json({ error: 'Insufficient permissions' });
      return;
    }

    next();
  };
};

// Admin only middleware
export const requireAdmin = requireRole(['admin']);

// Manager or Admin middleware
export const requireManager = requireRole(['admin', 'manager']);

// Optional authentication - doesn't fail if no token
export const optionalAuth = async (
  req: AuthenticatedRequest,
  _res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];

    if (token) {
      const decoded = jwt.verify(token, JWT_SECRET) as any;
      const user = await prisma.user.findUnique({
        where: { id: decoded.userId },
        include: { role: true }
      });

      if (user) {
        req.user = {
          userId: user.id,
          username: user.username,
          role: user.role?.name || 'user'
        };
      }
    }
  } catch (error) {
    // Silently fail for optional auth
    console.warn('Optional auth failed:', error);
  }

  next();
};
