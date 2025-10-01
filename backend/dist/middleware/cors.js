"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cors_1 = __importDefault(require("cors"));
const corsOptions = {
    origin: (origin, callback) => {
        if (!origin)
            return callback(null, true);
        const allowedOrigins = [
            process.env['CORS_ORIGIN'] || 'http://localhost:3001',
            'http://localhost:3000',
            'http://localhost:3001',
            'http://127.0.0.1:3001',
            'http://127.0.0.1:3000'
        ];
        if (allowedOrigins.includes(origin)) {
            callback(null, true);
        }
        else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: [
        'Origin',
        'X-Requested-With',
        'Content-Type',
        'Accept',
        'Authorization',
        'Cache-Control',
        'Pragma'
    ],
    exposedHeaders: ['X-Total-Count', 'X-Page-Count'],
    maxAge: 86400
};
exports.default = (0, cors_1.default)(corsOptions);
//# sourceMappingURL=cors.js.map