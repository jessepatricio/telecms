import { CreateUserRequest, UpdateUserRequest, FilterQuery, UserWithRole } from '@/types';
export declare class UserService {
    createUser(userData: CreateUserRequest): Promise<UserWithRole>;
    getUsers(query: FilterQuery): Promise<{
        users: UserWithRole[];
        total: number;
    }>;
    getUserById(id: number): Promise<UserWithRole>;
    updateUser(id: number, userData: UpdateUserRequest): Promise<UserWithRole>;
    deleteUser(id: number): Promise<void>;
    deactivateUser(id: number): Promise<UserWithRole>;
    activateUser(id: number): Promise<UserWithRole>;
    getUserStats(): Promise<{
        total: number;
        active: number;
        inactive: number;
        byRole: Array<{
            role: string;
            count: number;
        }>;
    }>;
}
export declare const userService: UserService;
//# sourceMappingURL=userService.d.ts.map