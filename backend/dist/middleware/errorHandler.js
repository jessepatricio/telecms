"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.asyncHandler = exports.notFound = exports.errorHandler = exports.AppError = void 0;
const client_1 = require("@prisma/client");
const logger_1 = __importDefault(require("@/utils/logger"));
class AppError extends Error {
    statusCode;
    isOperational;
    constructor(message, statusCode = 500, isOperational = true) {
        super(message);
        this.statusCode = statusCode;
        this.isOperational = isOperational;
        Error.captureStackTrace(this, this.constructor);
    }
}
exports.AppError = AppError;
const errorHandler = (error, req, res, next) => {
    let statusCode = 500;
    let message = 'Internal Server Error';
    let isOperational = false;
    logger_1.default.error('Error occurred:', {
        error: error.message,
        stack: error.stack,
        url: req.url,
        method: req.method,
        ip: req.ip,
        userAgent: req.get('User-Agent')
    });
    if (error instanceof AppError) {
        statusCode = error.statusCode;
        message = error.message;
        isOperational = error.isOperational;
    }
    else if (error instanceof client_1.Prisma.PrismaClientKnownRequestError) {
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
    }
    else if (error instanceof client_1.Prisma.PrismaClientValidationError) {
        statusCode = 400;
        message = 'Invalid data provided';
    }
    else if (error.name === 'ValidationError') {
        statusCode = 400;
        message = error.message;
    }
    else if (error.name === 'CastError') {
        statusCode = 400;
        message = 'Invalid ID format';
    }
    else if (error.name === 'JsonWebTokenError') {
        statusCode = 401;
        message = 'Invalid token';
    }
    else if (error.name === 'TokenExpiredError') {
        statusCode = 401;
        message = 'Token has expired';
    }
    else if (error.name === 'MulterError') {
        statusCode = 400;
        const multerError = error;
        switch (multerError.code) {
            case 'LIMIT_FILE_SIZE':
                message = 'File too large. Maximum size is 10MB.';
                statusCode = 413;
                break;
            case 'LIMIT_FILE_COUNT':
                message = 'Too many files. Maximum is 5 files.';
                break;
            case 'LIMIT_UNEXPECTED_FILE':
                message = 'Unexpected field name in file upload.';
                break;
            case 'LIMIT_PART_COUNT':
                message = 'Too many parts in the multipart request.';
                break;
            case 'LIMIT_FIELD_COUNT':
                message = 'Too many fields in the request.';
                break;
            case 'LIMIT_FIELD_KEY':
                message = 'Field name too long.';
                break;
            case 'LIMIT_FIELD_VALUE':
                message = 'Field value too long.';
                break;
            default:
                message = 'File upload error occurred.';
        }
    }
    if (process.env['NODE_ENV'] === 'production' && !isOperational) {
        message = 'Something went wrong';
    }
    const response = {
        success: false,
        message,
        ...(process.env['NODE_ENV'] === 'development' && { error: error.message })
    };
    res.status(statusCode).json(response);
};
exports.errorHandler = errorHandler;
const notFound = (req, res, next) => {
    const response = {
        success: false,
        message: 'Route not found',
        error: `Cannot ${req.method} ${req.originalUrl}`
    };
    res.status(404).json(response);
};
exports.notFound = notFound;
const asyncHandler = (fn) => {
    return (req, res, next) => {
        Promise.resolve(fn(req, res, next)).catch(next);
    };
};
exports.asyncHandler = asyncHandler;
//# sourceMappingURL=errorHandler.js.map