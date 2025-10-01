import { Request } from 'express';
import { User, Role, Task, Cabinet, Job, Reinstatement, Image } from '@prisma/client';
export interface AuthenticatedRequest extends Request {
    user?: any;
}
export interface ApiResponse<T = any> {
    success: boolean;
    message: string;
    data?: T;
    error?: string;
    pagination?: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    };
}
export interface LoginRequest {
    username: string;
    password: string;
}
export interface RegisterRequest {
    username: string;
    firstname: string;
    lastname: string;
    email: string;
    password: string;
    roleId: number;
}
export interface AuthResponse {
    user: Omit<User, 'password'>;
    token: string;
    refreshToken: string;
}
export interface CreateUserRequest {
    username: string;
    firstname: string;
    lastname: string;
    email: string;
    password: string;
    roleId: number;
}
export interface UpdateUserRequest {
    username?: string;
    firstname?: string;
    lastname?: string;
    email?: string;
    password?: string;
    roleId?: number;
    isActive?: boolean;
}
export interface CreateRoleRequest {
    name: string;
    description?: string;
    permissions?: string[];
}
export interface UpdateRoleRequest {
    name?: string;
    description?: string;
    permissions?: string[];
}
export interface CreateTaskRequest {
    title: string;
    description?: string;
    status?: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
    priority?: 'LOW' | 'MEDIUM' | 'HIGH';
    assignedToId?: number;
    dueDate?: Date;
}
export interface UpdateTaskRequest {
    title?: string;
    description?: string;
    status?: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
    priority?: 'LOW' | 'MEDIUM' | 'HIGH';
    assignedToId?: number;
    dueDate?: Date;
}
export interface CreateCabinetRequest {
    name: string;
    location?: string;
    status?: 'ACTIVE' | 'INACTIVE' | 'MAINTENANCE' | 'OFFLINE';
    description?: string;
    assignedTo?: string;
}
export interface UpdateCabinetRequest {
    name?: string;
    location?: string;
    status?: 'ACTIVE' | 'INACTIVE' | 'MAINTENANCE' | 'OFFLINE';
    description?: string;
    assignedTo?: string;
}
export interface CreateJobRequest {
    title: string;
    description?: string;
    status?: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
    assignedToId?: number;
    cabinetId?: number;
    taskId?: number;
    lno?: string;
    withDig?: boolean;
    withBackfill?: boolean;
    remarks?: string;
    streetNo?: string;
    streetName?: string;
    file?: string;
    imageUrl?: string;
    jobDate?: string;
    dueDate?: Date;
}
export interface UpdateJobRequest {
    title?: string;
    description?: string;
    status?: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
    assignedToId?: number;
    cabinetId?: number;
    taskId?: number;
    lno?: string;
    withDig?: boolean;
    withBackfill?: boolean;
    remarks?: string;
    streetNo?: string;
    streetName?: string;
    file?: string;
    imageUrl?: string;
    jobDate?: string;
    dueDate?: Date;
}
export interface CreateReinstatementRequest {
    title: string;
    description?: string;
    status?: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
    assignedToId?: number;
    cabinetId?: number;
    streetLocation?: string;
    length?: number;
    width?: number;
    file?: string;
    imageUrl?: string;
}
export interface UpdateReinstatementRequest {
    title?: string;
    description?: string;
    status?: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
    assignedToId?: number;
    cabinetId?: number;
    streetLocation?: string;
    length?: number;
    width?: number;
    file?: string;
    imageUrl?: string;
}
export interface PaginationQuery {
    page?: number;
    limit?: number;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
}
export interface FilterQuery extends PaginationQuery {
    search?: string;
    status?: string;
    assignedTo?: number;
    cabinetId?: number;
    taskId?: number;
}
export interface DashboardStats {
    totalUsers: number;
    totalTasks: number;
    totalJobs: number;
    totalCabinets: number;
    totalReinstatements: number;
    pendingTasks: number;
    inProgressJobs: number;
    completedJobs: number;
    activeCabinets: number;
}
export type UserWithRole = User & {
    role: Role;
};
export type TaskWithUser = Task & {
    assignedTo?: User;
};
export type JobWithRelations = Job & {
    assignedTo?: User;
    addedBy?: User;
    modifiedBy?: User;
    cabinet?: Cabinet;
    task?: Task;
    images?: Image[];
};
export type CabinetWithStats = Cabinet & {
    _count?: {
        jobs: number;
        reinstatements: number;
    };
};
export type ReinstatementWithRelations = Reinstatement & {
    assignedTo?: User;
    cabinet?: Cabinet;
    images?: Image[];
};
//# sourceMappingURL=index.d.ts.map