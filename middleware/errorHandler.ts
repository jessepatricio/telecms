import { Request, Response, NextFunction } from 'express';
import { Prisma } from '@prisma/client';
import winston from 'winston';

// Configure Winston logger
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  defaultMeta: { service: 'telecms-api' },
  transports: [
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
    new winston.transports.File({ filename: 'logs/combined.log' }),
  ],
});

// Add console transport in development
if (process.env['NODE_ENV'] !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.simple()
  }));
}

export interface ApiError extends Error {
  statusCode?: number;
  isOperational?: boolean;
}

// Custom error class
export class AppError extends Error implements ApiError {
  statusCode: number;
  isOperational: boolean;

  constructor(message: string, statusCode: number = 500) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

// Handle Prisma errors
const handlePrismaError = (error: Prisma.PrismaClientKnownRequestError): AppError => {
  switch (error.code) {
    case 'P2002':
      return new AppError('A record with this information already exists', 409);
    case 'P2025':
      return new AppError('Record not found', 404);
    case 'P2003':
      return new AppError('Foreign key constraint failed', 400);
    case 'P2014':
      return new AppError('Invalid ID provided', 400);
    case 'P2021':
      return new AppError('Table does not exist', 500);
    case 'P2022':
      return new AppError('Column does not exist', 500);
    default:
      return new AppError('Database operation failed', 500);
  }
};

// Handle JWT errors
const handleJWTError = (): AppError => new AppError('Invalid token. Please log in again!', 401);

const handleJWTExpiredError = (): AppError => new AppError('Your token has expired! Please log in again.', 401);

// Handle validation errors
const handleValidationError = (error: any): AppError => {
  const errors = Object.values(error.errors).map((err: any) => err.message);
  const message = `Invalid input data. ${errors.join('. ')}`;
  return new AppError(message, 400);
};

// Send error response
const sendErrorDev = (err: ApiError, res: Response): void => {
  res.status(err.statusCode || 500).json({
    status: 'error',
    error: err,
    message: err.message,
    stack: err.stack
  });
};

const sendErrorProd = (err: ApiError, res: Response): void => {
  // Operational, trusted error: send message to client
  if (err.isOperational) {
    res.status(err.statusCode || 500).json({
      status: 'error',
      message: err.message
    });
  } else {
    // Programming or other unknown error: don't leak error details
    logger.error('ERROR 💥', err);
    
    res.status(500).json({
      status: 'error',
      message: 'Something went wrong!'
    });
  }
};

// Main error handling middleware
export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  _next: NextFunction
): void => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  // Log error
  logger.error({
    message: err.message,
    stack: err.stack,
    url: req.url,
    method: req.method,
    ip: req.ip,
    userAgent: req.get('User-Agent')
  });

  if (process.env['NODE_ENV'] === 'development') {
    sendErrorDev(err, res);
  } else {
    let error = { ...err };
    error.message = err.message;

    // Handle specific error types
    if (err instanceof Prisma.PrismaClientKnownRequestError) {
      error = handlePrismaError(err);
    } else if (err.name === 'JsonWebTokenError') {
      error = handleJWTError();
    } else if (err.name === 'TokenExpiredError') {
      error = handleJWTExpiredError();
    } else if (err.name === 'ValidationError') {
      error = handleValidationError(err);
    }

    sendErrorProd(error, res);
  }
};

// Handle unhandled promise rejections
export const handleUnhandledRejection = (): void => {
  process.on('unhandledRejection', (err: any) => {
    logger.error('UNHANDLED REJECTION! 💥 Shutting down...', err);
    process.exit(1);
  });
};

// Handle uncaught exceptions
export const handleUncaughtException = (): void => {
  process.on('uncaughtException', (err: any) => {
    logger.error('UNCAUGHT EXCEPTION! 💥 Shutting down...', err);
    process.exit(1);
  });
};

// 404 handler
export const notFound = (req: Request, _res: Response, next: NextFunction): void => {
  const err = new AppError(`Not found - ${req.originalUrl}`, 404);
  next(err);
};

// Async error wrapper
export const asyncHandler = (fn: Function) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

export { logger };
