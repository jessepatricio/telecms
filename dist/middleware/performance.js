"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.cleanup = exports.healthCheck = exports.requestTimeout = exports.memoryMonitor = exports.pagination = exports.optimizeQueries = exports.cache = exports.responseTime = exports.morganMiddleware = exports.compressionMiddleware = exports.getRedisClient = exports.initRedis = void 0;
const compression_1 = __importDefault(require("compression"));
const morgan_1 = __importDefault(require("morgan"));
const redis_1 = require("redis");
let redisClient = null;
const initRedis = async () => {
    try {
        redisClient = (0, redis_1.createClient)({
            url: process.env['REDIS_URL'] || 'redis://localhost:6379'
        });
        redisClient.on('error', (err) => {
            console.error('Redis Client Error:', err);
        });
        redisClient.on('connect', () => {
            console.log('Redis Client Connected');
        });
        await redisClient.connect();
    }
    catch (error) {
        console.error('Failed to connect to Redis:', error);
        redisClient = null;
    }
};
exports.initRedis = initRedis;
const getRedisClient = () => redisClient;
exports.getRedisClient = getRedisClient;
exports.compressionMiddleware = (0, compression_1.default)({
    level: 6,
    threshold: 1024,
    filter: (req, res) => {
        if (req.headers['x-no-compression']) {
            return false;
        }
        return compression_1.default.filter(req, res);
    }
});
exports.morganMiddleware = (0, morgan_1.default)(process.env['NODE_ENV'] === 'production'
    ? 'combined'
    : 'dev', {
    skip: (req, _res) => {
        return req.url === '/health' || req.url.startsWith('/static/');
    }
});
const responseTime = (_req, res, next) => {
    const start = Date.now();
    res.on('finish', () => {
        const duration = Date.now() - start;
        res.setHeader('X-Response-Time', `${duration}ms`);
    });
    next();
};
exports.responseTime = responseTime;
const cache = (ttl = 300) => {
    return async (req, res, next) => {
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
        }
        catch (error) {
            console.error('Cache read error:', error);
        }
        const originalJson = res.json;
        res.json = function (body) {
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
exports.cache = cache;
const optimizeQueries = (req, _res, next) => {
    req.queryOptions = {
        include: req.query['include'] ? JSON.parse(req.query['include']) : undefined,
        select: req.query['select'] ? JSON.parse(req.query['select']) : undefined,
        take: req.query['limit'] ? parseInt(req.query['limit']) : undefined,
        skip: req.query['offset'] ? parseInt(req.query['offset']) : undefined,
        orderBy: req.query['orderBy'] ? JSON.parse(req.query['orderBy']) : undefined
    };
    next();
};
exports.optimizeQueries = optimizeQueries;
const pagination = (req, _res, next) => {
    const page = parseInt(req.query['page']) || 1;
    const limit = Math.min(parseInt(req.query['limit']) || 10, 100);
    const offset = (page - 1) * limit;
    req.pagination = {
        page,
        limit,
        offset
    };
    next();
};
exports.pagination = pagination;
const memoryMonitor = (_req, res, next) => {
    const memUsage = process.memoryUsage();
    const memUsageMB = {
        rss: Math.round(memUsage.rss / 1024 / 1024),
        heapTotal: Math.round(memUsage.heapTotal / 1024 / 1024),
        heapUsed: Math.round(memUsage.heapUsed / 1024 / 1024),
        external: Math.round(memUsage.external / 1024 / 1024)
    };
    res.setHeader('X-Memory-Usage', JSON.stringify(memUsageMB));
    if (memUsage.heapUsed / memUsage.heapTotal > 0.8) {
        console.warn('High memory usage detected:', memUsageMB);
    }
    next();
};
exports.memoryMonitor = memoryMonitor;
const requestTimeout = (timeout = 30000) => {
    return (req, res, next) => {
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
exports.requestTimeout = requestTimeout;
const healthCheck = (_req, res) => {
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
exports.healthCheck = healthCheck;
const cleanup = async () => {
    if (redisClient) {
        try {
            await redisClient.quit();
            console.log('Redis connection closed');
        }
        catch (error) {
            console.error('Error closing Redis connection:', error);
        }
    }
};
exports.cleanup = cleanup;
//# sourceMappingURL=performance.js.map