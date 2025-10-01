"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logger = exports.asyncHandler = exports.notFound = exports.handleUncaughtException = exports.handleUnhandledRejection = exports.errorHandler = exports.AppError = void 0;
const client_1 = require("@prisma/client");
const winston_1 = __importDefault(require("winston"));
const logger = winston_1.default.createLogger({
    level: 'info',
    format: winston_1.default.format.combine(winston_1.default.format.timestamp(), winston_1.default.format.errors({ stack: true }), winston_1.default.format.json()),
    defaultMeta: { service: 'telecms-api' },
    transports: [
        new winston_1.default.transports.File({ filename: 'logs/error.log', level: 'error' }),
        new winston_1.default.transports.File({ filename: 'logs/combined.log' }),
    ],
});
exports.logger = logger;
if (process.env['NODE_ENV'] !== 'production') {
    logger.add(new winston_1.default.transports.Console({
        format: winston_1.default.format.simple()
    }));
}
class AppError extends Error {
    statusCode;
    isOperational;
    constructor(message, statusCode = 500) {
        super(message);
        this.statusCode = statusCode;
        this.isOperational = true;
        Error.captureStackTrace(this, this.constructor);
    }
}
exports.AppError = AppError;
const handlePrismaError = (error) => {
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
const handleJWTError = () => new AppError('Invalid token. Please log in again!', 401);
const handleJWTExpiredError = () => new AppError('Your token has expired! Please log in again.', 401);
const handleValidationError = (error) => {
    const errors = Object.values(error.errors).map((err) => err.message);
    const message = `Invalid input data. ${errors.join('. ')}`;
    return new AppError(message, 400);
};
const sendErrorDev = (err, res) => {
    res.status(err.statusCode || 500).json({
        status: 'error',
        error: err,
        message: err.message,
        stack: err.stack
    });
};
const sendErrorProd = (err, res) => {
    if (err.isOperational) {
        res.status(err.statusCode || 500).json({
            status: 'error',
            message: err.message
        });
    }
    else {
        logger.error('ERROR 💥', err);
        res.status(500).json({
            status: 'error',
            message: 'Something went wrong!'
        });
    }
};
const errorHandler = (err, req, res, _next) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';
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
    }
    else {
        let error = { ...err };
        error.message = err.message;
        if (err instanceof client_1.Prisma.PrismaClientKnownRequestError) {
            error = handlePrismaError(err);
        }
        else if (err.name === 'JsonWebTokenError') {
            error = handleJWTError();
        }
        else if (err.name === 'TokenExpiredError') {
            error = handleJWTExpiredError();
        }
        else if (err.name === 'ValidationError') {
            error = handleValidationError(err);
        }
        sendErrorProd(error, res);
    }
};
exports.errorHandler = errorHandler;
const handleUnhandledRejection = () => {
    process.on('unhandledRejection', (err) => {
        logger.error('UNHANDLED REJECTION! 💥 Shutting down...', err);
        process.exit(1);
    });
};
exports.handleUnhandledRejection = handleUnhandledRejection;
const handleUncaughtException = () => {
    process.on('uncaughtException', (err) => {
        logger.error('UNCAUGHT EXCEPTION! 💥 Shutting down...', err);
        process.exit(1);
    });
};
exports.handleUncaughtException = handleUncaughtException;
const notFound = (req, _res, next) => {
    const err = new AppError(`Not found - ${req.originalUrl}`, 404);
    next(err);
};
exports.notFound = notFound;
const asyncHandler = (fn) => {
    return (req, res, next) => {
        Promise.resolve(fn(req, res, next)).catch(next);
    };
};
exports.asyncHandler = asyncHandler;
//# sourceMappingURL=errorHandler.js.map