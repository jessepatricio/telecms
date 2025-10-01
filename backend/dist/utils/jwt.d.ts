import { User } from '@prisma/client';
export interface JwtPayload {
    userId: number;
    username: string;
    email: string;
    roleId: number;
    type: 'access' | 'refresh';
}
export declare const generateTokens: (user: User) => {
    accessToken: string;
    refreshToken: string;
};
export declare const verifyToken: (token: string) => JwtPayload;
export declare const decodeToken: (token: string) => JwtPayload | null;
//# sourceMappingURL=jwt.d.ts.map