"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authService = exports.AuthService = void 0;
const database_1 = require("@/utils/database");
const password_1 = require("@/utils/password");
const jwt_1 = require("@/utils/jwt");
const errorHandler_1 = require("@/middleware/errorHandler");
const logger_1 = __importDefault(require("@/utils/logger"));
class AuthService {
    async login(credentials) {
        const { username, password } = credentials;
        const user = await database_1.prisma.user.findFirst({
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
            throw new errorHandler_1.AppError('Invalid credentials', 401);
        }
        const isActive = user.isActive !== undefined ? user.isActive : true;
        if (!isActive) {
            throw new errorHandler_1.AppError('Account is deactivated', 401);
        }
        const isPasswordValid = await (0, password_1.comparePassword)(password, user.password);
        if (!isPasswordValid) {
            throw new errorHandler_1.AppError('Invalid credentials', 401);
        }
        const { accessToken, refreshToken } = (0, jwt_1.generateTokens)(user);
        const { password: _, ...userWithoutPassword } = user;
        logger_1.default.info(`User ${user.username} logged in successfully`);
        return {
            user: userWithoutPassword,
            token: accessToken,
            refreshToken
        };
    }
    async register(userData) {
        const { username, email, password, firstname, lastname, roleId } = userData;
        const existingUser = await database_1.prisma.user.findFirst({
            where: {
                OR: [
                    { username },
                    { email }
                ]
            }
        });
        if (existingUser) {
            if (existingUser.username === username) {
                throw new errorHandler_1.AppError('Username already exists', 409);
            }
            if (existingUser.email === email) {
                throw new errorHandler_1.AppError('Email already exists', 409);
            }
        }
        const role = await database_1.prisma.role.findUnique({
            where: { id: roleId }
        });
        if (!role) {
            throw new errorHandler_1.AppError('Invalid role ID', 400);
        }
        const hashedPassword = await (0, password_1.hashPassword)(password);
        const user = await database_1.prisma.user.create({
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
        const { accessToken, refreshToken } = (0, jwt_1.generateTokens)(user);
        const { password: _, ...userWithoutPassword } = user;
        logger_1.default.info(`User ${user.username} registered successfully`);
        return {
            user: userWithoutPassword,
            token: accessToken,
            refreshToken
        };
    }
    async refreshToken(refreshToken) {
        try {
            const payload = (0, jwt_1.verifyToken)(refreshToken);
            if (payload.type !== 'refresh') {
                throw new errorHandler_1.AppError('Invalid refresh token', 401);
            }
            const user = await database_1.prisma.user.findUnique({
                where: { id: payload.userId },
                include: {
                    role: true
                }
            });
            const isActive = user.isActive !== undefined ? user.isActive : true;
            if (!user || !isActive) {
                throw new errorHandler_1.AppError('User not found or inactive', 401);
            }
            const { accessToken, refreshToken: newRefreshToken } = (0, jwt_1.generateTokens)(user);
            logger_1.default.info(`User ${user.username} refreshed token successfully`);
            return {
                token: accessToken,
                refreshToken: newRefreshToken
            };
        }
        catch (error) {
            throw new errorHandler_1.AppError('Invalid refresh token', 401);
        }
    }
    async verifyToken(token) {
        try {
            const payload = (0, jwt_1.verifyToken)(token);
            if (payload.type !== 'access') {
                throw new errorHandler_1.AppError('Invalid token type', 401);
            }
            const user = await database_1.prisma.user.findUnique({
                where: { id: payload.userId },
                include: {
                    role: true
                }
            });
            const isActive = user.isActive !== undefined ? user.isActive : true;
            if (!user || !isActive) {
                throw new errorHandler_1.AppError('User not found or inactive', 401);
            }
            return user;
        }
        catch (error) {
            throw new errorHandler_1.AppError('Invalid token', 401);
        }
    }
    async changePassword(userId, currentPassword, newPassword) {
        const user = await database_1.prisma.user.findUnique({
            where: { id: userId }
        });
        if (!user) {
            throw new errorHandler_1.AppError('User not found', 404);
        }
        const isCurrentPasswordValid = await (0, password_1.comparePassword)(currentPassword, user.password);
        if (!isCurrentPasswordValid) {
            throw new errorHandler_1.AppError('Current password is incorrect', 400);
        }
        const hashedNewPassword = await (0, password_1.hashPassword)(newPassword);
        await database_1.prisma.user.update({
            where: { id: userId },
            data: { password: hashedNewPassword }
        });
        logger_1.default.info(`User ${user.username} changed password successfully`);
    }
    async logout(userId) {
        const user = await database_1.prisma.user.findUnique({
            where: { id: userId }
        });
        if (user) {
            logger_1.default.info(`User ${user.username} logged out successfully`);
        }
    }
}
exports.AuthService = AuthService;
exports.authService = new AuthService();
//# sourceMappingURL=authService.js.map