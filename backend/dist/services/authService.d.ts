import { LoginRequest, RegisterRequest, AuthResponse, UserWithRole } from '@/types';
export declare class AuthService {
    login(credentials: LoginRequest): Promise<AuthResponse>;
    register(userData: RegisterRequest): Promise<AuthResponse>;
    refreshToken(refreshToken: string): Promise<{
        token: string;
        refreshToken: string;
    }>;
    verifyToken(token: string): Promise<UserWithRole>;
    changePassword(userId: number, currentPassword: string, newPassword: string): Promise<void>;
    logout(userId: number): Promise<void>;
}
export declare const authService: AuthService;
//# sourceMappingURL=authService.d.ts.map