"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userService = exports.UserService = void 0;
const database_1 = require("@/utils/database");
const password_1 = require("@/utils/password");
const errorHandler_1 = require("@/middleware/errorHandler");
const logger_1 = __importDefault(require("@/utils/logger"));
class UserService {
    async createUser(userData) {
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
        logger_1.default.info(`User ${user.username} created successfully`);
        return user;
    }
    async getUsers(query) {
        const { page = 1, limit = 10, sortBy = 'createdAt', sortOrder = 'desc', search } = query;
        const skip = (page - 1) * limit;
        const where = {};
        if (search) {
            where.OR = [
                { username: { contains: search, mode: 'insensitive' } },
                { firstname: { contains: search, mode: 'insensitive' } },
                { lastname: { contains: search, mode: 'insensitive' } },
                { email: { contains: search, mode: 'insensitive' } }
            ];
        }
        const [users, total] = await Promise.all([
            database_1.prisma.user.findMany({
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
            database_1.prisma.user.count({ where })
        ]);
        return { users, total };
    }
    async getUserById(id) {
        const user = await database_1.prisma.user.findUnique({
            where: { id },
            include: {
                role: true
            }
        });
        if (!user) {
            throw new errorHandler_1.AppError('User not found', 404);
        }
        return user;
    }
    async updateUser(id, userData) {
        const existingUser = await database_1.prisma.user.findUnique({
            where: { id }
        });
        if (!existingUser) {
            throw new errorHandler_1.AppError('User not found', 404);
        }
        if (userData.username || userData.email) {
            const conflictUser = await database_1.prisma.user.findFirst({
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
                    throw new errorHandler_1.AppError('Username already exists', 409);
                }
                if (conflictUser.email === userData.email) {
                    throw new errorHandler_1.AppError('Email already exists', 409);
                }
            }
        }
        if (userData.roleId) {
            const role = await database_1.prisma.role.findUnique({
                where: { id: userData.roleId }
            });
            if (!role) {
                throw new errorHandler_1.AppError('Invalid role ID', 400);
            }
        }
        const updateData = { ...userData };
        if (userData.password) {
            updateData.password = await (0, password_1.hashPassword)(userData.password);
        }
        const user = await database_1.prisma.user.update({
            where: { id },
            data: updateData,
            include: {
                role: true
            }
        });
        logger_1.default.info(`User ${user.username} updated successfully`);
        return user;
    }
    async deleteUser(id) {
        const user = await database_1.prisma.user.findUnique({
            where: { id }
        });
        if (!user) {
            throw new errorHandler_1.AppError('User not found', 404);
        }
        const [taskCount, jobCount, reinstatementCount] = await Promise.all([
            database_1.prisma.task.count({ where: { assignedToId: id } }),
            database_1.prisma.job.count({ where: { assignedToId: id } }),
            database_1.prisma.reinstatement.count({ where: { assignedToId: id } })
        ]);
        if (taskCount > 0 || jobCount > 0 || reinstatementCount > 0) {
            throw new errorHandler_1.AppError('Cannot delete user with assigned tasks, jobs, or reinstatements', 400);
        }
        await database_1.prisma.user.delete({
            where: { id }
        });
        logger_1.default.info(`User ${user.username} deleted successfully`);
    }
    async deactivateUser(id) {
        const user = await database_1.prisma.user.update({
            where: { id },
            data: { isActive: false },
            include: {
                role: true
            }
        });
        logger_1.default.info(`User ${user.username} deactivated successfully`);
        return user;
    }
    async activateUser(id) {
        const user = await database_1.prisma.user.update({
            where: { id },
            data: { isActive: true },
            include: {
                role: true
            }
        });
        logger_1.default.info(`User ${user.username} activated successfully`);
        return user;
    }
    async getUserStats() {
        const [total, active, inactive, byRole] = await Promise.all([
            database_1.prisma.user.count(),
            database_1.prisma.user.count({ where: { isActive: true } }),
            database_1.prisma.user.count({ where: { isActive: false } }),
            database_1.prisma.user.groupBy({
                by: ['roleId'],
                _count: {
                    id: true
                }
            }).then(async (groupedUsers) => {
                const roleIds = groupedUsers.map(group => group.roleId);
                const roles = await database_1.prisma.role.findMany({
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
            byRole: byRole.map((item) => ({
                role: item.role?.name || 'Unknown',
                count: item._count.id
            }))
        };
    }
}
exports.UserService = UserService;
exports.userService = new UserService();
//# sourceMappingURL=userService.js.map