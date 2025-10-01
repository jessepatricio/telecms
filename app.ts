import express from 'express';
import path from 'path';
import { engine as exphbs } from 'express-handlebars';
import bodyParser from 'body-parser';
import methodOverride from 'method-override';
import session from 'express-session';
import flash from 'connect-flash';
import cors from 'cors';
import passport from 'passport';
import upload from 'express-fileupload';
import dotenv from 'dotenv';
import { prisma } from './lib/prisma';

// Import middleware
import { 
  generalRateLimit, 
  authRateLimit, 
  corsOptions, 
  helmetConfig, 
  sanitizeRequest, 
  securityHeaders, 
  fileUploadSecurity 
} from './middleware/security';
import { 
  compressionMiddleware, 
  morganMiddleware, 
  responseTime, 
  memoryMonitor, 
  healthCheck, 
  initRedis, 
  cleanup 
} from './middleware/performance';
import { 
  errorHandler, 
  notFound, 
  handleUnhandledRejection, 
  handleUncaughtException 
} from './middleware/errorHandler';

// Load environment variables
dotenv.config();

const app = express();

// Initialize Redis
initRedis().catch(console.error);

// Handle uncaught exceptions and unhandled rejections
handleUncaughtException();
handleUnhandledRejection();

// Test PostgreSQL connection
console.log('Connecting to PostgreSQL...');
prisma.$connect().then(() => {
    console.log('PostgreSQL connection has been established successfully.');
}).catch((error: any) => {
    console.log(`ERROR CONNECTING TO POSTGRESQL: ` + error);
    console.log('Server will continue running without database connection');
});

// Security middleware
app.use(helmetConfig);
app.use(securityHeaders);
app.use(sanitizeRequest);

// CORS configuration
app.use(cors(corsOptions));

// Performance middleware
app.use(compressionMiddleware);
app.use(morganMiddleware);
app.use(responseTime);
app.use(memoryMonitor);

// Rate limiting
app.use(generalRateLimit);

//using static (enable use of css/js/etc)
app.use(express.static(path.join(__dirname, 'public')));

//use helpers function
import {
    select,
    formatDate,
    paginate
} from './helpers/admin-helpers';

//set view engine
app.engine('handlebars', exphbs({
    defaultLayout: 'admin',
    helpers: {
        select: select,
        formatDate: formatDate,
        paginate: paginate
    }
}));
app.set('view engine', 'handlebars');

// File upload middleware with security
app.use(upload({
    limits: {
        fileSize: parseInt(process.env['MAX_FILE_SIZE'] || '5242880') // 5MB default
    },
    abortOnLimit: true,
    responseOnLimit: 'File size limit has been reached',
    limitHandler: (_req: any, res: any, _next: any) => {
        res.status(413).json({
            error: 'File too large',
            message: 'File size exceeds the limit'
        });
    }
}));

app.use(fileUploadSecurity);

// Body parser with size limits
app.use(bodyParser.urlencoded({
    extended: true,
    limit: '10mb'
}));

app.use(bodyParser.json({
    limit: '10mb'
}));

//method override
app.use(methodOverride('_method'));

//load routes - only login route for legacy support
import login from './routes/login/index';

//load API routes
import authApi from './routes/api/auth';
import usersApi from './routes/api/users';
import tasksApi from './routes/api/tasks';
import rolesApi from './routes/api/roles';
import cabinetsApi from './routes/api/cabinets';
import jobsApi from './routes/api/jobs';
import reportsApi from './routes/api/reports';
import reinstatementsApi from './routes/api/reinstatements';
import dashboardApi from './routes/api/dashboard';
import imagesApi from './routes/api/images';

// Session configuration with security
app.use(session({
    secret: process.env['SESSION_SECRET'] || 'your-super-secret-session-key-change-this-in-production',
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: process.env['NODE_ENV'] === 'production',
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000 // 24 hours
    }
}));

app.use(flash());

//passport
app.use(passport.initialize());
app.use(passport.session());

//local variables using middleware
app.use((req: express.Request, res: express.Response, next: express.NextFunction) => {
    (res.locals as any).user = (req as any).user || null;
    (res.locals as any).success_message = (req as any).flash('success_message');
    (res.locals as any).error_message = (req as any).flash('error_message');
    (res.locals as any).info_message = (req as any).flash('info_message');
    (res.locals as any).error = (req as any).flash('error');
    next();
});

// Health check endpoint
app.get('/health', healthCheck);

// Use routes
app.use('/', login);

// API routes with specific rate limiting
app.use('/api/auth', authRateLimit, authApi);
app.use('/api/users', usersApi);
app.use('/api/tasks', tasksApi);
app.use('/api/roles', rolesApi);
app.use('/api/cabinets', cabinetsApi);
app.use('/api/jobs', jobsApi);
app.use('/api/reports', reportsApi);
app.use('/api/reinstatements', reinstatementsApi);
app.use('/api/dashboard', dashboardApi);
app.use('/api/images', imagesApi);

// 404 handler
app.use(notFound);

// Error handling middleware (must be last)
app.use(errorHandler);

const port = process.env['PORT'] || 8888;

const server = app.listen(port, () => {
    console.log(`🚀 Server running on port ${port}`);
    console.log(`📊 Health check available at http://localhost:${port}/health`);
    console.log(`🌍 Environment: ${process.env['NODE_ENV'] || 'development'}`);
});

// Graceful shutdown
process.on('SIGTERM', async () => {
    console.log('SIGTERM received, shutting down gracefully');
    server.close(async () => {
        await cleanup();
        process.exit(0);
    });
});

process.on('SIGINT', async () => {
    console.log('SIGINT received, shutting down gracefully');
    server.close(async () => {
        await cleanup();
        process.exit(0);
    });
});
