import { Request, Response, NextFunction } from 'express';
import { authService } from '@/services/authService';
import { AuthenticatedRequest, ApiResponse, LoginRequest, RegisterRequest } from '@/types';
import { asyncHandler } from '@/middleware/errorHandler';
import { prisma } from '@/utils/database';
import logger from '@/utils/logger';

export class AuthController {
  login = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const credentials: LoginRequest = req.body;

    const result = await authService.login(credentials);

    const response: ApiResponse = {
      success: true,
      message: 'Login successful',
      data: result
    };

    return res.status(200).json(response);
  });

  register = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const userData: RegisterRequest = req.body;

    const result = await authService.register(userData);

    const response: ApiResponse = {
      success: true,
      message: 'Registration successful',
      data: result
    };

    return res.status(201).json(response);
  });

  refreshToken = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      const response: ApiResponse = {
        success: false,
        message: 'Refresh token is required',
        error: 'No refresh token provided'
      };
      return res.status(400).json(response);
    }

    const tokens = await authService.refreshToken(refreshToken);

    const response: ApiResponse = {
      success: true,
      message: 'Token refreshed successfully',
      data: tokens
    };

    return res.status(200).json(response);
  });

  verifyToken = asyncHandler(async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    // If we reach here, the token is valid (middleware already verified it)
    const { password, ...userWithoutPassword } = req.user!;

    const response: ApiResponse = {
      success: true,
      message: 'Token is valid',
      data: { user: userWithoutPassword }
    };

    return res.status(200).json(response);
  });

  changePassword = asyncHandler(async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const { currentPassword, newPassword } = req.body;
    const userId = req.user!.id;

    if (!currentPassword || !newPassword) {
      const response: ApiResponse = {
        success: false,
        message: 'Current password and new password are required',
        error: 'Missing required fields'
      };
      return res.status(400).json(response);
    }

    await authService.changePassword(userId, currentPassword, newPassword);

    const response: ApiResponse = {
      success: true,
      message: 'Password changed successfully'
    };

    return res.status(200).json(response);
  });

  logout = asyncHandler(async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const userId = req.user!.id;

    await authService.logout(userId);

    const response: ApiResponse = {
      success: true,
      message: 'Logout successful'
    };

    return res.status(200).json(response);
  });

  getProfile = asyncHandler(async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const { password, ...userWithoutPassword } = req.user!;

    const response: ApiResponse = {
      success: true,
      message: 'Profile retrieved successfully',
      data: { user: userWithoutPassword }
    };

    return res.status(200).json(response);
  });

  updateProfile = asyncHandler(async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const userId = req.user!.id;
    const { firstname, lastname, email } = req.body;

    // Only allow updating certain fields
    const allowedUpdates = { firstname, lastname, email };
    const filteredUpdates = Object.fromEntries(
      Object.entries(allowedUpdates).filter(([_, value]) => value !== undefined)
    );

    if (Object.keys(filteredUpdates).length === 0) {
      const response: ApiResponse = {
        success: false,
        message: 'No valid fields to update',
        error: 'At least one field must be provided'
      };
      return res.status(400).json(response);
    }

    // Check for email conflicts
    if (email) {
      const existingUser = await prisma.user.findFirst({
        where: {
          AND: [
            { id: { not: userId } },
            { email }
          ]
        }
      });

      if (existingUser) {
        const response: ApiResponse = {
          success: false,
          message: 'Email already exists',
          error: 'Another user is already using this email'
        };
        return res.status(409).json(response);
      }
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: filteredUpdates,
      include: {
        role: true
      }
    });

    const { password, ...userWithoutPassword } = updatedUser;

    const response: ApiResponse = {
      success: true,
      message: 'Profile updated successfully',
      data: { user: userWithoutPassword }
    };

    return res.status(200).json(response);
  });
}

export const authController = new AuthController();
