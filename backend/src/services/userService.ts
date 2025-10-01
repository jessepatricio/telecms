import { prisma } from '@/utils/database';
import { hashPassword } from '@/utils/password';
import { CreateUserRequest, UpdateUserRequest, FilterQuery, UserWithRole } from '@/types';
import { AppError } from '@/middleware/errorHandler';
import logger from '@/utils/logger';

export class UserService {
  async createUser(userData: CreateUserRequest): Promise<UserWithRole> {
    const { username, email, password, firstname, lastname, roleId } = userData;

    // Check if user already exists
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          { username },
          { email }
        ]
      }
    });

    if (existingUser) {
      if (existingUser.username === username) {
        throw new AppError('Username already exists', 409);
      }
      if (existingUser.email === email) {
        throw new AppError('Email already exists', 409);
      }
    }

    // Verify role exists
    const role = await prisma.role.findUnique({
      where: { id: roleId }
    });

    if (!role) {
      throw new AppError('Invalid role ID', 400);
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Create user
    const user = await prisma.user.create({
      data: {
        username,
        email,
        password: hashedPassword,
        firstname,
        lastname,
        roleId
      },
      include: {
        role: true
      }
    });

    logger.info(`User ${user.username} created successfully`);

    return user;
  }

  async getUsers(query: FilterQuery): Promise<{ users: UserWithRole[]; total: number }> {
    const {
      page = 1,
      limit = 10,
      sortBy = 'createdAt',
      sortOrder = 'desc',
      search
    } = query;

    const skip = (page - 1) * limit;

    // Build where clause
    const where: any = {};

    if (search) {
      where.OR = [
        { username: { contains: search, mode: 'insensitive' } },
        { firstname: { contains: search, mode: 'insensitive' } },
        { lastname: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } }
      ];
    }

    // Get users with pagination
    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        include: {
          role: true
        },
        orderBy: {
          [sortBy]: sortOrder
        },
        skip,
        take: limit
      }),
      prisma.user.count({ where })
    ]);

    return { users, total };
  }

  async getUserById(id: number): Promise<UserWithRole> {
    const user = await prisma.user.findUnique({
      where: { id },
      include: {
        role: true
      }
    });

    if (!user) {
      throw new AppError('User not found', 404);
    }

    return user;
  }

  async updateUser(id: number, userData: UpdateUserRequest): Promise<UserWithRole> {
    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { id }
    });

    if (!existingUser) {
      throw new AppError('User not found', 404);
    }

    // Check for username/email conflicts if they're being updated
    if (userData.username || userData.email) {
      const conflictUser = await prisma.user.findFirst({
        where: {
          AND: [
            { id: { not: id } },
            {
              OR: [
                ...(userData.username ? [{ username: userData.username }] : []),
                ...(userData.email ? [{ email: userData.email }] : [])
              ]
            }
          ]
        }
      });

      if (conflictUser) {
        if (conflictUser.username === userData.username) {
          throw new AppError('Username already exists', 409);
        }
        if (conflictUser.email === userData.email) {
          throw new AppError('Email already exists', 409);
        }
      }
    }

    // Verify role exists if roleId is being updated
    if (userData.roleId) {
      const role = await prisma.role.findUnique({
        where: { id: userData.roleId }
      });

      if (!role) {
        throw new AppError('Invalid role ID', 400);
      }
    }

    // Hash password if it's being updated
    const updateData: any = { ...userData };
    if (userData.password) {
      updateData.password = await hashPassword(userData.password);
    }

    // Update user
    const user = await prisma.user.update({
      where: { id },
      data: updateData,
      include: {
        role: true
      }
    });

    logger.info(`User ${user.username} updated successfully`);

    return user;
  }

  async deleteUser(id: number): Promise<void> {
    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { id }
    });

    if (!user) {
      throw new AppError('User not found', 404);
    }

    // Check if user has any related records
    const [taskCount, jobCount, reinstatementCount] = await Promise.all([
      prisma.task.count({ where: { assignedToId: id } }),
      prisma.job.count({ where: { assignedToId: id } }),
      prisma.reinstatement.count({ where: { assignedToId: id } })
    ]);

    if (taskCount > 0 || jobCount > 0 || reinstatementCount > 0) {
      throw new AppError('Cannot delete user with assigned tasks, jobs, or reinstatements', 400);
    }

    // Delete user
    await prisma.user.delete({
      where: { id }
    });

    logger.info(`User ${user.username} deleted successfully`);
  }

  async deactivateUser(id: number): Promise<UserWithRole> {
    const user = await prisma.user.update({
      where: { id },
      data: { isActive: false },
      include: {
        role: true
      }
    });

    logger.info(`User ${user.username} deactivated successfully`);

    return user;
  }

  async activateUser(id: number): Promise<UserWithRole> {
    const user = await prisma.user.update({
      where: { id },
      data: { isActive: true },
      include: {
        role: true
      }
    });

    logger.info(`User ${user.username} activated successfully`);

    return user;
  }

  async getUserStats(): Promise<{
    total: number;
    active: number;
    inactive: number;
    byRole: Array<{ role: string; count: number }>;
  }> {
    const [total, active, inactive, byRole] = await Promise.all([
      prisma.user.count(),
      prisma.user.count({ where: { isActive: true } }),
      prisma.user.count({ where: { isActive: false } }),
      prisma.user.groupBy({
        by: ['roleId'],
        _count: {
          id: true
        }
      }).then(async (groupedUsers) => {
        // Get role names for each group
        const roleIds = groupedUsers.map(group => group.roleId);
        const roles = await prisma.role.findMany({
          where: { id: { in: roleIds } },
          select: { id: true, name: true }
        });
        
        return groupedUsers.map(group => ({
          ...group,
          role: roles.find(role => role.id === group.roleId)
        }));
      })
    ]);

    return {
      total,
      active,
      inactive,
      byRole: byRole.map((item: any) => ({
        role: item.role?.name || 'Unknown',
        count: item._count.id
      }))
    };
  }
}

export const userService = new UserService();
