"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.swaggerHealthHandler = exports.swaggerUiHtmlHandler = exports.swaggerJsonHandler = exports.swaggerUiHandler = void 0;
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const swagger_1 = __importDefault(require("@/config/swagger"));
const swaggerUiOptions = {
    customCss: `
    .swagger-ui .topbar { display: none; }
    .swagger-ui .info .title { color: #3b82f6; }
    .swagger-ui .scheme-container { background: #f8fafc; padding: 20px; border-radius: 8px; }
    .swagger-ui .btn.authorize { background-color: #3b82f6; border-color: #3b82f6; }
    .swagger-ui .btn.authorize:hover { background-color: #2563eb; border-color: #2563eb; }
    .swagger-ui .btn.authorize svg { fill: white; }
  `,
    customSiteTitle: 'TCTS API Documentation',
    customfavIcon: '/favicon.ico',
    swaggerOptions: {
        persistAuthorization: true,
        displayRequestDuration: true,
        docExpansion: 'list',
        filter: true,
        showExtensions: true,
        showCommonExtensions: true,
        tryItOutEnabled: true,
        requestInterceptor: (req) => {
            return req;
        },
        responseInterceptor: (res) => {
            return res;
        }
    }
};
exports.swaggerUiHandler = swagger_ui_express_1.default.setup(swagger_1.default, swaggerUiOptions);
const swaggerJsonHandler = (req, res, next) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(swagger_1.default);
};
exports.swaggerJsonHandler = swaggerJsonHandler;
const swaggerUiHtmlHandler = (req, res, next) => {
    const html = swagger_ui_express_1.default.generateHTML(swagger_1.default, swaggerUiOptions);
    res.send(html);
};
exports.swaggerUiHtmlHandler = swaggerUiHtmlHandler;
const swaggerHealthHandler = (req, res, next) => {
    res.json({
        success: true,
        message: 'Swagger documentation is available',
        endpoints: {
            ui: '/api-docs',
            json: '/api-docs.json',
            health: '/api-docs/health'
        },
        version: swagger_1.default.info?.version || '1.0.0',
        openapi: swagger_1.default.openapi || '3.0.0'
    });
};
exports.swaggerHealthHandler = swaggerHealthHandler;
//# sourceMappingURL=swagger.js.map