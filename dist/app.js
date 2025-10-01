"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
const express_handlebars_1 = require("express-handlebars");
const body_parser_1 = __importDefault(require("body-parser"));
const method_override_1 = __importDefault(require("method-override"));
const express_session_1 = __importDefault(require("express-session"));
const connect_flash_1 = __importDefault(require("connect-flash"));
const cors_1 = __importDefault(require("cors"));
const passport_1 = __importDefault(require("passport"));
const express_fileupload_1 = __importDefault(require("express-fileupload"));
const dotenv_1 = __importDefault(require("dotenv"));
const prisma_1 = require("./lib/prisma");
const security_1 = require("./middleware/security");
const performance_1 = require("./middleware/performance");
const errorHandler_1 = require("./middleware/errorHandler");
dotenv_1.default.config();
const app = (0, express_1.default)();
(0, performance_1.initRedis)().catch(console.error);
(0, errorHandler_1.handleUncaughtException)();
(0, errorHandler_1.handleUnhandledRejection)();
console.log('Connecting to PostgreSQL...');
prisma_1.prisma.$connect().then(() => {
    console.log('PostgreSQL connection has been established successfully.');
}).catch((error) => {
    console.log(`ERROR CONNECTING TO POSTGRESQL: ` + error);
    console.log('Server will continue running without database connection');
});
app.use(security_1.helmetConfig);
app.use(security_1.securityHeaders);
app.use(security_1.sanitizeRequest);
app.use((0, cors_1.default)(security_1.corsOptions));
app.use(performance_1.compressionMiddleware);
app.use(performance_1.morganMiddleware);
app.use(performance_1.responseTime);
app.use(performance_1.memoryMonitor);
app.use(security_1.generalRateLimit);
app.use(express_1.default.static(path_1.default.join(__dirname, 'public')));
const admin_helpers_1 = require("./helpers/admin-helpers");
app.engine('handlebars', (0, express_handlebars_1.engine)({
    defaultLayout: 'admin',
    helpers: {
        select: admin_helpers_1.select,
        formatDate: admin_helpers_1.formatDate,
        paginate: admin_helpers_1.paginate
    }
}));
app.set('view engine', 'handlebars');
app.use((0, express_fileupload_1.default)({
    limits: {
        fileSize: parseInt(process.env['MAX_FILE_SIZE'] || '5242880')
    },
    abortOnLimit: true,
    responseOnLimit: 'File size limit has been reached',
    limitHandler: (_req, res, _next) => {
        res.status(413).json({
            error: 'File too large',
            message: 'File size exceeds the limit'
        });
    }
}));
app.use(security_1.fileUploadSecurity);
app.use(body_parser_1.default.urlencoded({
    extended: true,
    limit: '10mb'
}));
app.use(body_parser_1.default.json({
    limit: '10mb'
}));
app.use((0, method_override_1.default)('_method'));
const index_1 = __importDefault(require("./routes/login/index"));
const auth_1 = __importDefault(require("./routes/api/auth"));
const users_1 = __importDefault(require("./routes/api/users"));
const tasks_1 = __importDefault(require("./routes/api/tasks"));
const roles_1 = __importDefault(require("./routes/api/roles"));
const cabinets_1 = __importDefault(require("./routes/api/cabinets"));
const jobs_1 = __importDefault(require("./routes/api/jobs"));
const reports_1 = __importDefault(require("./routes/api/reports"));
const reinstatements_1 = __importDefault(require("./routes/api/reinstatements"));
const dashboard_1 = __importDefault(require("./routes/api/dashboard"));
const images_1 = __importDefault(require("./routes/api/images"));
app.use((0, express_session_1.default)({
    secret: process.env['SESSION_SECRET'] || 'your-super-secret-session-key-change-this-in-production',
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: process.env['NODE_ENV'] === 'production',
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000
    }
}));
app.use((0, connect_flash_1.default)());
app.use(passport_1.default.initialize());
app.use(passport_1.default.session());
app.use((req, res, next) => {
    res.locals.user = req.user || null;
    res.locals.success_message = req.flash('success_message');
    res.locals.error_message = req.flash('error_message');
    res.locals.info_message = req.flash('info_message');
    res.locals.error = req.flash('error');
    next();
});
app.get('/health', performance_1.healthCheck);
app.use('/', index_1.default);
app.use('/api/auth', security_1.authRateLimit, auth_1.default);
app.use('/api/users', users_1.default);
app.use('/api/tasks', tasks_1.default);
app.use('/api/roles', roles_1.default);
app.use('/api/cabinets', cabinets_1.default);
app.use('/api/jobs', jobs_1.default);
app.use('/api/reports', reports_1.default);
app.use('/api/reinstatements', reinstatements_1.default);
app.use('/api/dashboard', dashboard_1.default);
app.use('/api/images', images_1.default);
app.use(errorHandler_1.notFound);
app.use(errorHandler_1.errorHandler);
const port = process.env['PORT'] || 8888;
const server = app.listen(port, () => {
    console.log(`🚀 Server running on port ${port}`);
    console.log(`📊 Health check available at http://localhost:${port}/health`);
    console.log(`🌍 Environment: ${process.env['NODE_ENV'] || 'development'}`);
});
process.on('SIGTERM', async () => {
    console.log('SIGTERM received, shutting down gracefully');
    server.close(async () => {
        await (0, performance_1.cleanup)();
        process.exit(0);
    });
});
process.on('SIGINT', async () => {
    console.log('SIGINT received, shutting down gracefully');
    server.close(async () => {
        await (0, performance_1.cleanup)();
        process.exit(0);
    });
});
//# sourceMappingURL=app.js.map