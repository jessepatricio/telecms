import { Request, Response, NextFunction } from 'express';
import compression from 'compression';
import morgan from 'morgan';
import { createClient } from 'redis';

// Redis client for caching
let redisClient: ReturnType<typeof createClient> | null = null;

// Initialize Redis connection
export const initRedis = async (): Promise<void> => {
  try {
    redisClient = createClient({
      url: process.env['REDIS_URL'] || 'redis://localhost:6379'
    });

    redisClient.on('error', (err) => {
      console.error('Redis Client Error:', err);
    });

    redisClient.on('connect', () => {
      console.log('Redis Client Connected');
    });

    await redisClient.connect();
  } catch (error) {
    console.error('Failed to connect to Redis:', error);
    redisClient = null;
  }
};

// Get Redis client
export const getRedisClient = () => redisClient;

// Compression middleware
export const compressionMiddleware = compression({
  level: 6,
  threshold: 1024, // Only compress responses larger than 1KB
  filter: (req: Request, res: Response) => {
    if (req.headers['x-no-compression']) {
      return false;
    }
    return compression.filter(req, res);
  }
});

// Morgan logging middleware
export const morganMiddleware = morgan(
  process.env['NODE_ENV'] === 'production' 
    ? 'combined' 
    : 'dev',
  {
    skip: (req: Request, _res: Response) => {
      // Skip logging for health checks and static files
      return req.url === '/health' || req.url.startsWith('/static/');
    }
  }
);

// Response time middleware
export const responseTime = (_req: Request, res: Response, next: NextFunction): void => {
  const start = Date.now();
  
  res.on('finish', () => {
    const duration = Date.now() - start;
    res.setHeader('X-Response-Time', `${duration}ms`);
  });
  
  next();
};

// Cache middleware
export const cache = (ttl: number = 300) => {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    if (!redisClient || req.method !== 'GET') {
      return next();
    }

    const key = `cache:${req.originalUrl}`;
    
    try {
      const cached = await redisClient.get(key);
      if (cached) {
        res.setHeader('X-Cache', 'HIT');
        res.json(JSON.parse(cached));
        return;
      }
    } catch (error) {
      console.error('Cache read error:', error);
    }

    // Store original json method
    const originalJson = res.json;
    
    // Override json method to cache response
    res.json = function(body: any) {
      // Cache the response
      if (redisClient) {
        redisClient.setEx(key, ttl, JSON.stringify(body))
          .catch((error) => console.error('Cache write error:', error));
      }
      
      res.setHeader('X-Cache', 'MISS');
      return originalJson.call(this, body);
    };

    next();
  };
};

// Database query optimization middleware
export const optimizeQueries = (req: Request, _res: Response, next: NextFunction): void => {
  // Add query optimization hints to request
  (req as any).queryOptions = {
    include: req.query['include'] ? JSON.parse(req.query['include'] as string) : undefined,
    select: req.query['select'] ? JSON.parse(req.query['select'] as string) : undefined,
    take: req.query['limit'] ? parseInt(req.query['limit'] as string) : undefined,
    skip: req.query['offset'] ? parseInt(req.query['offset'] as string) : undefined,
    orderBy: req.query['orderBy'] ? JSON.parse(req.query['orderBy'] as string) : undefined
  };
  
  next();
};

// Pagination middleware
export const pagination = (req: Request, _res: Response, next: NextFunction): void => {
  const page = parseInt(req.query['page'] as string) || 1;
  const limit = Math.min(parseInt(req.query['limit'] as string) || 10, 100); // Max 100 items per page
  const offset = (page - 1) * limit;

  (req as any).pagination = {
    page,
    limit,
    offset
  };

  next();
};

// Memory usage monitoring
export const memoryMonitor = (_req: Request, res: Response, next: NextFunction): void => {
  const memUsage = process.memoryUsage();
  const memUsageMB = {
    rss: Math.round(memUsage.rss / 1024 / 1024),
    heapTotal: Math.round(memUsage.heapTotal / 1024 / 1024),
    heapUsed: Math.round(memUsage.heapUsed / 1024 / 1024),
    external: Math.round(memUsage.external / 1024 / 1024)
  };

  res.setHeader('X-Memory-Usage', JSON.stringify(memUsageMB));
  
  // Log warning if memory usage is high
  if (memUsage.heapUsed / memUsage.heapTotal > 0.8) {
    console.warn('High memory usage detected:', memUsageMB);
  }

  next();
};

// Request timeout middleware
export const requestTimeout = (timeout: number = 30000) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    req.setTimeout(timeout, () => {
      if (!res.headersSent) {
        res.status(408).json({
          error: 'Request Timeout',
          message: 'Request took too long to process'
        });
      }
    });
    
    next();
  };
};

// Health check endpoint
export const healthCheck = (_req: Request, res: Response): void => {
  const health = {
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    memory: process.memoryUsage(),
    version: process.env['npm_package_version'] || '1.0.0',
    environment: process.env['NODE_ENV'] || 'development'
  };

  res.status(200).json(health);
};

// Cleanup function for graceful shutdown
export const cleanup = async (): Promise<void> => {
  if (redisClient) {
    try {
      await redisClient.quit();
      console.log('Redis connection closed');
    } catch (error) {
      console.error('Error closing Redis connection:', error);
    }
  }
};
