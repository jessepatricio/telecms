"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const morgan_1 = __importDefault(require("morgan"));
const database_1 = require("@/utils/database");
const logger_1 = __importDefault(require("@/utils/logger"));
const cors_1 = __importDefault(require("@/middleware/cors"));
const security_1 = require("@/middleware/security");
const rateLimiter_1 = require("@/middleware/rateLimiter");
const errorHandler_1 = require("@/middleware/errorHandler");
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env['PORT'] || 8888;
app.set('trust proxy', 1);
app.use(security_1.helmetConfig);
app.use(security_1.securityHeaders);
app.use(security_1.sanitizeRequest);
app.use(cors_1.default);
app.use((0, morgan_1.default)('combined', {
    stream: {
        write: (message) => logger_1.default.info(message.trim())
    }
}));
app.use(express_1.default.json({ limit: '10mb' }));
app.use(express_1.default.urlencoded({ extended: true, limit: '10mb' }));
app.use(rateLimiter_1.generalRateLimit);
app.get('/health', (_req, res) => {
    res.json({
        success: true,
        message: 'Server is healthy',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        environment: process.env['NODE_ENV'] || 'development'
    });
});
const swagger_1 = require("@/middleware/swagger");
const authRoutes_1 = __importDefault(require("@/routes/authRoutes"));
const userRoutes_1 = __importDefault(require("@/routes/userRoutes"));
const imageRoutes_1 = __importDefault(require("@/routes/imageRoutes"));
app.use('/api-docs', swagger_1.swaggerUiHandler, swagger_1.swaggerUiSetup);
app.get('/api-docs.json', swagger_1.swaggerJsonHandler);
app.get('/api-docs/health', swagger_1.swaggerHealthHandler);
app.use('/api/auth', authRoutes_1.default);
app.use('/api/users', userRoutes_1.default);
app.use('/api/images', imageRoutes_1.default);
app.use(errorHandler_1.notFound);
app.use(errorHandler_1.errorHandler);
const startServer = async () => {
    try {
        await database_1.prisma.$connect();
        logger_1.default.info('Database connected successfully');
        const server = app.listen(PORT, () => {
            logger_1.default.info(`🚀 Server running on port ${PORT}`);
            logger_1.default.info(`📊 Health check available at http://localhost:${PORT}/health`);
            logger_1.default.info(`🌍 Environment: ${process.env['NODE_ENV'] || 'development'}`);
        });
        const gracefulShutdown = async (signal) => {
            logger_1.default.info(`${signal} received, shutting down gracefully`);
            server.close(async () => {
                logger_1.default.info('HTTP server closed');
                try {
                    await database_1.prisma.$disconnect();
                    logger_1.default.info('Database connection closed');
                    process.exit(0);
                }
                catch (error) {
                    logger_1.default.error('Error during shutdown:', error);
                    process.exit(1);
                }
            });
        };
        process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
        process.on('SIGINT', () => gracefulShutdown('SIGINT'));
    }
    catch (error) {
        logger_1.default.error('Failed to start server:', error);
        process.exit(1);
    }
};
process.on('uncaughtException', (error) => {
    logger_1.default.error('Uncaught Exception:', error);
    process.exit(1);
});
process.on('unhandledRejection', (reason, promise) => {
    logger_1.default.error('Unhandled Rejection at:', promise, 'reason:', reason);
    process.exit(1);
});
startServer();
exports.default = app;
//# sourceMappingURL=server.js.map