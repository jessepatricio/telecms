import jwt from 'jsonwebtoken';
import { User } from '@prisma/client';

const JWT_SECRET = process.env['JWT_SECRET'] || 'your-super-secret-jwt-key';
const JWT_EXPIRES_IN = process.env['JWT_EXPIRES_IN'] || '24h';
const JWT_REFRESH_EXPIRES_IN = process.env['JWT_REFRESH_EXPIRES_IN'] || '7d';

export interface JwtPayload {
  userId: number;
  username: string;
  email: string;
  roleId: number;
  type: 'access' | 'refresh';
}

export const generateTokens = (user: User) => {
  const payload: Omit<JwtPayload, 'type'> = {
    userId: user.id,
    username: user.username,
    email: user.email,
    roleId: user.roleId,
  };

  const accessToken = jwt.sign(
    { ...payload, type: 'access' },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN } as jwt.SignOptions
  );

  const refreshToken = jwt.sign(
    { ...payload, type: 'refresh' },
    JWT_SECRET,
    { expiresIn: JWT_REFRESH_EXPIRES_IN } as jwt.SignOptions
  );

  return { accessToken, refreshToken };
};

export const verifyToken = (token: string): JwtPayload => {
  try {
    return jwt.verify(token, JWT_SECRET) as JwtPayload;
  } catch (error) {
    throw new Error('Invalid token');
  }
};

export const decodeToken = (token: string): JwtPayload | null => {
  try {
    return jwt.decode(token) as JwtPayload;
  } catch (error) {
    return null;
  }
};
