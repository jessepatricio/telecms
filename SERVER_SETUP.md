# TeleCMS Server Setup Guide

## Overview

This document provides comprehensive setup instructions for the TeleCMS server implementation. The server has been modernized with security, performance, and maintainability improvements.

## Prerequisites

- Node.js 18+ 
- PostgreSQL 15+
- Redis (optional, for caching)
- Docker & Docker Compose (optional)

## Quick Start

### 1. Environment Setup

Create a `.env` file in the root directory:

```bash
cp config/env.example .env
```

Edit the `.env` file with your configuration:

```env
# Database Configuration
DATABASE_URL="postgresql://postgres:password@localhost:5432/telecmsdb?schema=public"

# JWT Configuration
JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"
JWT_EXPIRES_IN="24h"

# Server Configuration
PORT=8888
NODE_ENV=development

# Session Configuration
SESSION_SECRET="your-super-secret-session-key-change-this-in-production"

# CORS Configuration
CORS_ORIGIN="http://localhost:3000"

# File Upload Configuration
MAX_FILE_SIZE=5242880
ALLOWED_FILE_TYPES="image/jpeg,image/png,image/gif,image/webp"

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# Redis Configuration (for caching and sessions)
REDIS_URL="redis://localhost:6379"
```

### 2. Database Setup

#### Option A: Using Docker (Recommended)

```bash
# Start PostgreSQL and Redis
npm run docker-up

# Initialize database
npm run init-db
```

#### Option B: Manual Setup

1. Install PostgreSQL 15+
2. Create database:
   ```sql
   CREATE DATABASE telecmsdb;
   ```
3. Run Prisma migrations:
   ```bash
   npx prisma migrate dev
   npx prisma generate
   ```

### 3. Install Dependencies

```bash
# Install server dependencies
npm install

# Install frontend dependencies
npm run install-client
```

### 4. Start Development Server

```bash
# Start both server and frontend
npm run dev

# Or start individually
npm run server  # Server only
npm run client  # Frontend only
```

## Server Architecture

### Modern Middleware Stack

The server now includes a comprehensive middleware stack:

#### Security Middleware
- **Helmet**: Security headers
- **CORS**: Cross-origin resource sharing
- **Rate Limiting**: Request throttling
- **Input Sanitization**: XSS protection
- **File Upload Security**: Type and size validation

#### Performance Middleware
- **Compression**: Gzip compression
- **Redis Caching**: Response caching
- **Memory Monitoring**: Resource usage tracking
- **Response Time**: Performance metrics

#### Error Handling
- **Centralized Error Handling**: Consistent error responses
- **Logging**: Winston-based logging
- **Graceful Shutdown**: Clean process termination

### API Routes

All API routes are protected with JWT authentication and include:

- **Authentication**: `/api/auth`
- **Users**: `/api/users`
- **Tasks**: `/api/tasks`
- **Jobs**: `/api/jobs`
- **Cabinets**: `/api/cabinets`
- **Reinstatements**: `/api/reinstatements`
- **Reports**: `/api/reports`
- **Dashboard**: `/api/dashboard`
- **Images**: `/api/images`

### Database Models

The Prisma schema includes:

- **User**: User management with roles
- **Role**: Role-based access control
- **Task**: Task management
- **Job**: Job tracking
- **Cabinet**: Cabinet management
- **Reinstatement**: Reinstatement tracking
- **Image**: File storage

## Security Features

### Authentication & Authorization
- JWT-based authentication
- Role-based access control (RBAC)
- Password hashing with bcrypt
- Session management

### Input Validation
- Express-validator integration
- Comprehensive validation rules
- SQL injection prevention
- XSS protection

### Rate Limiting
- General API rate limiting
- Stricter limits for auth endpoints
- File upload rate limiting

## Performance Optimizations

### Caching
- Redis integration for response caching
- Database query optimization
- Static file compression

### Monitoring
- Request/response logging
- Memory usage monitoring
- Performance metrics

## Development

### Available Scripts

```bash
# Development
npm run dev          # Start both server and client
npm run server       # Start server only
npm run client       # Start frontend only

# Building
npm run build        # Build both server and client
npm run build-server # Build server only

# Database
npm run init-db      # Initialize database
npm run docker-up    # Start Docker services
npm run docker-down  # Stop Docker services
```

### Code Structure

```
├── middleware/          # Custom middleware
│   ├── auth.ts         # Authentication middleware
│   ├── validation.ts   # Input validation
│   ├── errorHandler.ts # Error handling
│   ├── security.ts     # Security middleware
│   └── performance.ts  # Performance middleware
├── routes/api/         # API routes
├── lib/               # Database connection
├── types/             # TypeScript definitions
├── utils/             # Utility functions
└── config/            # Configuration files
```

## Production Deployment

### Environment Variables

Ensure all production environment variables are set:

- `NODE_ENV=production`
- `DATABASE_URL` (production database)
- `JWT_SECRET` (strong secret key)
- `SESSION_SECRET` (strong secret key)
- `CORS_ORIGIN` (production frontend URL)

### Security Checklist

- [ ] Change all default secrets
- [ ] Enable HTTPS
- [ ] Configure proper CORS origins
- [ ] Set up proper logging
- [ ] Configure rate limiting
- [ ] Enable security headers

### Performance Checklist

- [ ] Enable Redis caching
- [ ] Configure compression
- [ ] Set up monitoring
- [ ] Optimize database queries
- [ ] Configure CDN for static files

## Monitoring & Logging

### Health Check

The server includes a health check endpoint:

```
GET /health
```

Returns server status, uptime, memory usage, and version information.

### Logging

Logs are written to:
- `logs/error.log` - Error logs
- `logs/combined.log` - All logs

### Metrics

The server tracks:
- Request/response times
- Memory usage
- Error rates
- Cache hit rates

## Troubleshooting

### Common Issues

1. **Database Connection Issues**
   - Check PostgreSQL is running
   - Verify DATABASE_URL is correct
   - Run `npm run init-db`

2. **Port Already in Use**
   - Change PORT in .env file
   - Kill existing process: `lsof -ti:8888 | xargs kill`

3. **Redis Connection Issues**
   - Redis is optional, server will work without it
   - Check REDIS_URL configuration

4. **Permission Errors**
   - Check file permissions
   - Ensure logs directory is writable

### Debug Mode

Set `NODE_ENV=development` for detailed error messages and logging.

## API Documentation

### Authentication

All API endpoints (except `/api/auth/login`) require a JWT token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

### Response Format

All API responses follow this format:

```json
{
  "status": "success|error",
  "data": { ... },
  "message": "Optional message",
  "pagination": { ... } // For paginated responses
}
```

### Error Format

```json
{
  "status": "error",
  "error": "Error message",
  "details": [ ... ] // For validation errors
}
```

## Contributing

1. Follow TypeScript best practices
2. Add proper error handling
3. Include input validation
4. Write comprehensive tests
5. Update documentation

## Support

For issues and questions:
1. Check the troubleshooting section
2. Review server logs
3. Check database connectivity
4. Verify environment configuration
