import express from 'express';
import dotenv from 'dotenv';
import morgan from 'morgan';
import { prisma } from '@/utils/database';
import logger from '@/utils/logger';
import cors from '@/middleware/cors';
import { helmetConfig, securityHeaders, sanitizeRequest } from '@/middleware/security';
import { generalRateLimit } from '@/middleware/rateLimiter';
import { errorHandler, notFound } from '@/middleware/errorHandler';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env['PORT'] || 8888;

// Trust proxy for accurate IP addresses
app.set('trust proxy', 1);

// Security middleware
app.use(helmetConfig);
app.use(securityHeaders);
app.use(sanitizeRequest);

// CORS
app.use(cors);

// Logging
app.use(morgan('combined', {
  stream: {
    write: (message: string) => logger.info(message.trim())
  }
}));

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Rate limiting
app.use(generalRateLimit);

// Health check endpoint
app.get('/health', (_req, res) => {
  res.json({
    success: true,
    message: 'Server is healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env['NODE_ENV'] || 'development'
  });
});

// Import Swagger
import swaggerSpecs from '@/config/swagger';
import { swaggerUiHandler, swaggerUiSetup, swaggerJsonHandler, swaggerHealthHandler } from '@/middleware/swagger';

// Import routes
import authRoutes from '@/routes/authRoutes';
import userRoutes from '@/routes/userRoutes';
import imageRoutes from '@/routes/imageRoutes';

// Swagger Documentation
app.use('/api-docs', swaggerUiHandler, swaggerUiSetup);
app.get('/api-docs.json', swaggerJsonHandler);
app.get('/api-docs/health', swaggerHealthHandler);

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/images', imageRoutes);
// app.use('/api/tasks', taskRoutes);
// app.use('/api/roles', roleRoutes);
// app.use('/api/cabinets', cabinetRoutes);
// app.use('/api/jobs', jobRoutes);
// app.use('/api/reinstatements', reinstatementRoutes);
// app.use('/api/dashboard', dashboardRoutes);

// 404 handler
app.use(notFound);

// Error handling middleware (must be last)
app.use(errorHandler);

// Database connection and server startup
const startServer = async () => {
  try {
    // Test database connection
    await prisma.$connect();
    logger.info('Database connected successfully');

    // Start server
    const server = app.listen(PORT, () => {
      logger.info(`🚀 Server running on port ${PORT}`);
      logger.info(`📊 Health check available at http://localhost:${PORT}/health`);
      logger.info(`🌍 Environment: ${process.env['NODE_ENV'] || 'development'}`);
    });

    // Graceful shutdown
    const gracefulShutdown = async (signal: string) => {
      logger.info(`${signal} received, shutting down gracefully`);
      
      server.close(async () => {
        logger.info('HTTP server closed');
        
        try {
          await prisma.$disconnect();
          logger.info('Database connection closed');
          process.exit(0);
        } catch (error) {
          logger.error('Error during shutdown:', error);
          process.exit(1);
        }
      });
    };

    process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
    process.on('SIGINT', () => gracefulShutdown('SIGINT'));

  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
};

// Handle uncaught exceptions and unhandled rejections
process.on('uncaughtException', (error) => {
  logger.error('Uncaught Exception:', error);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  logger.error('Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

// Start the server
startServer();

export default app;
