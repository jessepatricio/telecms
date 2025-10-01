import { Request, Response, NextFunction } from 'express';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';

// Rate limiting configuration
export const createRateLimit = (windowMs: number, max: number, message?: string) => {
  return rateLimit({
    windowMs,
    max,
    message: message || 'Too many requests from this IP, please try again later.',
    standardHeaders: true,
    legacyHeaders: false,
    handler: (_req: Request, res: Response) => {
      res.status(429).json({
        error: 'Too many requests',
        message: 'Rate limit exceeded. Please try again later.',
        retryAfter: Math.round(windowMs / 1000)
      });
    }
  });
};

// General rate limiting
export const generalRateLimit = createRateLimit(
  parseInt(process.env['RATE_LIMIT_WINDOW_MS'] || '900000'), // 15 minutes
  parseInt(process.env['RATE_LIMIT_MAX_REQUESTS'] || '100')
);

// Strict rate limiting for auth endpoints
export const authRateLimit = createRateLimit(
  15 * 60 * 1000, // 15 minutes
  5, // 5 attempts
  'Too many login attempts, please try again later.'
);

// File upload rate limiting
export const uploadRateLimit = createRateLimit(
  60 * 1000, // 1 minute
  10, // 10 uploads per minute
  'Too many file uploads, please try again later.'
);

// CORS configuration
export const corsOptions = {
  origin: (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => {
    const allowedOrigins = process.env['CORS_ORIGIN']?.split(',') || ['http://localhost:3000'];
    
    // Allow requests with no origin (mobile apps, Postman, etc.)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'), false);
    }
  },
  credentials: true,
  optionsSuccessStatus: 200,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
};

// Helmet security configuration
export const helmetConfig = helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: ["'self'"],
      fontSrc: ["'self'"],
      objectSrc: ["'none'"],
      mediaSrc: ["'self'"],
      frameSrc: ["'none'"],
    },
  },
  crossOriginEmbedderPolicy: false,
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true
  }
});

// Request sanitization middleware
export const sanitizeRequest = (req: Request, _res: Response, next: NextFunction): void => {
  // Remove any potential XSS attempts
  const sanitize = (obj: any): any => {
    if (typeof obj === 'string') {
      return obj
        .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
        .replace(/<[^>]*>/g, '')
        .trim();
    }
    if (typeof obj === 'object' && obj !== null) {
      const sanitized: any = {};
      for (const key in obj) {
        if (obj.hasOwnProperty(key)) {
          sanitized[key] = sanitize(obj[key]);
        }
      }
      return sanitized;
    }
    return obj;
  };

  if (req.body) {
    req.body = sanitize(req.body);
  }
  if (req.query) {
    req.query = sanitize(req.query);
  }
  if (req.params) {
    req.params = sanitize(req.params);
  }

  next();
};

// IP whitelist middleware (optional)
export const ipWhitelist = (allowedIPs: string[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const clientIP = req.ip || req.connection.remoteAddress || req.socket.remoteAddress;
    
    if (allowedIPs.length === 0 || allowedIPs.includes(clientIP || '')) {
      next();
    } else {
      res.status(403).json({
        error: 'Forbidden',
        message: 'Access denied from this IP address'
      });
    }
  };
};

// Request size limiter
export const requestSizeLimit = (maxSize: string) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const contentLength = parseInt(req.get('content-length') || '0');
    const maxBytes = parseInt(maxSize.replace(/\D/g, ''));
    
    if (contentLength > maxBytes) {
      res.status(413).json({
        error: 'Payload Too Large',
        message: `Request size exceeds ${maxSize} limit`
      });
      return;
    }
    
    next();
  };
};

// Security headers middleware
export const securityHeaders = (_req: Request, res: Response, next: NextFunction): void => {
  // Remove X-Powered-By header
  res.removeHeader('X-Powered-By');
  
  // Add security headers
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('Permissions-Policy', 'geolocation=(), microphone=(), camera=()');
  
  next();
};

// File upload security
export const fileUploadSecurity = (req: Request, res: Response, next: NextFunction): void => {
  const allowedTypes = process.env['ALLOWED_FILE_TYPES']?.split(',') || [
    'image/jpeg',
    'image/png',
    'image/gif',
    'image/webp'
  ];
  
  const maxSize = parseInt(process.env['MAX_FILE_SIZE'] || '5242880'); // 5MB default
  
  if (req.files) {
    const files = Array.isArray(req.files) ? req.files : Object.values(req.files).flat();
    
    for (const file of files) {
      if (!allowedTypes.includes(file.mimetype)) {
        res.status(400).json({
          error: 'Invalid file type',
          message: `File type ${file.mimetype} is not allowed`
        });
        return;
      }
      
      if (file.size > maxSize) {
        res.status(400).json({
          error: 'File too large',
          message: `File size exceeds ${maxSize} bytes limit`
        });
        return;
      }
    }
  }
  
  next();
};
