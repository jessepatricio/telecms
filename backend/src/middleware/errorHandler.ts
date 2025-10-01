import { Request, Response, NextFunction } from 'express';
import { Prisma } from '@prisma/client';
import { ApiResponse } from '@/types';
import logger from '@/utils/logger';

export class AppError extends Error {
  public statusCode: number;
  public isOperational: boolean;

  constructor(message: string, statusCode: number = 500, isOperational: boolean = true) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;

    Error.captureStackTrace(this, this.constructor);
  }
}

export const errorHandler = (
  error: Error | AppError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let statusCode = 500;
  let message = 'Internal Server Error';
  let isOperational = false;

  // Log the error
  logger.error('Error occurred:', {
    error: error.message,
    stack: error.stack,
    url: req.url,
    method: req.method,
    ip: req.ip,
    userAgent: req.get('User-Agent')
  });

  // Handle different types of errors
  if (error instanceof AppError) {
    statusCode = error.statusCode;
    message = error.message;
    isOperational = error.isOperational;
  } else if (error instanceof Prisma.PrismaClientKnownRequestError) {
    // Handle Prisma errors
    switch (error.code) {
      case 'P2002':
        statusCode = 409;
        message = 'A record with this information already exists';
        break;
      case 'P2025':
        statusCode = 404;
        message = 'Record not found';
        break;
      case 'P2003':
        statusCode = 400;
        message = 'Invalid reference to related record';
        break;
      case 'P2014':
        statusCode = 400;
        message = 'Invalid ID provided';
        break;
      default:
        statusCode = 400;
        message = 'Database operation failed';
    }
  } else if (error instanceof Prisma.PrismaClientValidationError) {
    statusCode = 400;
    message = 'Invalid data provided';
  } else if (error.name === 'ValidationError') {
    statusCode = 400;
    message = error.message;
  } else if (error.name === 'CastError') {
    statusCode = 400;
    message = 'Invalid ID format';
  } else if (error.name === 'JsonWebTokenError') {
    statusCode = 401;
    message = 'Invalid token';
  } else if (error.name === 'TokenExpiredError') {
    statusCode = 401;
    message = 'Token has expired';
  } else if (error.name === 'MulterError') {
    statusCode = 400;
    message = 'File upload error';
  }

  // Don't leak error details in production
  if (process.env['NODE_ENV'] === 'production' && !isOperational) {
    message = 'Something went wrong';
  }

  const response: ApiResponse = {
    success: false,
    message,
    ...(process.env['NODE_ENV'] === 'development' && { error: error.message })
  };

  res.status(statusCode).json(response);
};

export const notFound = (req: Request, res: Response, next: NextFunction) => {
  const response: ApiResponse = {
    success: false,
    message: 'Route not found',
    error: `Cannot ${req.method} ${req.originalUrl}`
  };

  res.status(404).json(response);
};

export const asyncHandler = (fn: Function) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};
