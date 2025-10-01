import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '@/utils/jwt';
import { prisma } from '@/utils/database';
import { AuthenticatedRequest, ApiResponse } from '@/types';
import logger from '@/utils/logger';

export const authenticate = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      const response: ApiResponse = {
        success: false,
        message: 'Access token is required',
        error: 'No authorization header provided'
      };
      return res.status(401).json(response);
    }

    const token = authHeader.substring(7); // Remove 'Bearer ' prefix
    
    if (!token) {
      const response: ApiResponse = {
        success: false,
        message: 'Access token is required',
        error: 'No token provided'
      };
      return res.status(401).json(response);
    }

    // Verify the token
    const payload = verifyToken(token);
    
    if (payload.type !== 'access') {
      const response: ApiResponse = {
        success: false,
        message: 'Invalid token type',
        error: 'Token must be an access token'
      };
      return res.status(401).json(response);
    }

    // Get user from database
    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
      include: {
        role: true
      }
    });

    if (!user) {
      const response: ApiResponse = {
        success: false,
        message: 'User not found',
        error: 'User associated with token does not exist'
      };
      return res.status(401).json(response);
    }

    // Check if user is active (handle case where isActive field might not exist yet)
    const isActive = (user as any).isActive !== undefined ? (user as any).isActive : true;
    if (!isActive) {
      const response: ApiResponse = {
        success: false,
        message: 'Account is deactivated',
        error: 'User account is not active'
      };
      return res.status(401).json(response);
    }

    // Attach user to request
    (req as AuthenticatedRequest).user = user;
    return next();
  } catch (error) {
    logger.error('Authentication error:', error);
    
    const response: ApiResponse = {
      success: false,
      message: 'Invalid token',
      error: 'Token verification failed'
    };
    return res.status(401).json(response);
  }
};

export const authorize = (...roles: string[]) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      const response: ApiResponse = {
        success: false,
        message: 'Authentication required',
        error: 'User not authenticated'
      };
      return res.status(401).json(response);
    }

    if (!(req.user as any).role) {
      const response: ApiResponse = {
        success: false,
        message: 'User role not found',
        error: 'User does not have a role assigned'
      };
      return res.status(403).json(response);
    }

    if (roles.length > 0 && !roles.includes((req.user as any).role.name)) {
      const response: ApiResponse = {
        success: false,
        message: 'Insufficient permissions',
        error: `Access denied. Required roles: ${roles.join(', ')}`
      };
      return res.status(403).json(response);
    }

    return next();
  };
};

export const optionalAuth = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return next();
    }

    const token = authHeader.substring(7);
    
    if (!token) {
      return next();
    }

    const payload = verifyToken(token);
    
    if (payload.type !== 'access') {
      return next();
    }

    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
      include: {
        role: true
      }
    });

    // Check if user is active (handle case where isActive field might not exist yet)
    const isActive = (user as any).isActive !== undefined ? (user as any).isActive : true;
    if (user && isActive) {
      (req as AuthenticatedRequest).user = user;
    }

    return next();
  } catch (error) {
    // For optional auth, we don't fail on token errors
    return next();
  }
};
