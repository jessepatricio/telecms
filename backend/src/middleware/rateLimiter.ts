import rateLimit from 'express-rate-limit';
import { Request, Response } from 'express';
import { ApiResponse } from '@/types';
import logger from '@/utils/logger';

const windowMs = parseInt(process.env['RATE_LIMIT_WINDOW_MS'] || '900000'); // 15 minutes
const maxRequests = parseInt(process.env['RATE_LIMIT_MAX_REQUESTS'] || '100');

export const generalRateLimit = rateLimit({
  windowMs,
  max: maxRequests,
  message: {
    success: false,
    message: 'Too many requests',
    error: 'Rate limit exceeded. Please try again later.'
  } as ApiResponse,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req: Request, res: Response) => {
    logger.warn('Rate limit exceeded:', {
      ip: req.ip,
      url: req.url,
      method: req.method,
      userAgent: req.get('User-Agent')
    });
    
    res.status(429).json({
      success: false,
      message: 'Too many requests',
      error: 'Rate limit exceeded. Please try again later.'
    } as ApiResponse);
  }
});

export const authRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 attempts per window
  message: {
    success: false,
    message: 'Too many authentication attempts',
    error: 'Too many login attempts. Please try again later.'
  } as ApiResponse,
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: true,
  handler: (req: Request, res: Response) => {
    logger.warn('Auth rate limit exceeded:', {
      ip: req.ip,
      url: req.url,
      method: req.method,
      userAgent: req.get('User-Agent')
    });
    
    res.status(429).json({
      success: false,
      message: 'Too many authentication attempts',
      error: 'Too many login attempts. Please try again later.'
    } as ApiResponse);
  }
});

export const strictRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 3, // 3 attempts per window
  message: {
    success: false,
    message: 'Too many requests',
    error: 'Rate limit exceeded. Please try again later.'
  } as ApiResponse,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req: Request, res: Response) => {
    logger.warn('Strict rate limit exceeded:', {
      ip: req.ip,
      url: req.url,
      method: req.method,
      userAgent: req.get('User-Agent')
    });
    
    res.status(429).json({
      success: false,
      message: 'Too many requests',
      error: 'Rate limit exceeded. Please try again later.'
    } as ApiResponse);
  }
});
