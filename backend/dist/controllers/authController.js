"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authController = exports.AuthController = void 0;
const authService_1 = require("@/services/authService");
const errorHandler_1 = require("@/middleware/errorHandler");
const database_1 = require("@/utils/database");
class AuthController {
    login = (0, errorHandler_1.asyncHandler)(async (req, res, next) => {
        const credentials = req.body;
        const result = await authService_1.authService.login(credentials);
        const response = {
            success: true,
            message: 'Login successful',
            data: result
        };
        return res.status(200).json(response);
    });
    register = (0, errorHandler_1.asyncHandler)(async (req, res, next) => {
        const userData = req.body;
        const result = await authService_1.authService.register(userData);
        const response = {
            success: true,
            message: 'Registration successful',
            data: result
        };
        return res.status(201).json(response);
    });
    refreshToken = (0, errorHandler_1.asyncHandler)(async (req, res, next) => {
        const { refreshToken } = req.body;
        if (!refreshToken) {
            const response = {
                success: false,
                message: 'Refresh token is required',
                error: 'No refresh token provided'
            };
            return res.status(400).json(response);
        }
        const tokens = await authService_1.authService.refreshToken(refreshToken);
        const response = {
            success: true,
            message: 'Token refreshed successfully',
            data: tokens
        };
        return res.status(200).json(response);
    });
    verifyToken = (0, errorHandler_1.asyncHandler)(async (req, res, next) => {
        const { password, ...userWithoutPassword } = req.user;
        const response = {
            success: true,
            message: 'Token is valid',
            data: { user: userWithoutPassword }
        };
        return res.status(200).json(response);
    });
    changePassword = (0, errorHandler_1.asyncHandler)(async (req, res, next) => {
        const { currentPassword, newPassword } = req.body;
        const userId = req.user.id;
        if (!currentPassword || !newPassword) {
            const response = {
                success: false,
                message: 'Current password and new password are required',
                error: 'Missing required fields'
            };
            return res.status(400).json(response);
        }
        await authService_1.authService.changePassword(userId, currentPassword, newPassword);
        const response = {
            success: true,
            message: 'Password changed successfully'
        };
        return res.status(200).json(response);
    });
    logout = (0, errorHandler_1.asyncHandler)(async (req, res, next) => {
        const userId = req.user.id;
        await authService_1.authService.logout(userId);
        const response = {
            success: true,
            message: 'Logout successful'
        };
        return res.status(200).json(response);
    });
    getProfile = (0, errorHandler_1.asyncHandler)(async (req, res, next) => {
        const { password, ...userWithoutPassword } = req.user;
        const response = {
            success: true,
            message: 'Profile retrieved successfully',
            data: { user: userWithoutPassword }
        };
        return res.status(200).json(response);
    });
    updateProfile = (0, errorHandler_1.asyncHandler)(async (req, res, next) => {
        const userId = req.user.id;
        const { firstname, lastname, email } = req.body;
        const allowedUpdates = { firstname, lastname, email };
        const filteredUpdates = Object.fromEntries(Object.entries(allowedUpdates).filter(([_, value]) => value !== undefined));
        if (Object.keys(filteredUpdates).length === 0) {
            const response = {
                success: false,
                message: 'No valid fields to update',
                error: 'At least one field must be provided'
            };
            return res.status(400).json(response);
        }
        if (email) {
            const existingUser = await database_1.prisma.user.findFirst({
                where: {
                    AND: [
                        { id: { not: userId } },
                        { email }
                    ]
                }
            });
            if (existingUser) {
                const response = {
                    success: false,
                    message: 'Email already exists',
                    error: 'Another user is already using this email'
                };
                return res.status(409).json(response);
            }
        }
        const updatedUser = await database_1.prisma.user.update({
            where: { id: userId },
            data: filteredUpdates,
            include: {
                role: true
            }
        });
        const { password, ...userWithoutPassword } = updatedUser;
        const response = {
            success: true,
            message: 'Profile updated successfully',
            data: { user: userWithoutPassword }
        };
        return res.status(200).json(response);
    });
}
exports.AuthController = AuthController;
exports.authController = new AuthController();
//# sourceMappingURL=authController.js.map