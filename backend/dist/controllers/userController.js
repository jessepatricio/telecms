"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userController = exports.UserController = void 0;
const userService_1 = require("@/services/userService");
const errorHandler_1 = require("@/middleware/errorHandler");
class UserController {
    createUser = (0, errorHandler_1.asyncHandler)(async (req, res, next) => {
        const userData = req.body;
        const user = await userService_1.userService.createUser(userData);
        const response = {
            success: true,
            message: 'User created successfully',
            data: { user }
        };
        return res.status(201).json(response);
    });
    getUsers = (0, errorHandler_1.asyncHandler)(async (req, res, next) => {
        const query = req.query;
        const { users, total } = await userService_1.userService.getUsers(query);
        const page = parseInt(query.page?.toString() || '1');
        const limit = parseInt(query.limit?.toString() || '10');
        const totalPages = Math.ceil(total / limit);
        const response = {
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
    getUserById = (0, errorHandler_1.asyncHandler)(async (req, res, next) => {
        const { id } = req.params;
        const userId = parseInt(id);
        if (isNaN(userId)) {
            const response = {
                success: false,
                message: 'Invalid user ID',
                error: 'User ID must be a number'
            };
            return res.status(400).json(response);
        }
        const user = await userService_1.userService.getUserById(userId);
        const response = {
            success: true,
            message: 'User retrieved successfully',
            data: { user }
        };
        return res.status(200).json(response);
    });
    updateUser = (0, errorHandler_1.asyncHandler)(async (req, res, next) => {
        const { id } = req.params;
        const userId = parseInt(id);
        const userData = req.body;
        if (isNaN(userId)) {
            const response = {
                success: false,
                message: 'Invalid user ID',
                error: 'User ID must be a number'
            };
            return res.status(400).json(response);
        }
        const user = await userService_1.userService.updateUser(userId, userData);
        const response = {
            success: true,
            message: 'User updated successfully',
            data: { user }
        };
        return res.status(200).json(response);
    });
    deleteUser = (0, errorHandler_1.asyncHandler)(async (req, res, next) => {
        const { id } = req.params;
        const userId = parseInt(id);
        if (isNaN(userId)) {
            const response = {
                success: false,
                message: 'Invalid user ID',
                error: 'User ID must be a number'
            };
            return res.status(400).json(response);
        }
        await userService_1.userService.deleteUser(userId);
        const response = {
            success: true,
            message: 'User deleted successfully'
        };
        return res.status(200).json(response);
    });
    deactivateUser = (0, errorHandler_1.asyncHandler)(async (req, res, next) => {
        const { id } = req.params;
        const userId = parseInt(id);
        if (isNaN(userId)) {
            const response = {
                success: false,
                message: 'Invalid user ID',
                error: 'User ID must be a number'
            };
            return res.status(400).json(response);
        }
        const user = await userService_1.userService.deactivateUser(userId);
        const response = {
            success: true,
            message: 'User deactivated successfully',
            data: { user }
        };
        return res.status(200).json(response);
    });
    activateUser = (0, errorHandler_1.asyncHandler)(async (req, res, next) => {
        const { id } = req.params;
        const userId = parseInt(id);
        if (isNaN(userId)) {
            const response = {
                success: false,
                message: 'Invalid user ID',
                error: 'User ID must be a number'
            };
            return res.status(400).json(response);
        }
        const user = await userService_1.userService.activateUser(userId);
        const response = {
            success: true,
            message: 'User activated successfully',
            data: { user }
        };
        return res.status(200).json(response);
    });
    getUserStats = (0, errorHandler_1.asyncHandler)(async (req, res, next) => {
        const stats = await userService_1.userService.getUserStats();
        const response = {
            success: true,
            message: 'User statistics retrieved successfully',
            data: { stats }
        };
        return res.status(200).json(response);
    });
}
exports.UserController = UserController;
exports.userController = new UserController();
//# sourceMappingURL=userController.js.map