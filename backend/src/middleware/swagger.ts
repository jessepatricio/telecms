import swaggerUi from 'swagger-ui-express';
import { Request, Response, NextFunction } from 'express';
import swaggerSpecs from '@/config/swagger';

// Swagger UI options
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
    requestInterceptor: (req: any) => {
      // Add any custom request modifications here
      return req;
    },
    responseInterceptor: (res: any) => {
      // Add any custom response modifications here
      return res;
    }
  }
};

// Serve Swagger UI
export const swaggerUiHandler = swaggerUi.serve;
export const swaggerUiSetup = swaggerUi.setup(swaggerSpecs, swaggerUiOptions);

// Serve Swagger JSON
export const swaggerJsonHandler = (req: Request, res: Response, next: NextFunction) => {
  res.setHeader('Content-Type', 'application/json');
  res.send(swaggerSpecs);
};

// Serve Swagger UI HTML
export const swaggerUiHtmlHandler = (req: Request, res: Response, next: NextFunction) => {
  const html = swaggerUi.generateHTML(swaggerSpecs, swaggerUiOptions);
  res.send(html);
};

// Health check for Swagger
export const swaggerHealthHandler = (req: Request, res: Response, next: NextFunction) => {
  res.json({
    success: true,
    message: 'Swagger documentation is available',
    endpoints: {
      ui: '/api-docs',
      json: '/api-docs.json',
      health: '/api-docs/health'
    },
    version: (swaggerSpecs as any).info?.version || '1.0.0',
    openapi: (swaggerSpecs as any).openapi || '3.0.0'
  });
};
