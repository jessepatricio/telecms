import { Request, Response, NextFunction } from 'express';
import { userService } from '@/services/userService';
import { AuthenticatedRequest, ApiResponse, CreateUserRequest, UpdateUserRequest, FilterQuery } from '@/types';
import { asyncHandler } from '@/middleware/errorHandler';
import logger from '@/utils/logger';

export class UserController {
  createUser = asyncHandler(async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const userData: CreateUserRequest = req.body;

    const user = await userService.createUser(userData);

    const response: ApiResponse = {
      success: true,
      message: 'User created successfully',
      data: { user }
    };

    return res.status(201).json(response);
  });

  getUsers = asyncHandler(async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const query: FilterQuery = req.query;

    const { users, total } = await userService.getUsers(query);

    const page = parseInt(query.page?.toString() || '1');
    const limit = parseInt(query.limit?.toString() || '10');
    const totalPages = Math.ceil(total / limit);

    const response: ApiResponse = {
      success: true,
      message: 'Users retrieved successfully',
      data: { users },
      pagination: {
        page,
        limit,
        total,
        totalPages
      }
    };

    return res.status(200).json(response);
  });

  getUserById = asyncHandler(async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const userId = parseInt(id);

    if (isNaN(userId)) {
      const response: ApiResponse = {
        success: false,
        message: 'Invalid user ID',
        error: 'User ID must be a number'
      };
      return res.status(400).json(response);
    }

    const user = await userService.getUserById(userId);

    const response: ApiResponse = {
      success: true,
      message: 'User retrieved successfully',
      data: { user }
    };

    return res.status(200).json(response);
  });

  updateUser = asyncHandler(async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const userId = parseInt(id);
    const userData: UpdateUserRequest = req.body;

    if (isNaN(userId)) {
      const response: ApiResponse = {
        success: false,
        message: 'Invalid user ID',
        error: 'User ID must be a number'
      };
      return res.status(400).json(response);
    }

    const user = await userService.updateUser(userId, userData);

    const response: ApiResponse = {
      success: true,
      message: 'User updated successfully',
      data: { user }
    };

    return res.status(200).json(response);
  });

  deleteUser = asyncHandler(async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const userId = parseInt(id);

    if (isNaN(userId)) {
      const response: ApiResponse = {
        success: false,
        message: 'Invalid user ID',
        error: 'User ID must be a number'
      };
      return res.status(400).json(response);
    }

    await userService.deleteUser(userId);

    const response: ApiResponse = {
      success: true,
      message: 'User deleted successfully'
    };

    return res.status(200).json(response);
  });

  deactivateUser = asyncHandler(async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const userId = parseInt(id);

    if (isNaN(userId)) {
      const response: ApiResponse = {
        success: false,
        message: 'Invalid user ID',
        error: 'User ID must be a number'
      };
      return res.status(400).json(response);
    }

    const user = await userService.deactivateUser(userId);

    const response: ApiResponse = {
      success: true,
      message: 'User deactivated successfully',
      data: { user }
    };

    return res.status(200).json(response);
  });

  activateUser = asyncHandler(async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const userId = parseInt(id);

    if (isNaN(userId)) {
      const response: ApiResponse = {
        success: false,
        message: 'Invalid user ID',
        error: 'User ID must be a number'
      };
      return res.status(400).json(response);
    }

    const user = await userService.activateUser(userId);

    const response: ApiResponse = {
      success: true,
      message: 'User activated successfully',
      data: { user }
    };

    return res.status(200).json(response);
  });

  getUserStats = asyncHandler(async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const stats = await userService.getUserStats();

    const response: ApiResponse = {
      success: true,
      message: 'User statistics retrieved successfully',
      data: { stats }
    };

    return res.status(200).json(response);
  });
}

export const userController = new UserController();
