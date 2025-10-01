import { prisma } from '@/utils/database';
import { hashPassword, comparePassword } from '@/utils/password';
import { generateTokens, verifyToken } from '@/utils/jwt';
import { LoginRequest, RegisterRequest, AuthResponse, UserWithRole } from '@/types';
import { AppError } from '@/middleware/errorHandler';
import logger from '@/utils/logger';

export class AuthService {
  async login(credentials: LoginRequest): Promise<AuthResponse> {
    const { username, password } = credentials;

    // Find user by username or email
    const user = await prisma.user.findFirst({
      where: {
        OR: [
          { username },
          { email: username }
        ]
      },
      include: {
        role: true
      }
    });

    if (!user) {
      throw new AppError('Invalid credentials', 401);
    }

    // Check if user is active (handle case where isActive field might not exist yet)
    const isActive = (user as any).isActive !== undefined ? (user as any).isActive : true;
    if (!isActive) {
      throw new AppError('Account is deactivated', 401);
    }

    // Verify password
    const isPasswordValid = await comparePassword(password, user.password);
    if (!isPasswordValid) {
      throw new AppError('Invalid credentials', 401);
    }

    // Generate tokens
    const { accessToken, refreshToken } = generateTokens(user);

    // Remove password from user object
    const { password: _, ...userWithoutPassword } = user;

    logger.info(`User ${user.username} logged in successfully`);

    return {
      user: userWithoutPassword,
      token: accessToken,
      refreshToken
    };
  }

  async register(userData: RegisterRequest): Promise<AuthResponse> {
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

    // Generate tokens
    const { accessToken, refreshToken } = generateTokens(user);

    // Remove password from user object
    const { password: _, ...userWithoutPassword } = user;

    logger.info(`User ${user.username} registered successfully`);

    return {
      user: userWithoutPassword,
      token: accessToken,
      refreshToken
    };
  }

  async refreshToken(refreshToken: string): Promise<{ token: string; refreshToken: string }> {
    try {
      const payload = verifyToken(refreshToken);
      
      if (payload.type !== 'refresh') {
        throw new AppError('Invalid refresh token', 401);
      }

      // Get user from database
      const user = await prisma.user.findUnique({
        where: { id: payload.userId },
        include: {
          role: true
        }
      });

      // Check if user is active (handle case where isActive field might not exist yet)
      const isActive = (user as any).isActive !== undefined ? (user as any).isActive : true;
      if (!user || !isActive) {
        throw new AppError('User not found or inactive', 401);
      }

      // Generate new tokens
      const { accessToken, refreshToken: newRefreshToken } = generateTokens(user);

      logger.info(`User ${user.username} refreshed token successfully`);

      return {
        token: accessToken,
        refreshToken: newRefreshToken
      };
    } catch (error) {
      throw new AppError('Invalid refresh token', 401);
    }
  }

  async verifyToken(token: string): Promise<UserWithRole> {
    try {
      const payload = verifyToken(token);
      
      if (payload.type !== 'access') {
        throw new AppError('Invalid token type', 401);
      }

      const user = await prisma.user.findUnique({
        where: { id: payload.userId },
        include: {
          role: true
        }
      });

      // Check if user is active (handle case where isActive field might not exist yet)
      const isActive = (user as any).isActive !== undefined ? (user as any).isActive : true;
      if (!user || !isActive) {
        throw new AppError('User not found or inactive', 401);
      }

      return user;
    } catch (error) {
      throw new AppError('Invalid token', 401);
    }
  }

  async changePassword(userId: number, currentPassword: string, newPassword: string): Promise<void> {
    const user = await prisma.user.findUnique({
      where: { id: userId }
    });

    if (!user) {
      throw new AppError('User not found', 404);
    }

    // Verify current password
    const isCurrentPasswordValid = await comparePassword(currentPassword, user.password);
    if (!isCurrentPasswordValid) {
      throw new AppError('Current password is incorrect', 400);
    }

    // Hash new password
    const hashedNewPassword = await hashPassword(newPassword);

    // Update password
    await prisma.user.update({
      where: { id: userId },
      data: { password: hashedNewPassword }
    });

    logger.info(`User ${user.username} changed password successfully`);
  }

  async logout(userId: number): Promise<void> {
    // In a more sophisticated system, you might want to blacklist the token
    // For now, we'll just log the logout
    const user = await prisma.user.findUnique({
      where: { id: userId }
    });

    if (user) {
      logger.info(`User ${user.username} logged out successfully`);
    }
  }
}

export const authService = new AuthService();
