# TCTS Backend API

A modern, secure REST API for the Telecom Cabinet Tracking System built with Node.js, Express, TypeScript, and PostgreSQL.

## Features

- 🔐 JWT-based authentication with refresh tokens
- 🛡️ Role-based access control (RBAC)
- 📊 Complete CRUD operations for all entities
- 🔒 Input validation and sanitization
- 🚦 Rate limiting and security headers
- 📝 Comprehensive logging
- 🗄️ PostgreSQL database with Prisma ORM
- 🧪 TypeScript for type safety
- 📚 RESTful API design

## Tech Stack

- **Runtime**: Node.js 18+
- **Framework**: Express.js
- **Language**: TypeScript
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Authentication**: JWT
- **Validation**: Express Validator
- **Logging**: Winston
- **Security**: Helmet, CORS, Rate Limiting

## Prerequisites

- Node.js 18 or higher
- PostgreSQL 12 or higher
- npm or yarn

## Installation

1. **Clone the repository and navigate to backend directory**
   ```bash
   cd backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp env.example .env
   ```
   
   Update the `.env` file with your configuration:
   ```env
   DATABASE_URL="postgresql://username:password@localhost:5432/tcts_db?schema=public"
   JWT_SECRET="your-super-secret-jwt-key"
   PORT=8888
   NODE_ENV=development
   ```

4. **Set up the database**
   ```bash
   # Generate Prisma client
   npm run db:generate
   
   # Push schema to database
   npm run db:push
   
   # Seed the database with initial data
   npm run db:seed
   ```

## Development

1. **Start the development server**
   ```bash
   npm run dev
   ```

2. **Build for production**
   ```bash
   npm run build
   ```

3. **Start production server**
   ```bash
   npm start
   ```

## API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `POST /api/auth/refresh` - Refresh access token
- `GET /api/auth/verify` - Verify token
- `GET /api/auth/profile` - Get user profile
- `PUT /api/auth/profile` - Update user profile
- `PUT /api/auth/change-password` - Change password
- `POST /api/auth/logout` - User logout

### Users
- `GET /api/users` - Get all users (with pagination)
- `GET /api/users/:id` - Get user by ID
- `POST /api/users` - Create new user (Admin only)
- `PUT /api/users/:id` - Update user (Admin only)
- `DELETE /api/users/:id` - Delete user (Admin only)
- `PATCH /api/users/:id/activate` - Activate user (Admin only)
- `PATCH /api/users/:id/deactivate` - Deactivate user (Admin only)
- `GET /api/users/stats` - Get user statistics (Admin only)

### Health Check
- `GET /health` - Server health check

## Default Users

After seeding, you can use these default accounts:

| Role | Username | Password | Access Level |
|------|----------|----------|--------------|
| Administrator | admin | Admin123! | Full system access |
| Supervisor | supervisor | Supervisor123! | Supervisory access |
| Technician | technician | Technician123! | Basic access |

## Database Schema

The system includes the following main entities:

- **Users** - System users with role-based access
- **Roles** - User roles with permissions
- **Tasks** - Work tasks with assignments
- **Cabinets** - Telecom cabinets with locations
- **Jobs** - Work jobs linked to tasks and cabinets
- **Reinstatements** - Street reinstatement projects
- **Images** - File attachments for jobs and reinstatements

## Security Features

- JWT authentication with access and refresh tokens
- Password hashing with bcrypt
- Rate limiting on all endpoints
- CORS protection
- Security headers with Helmet
- Input validation and sanitization
- SQL injection protection via Prisma
- XSS protection

## Error Handling

The API uses consistent error responses:

```json
{
  "success": false,
  "message": "Error description",
  "error": "Detailed error information (development only)"
}
```

## Logging

The application uses Winston for logging with different levels:
- Error logs: `logs/error.log`
- Combined logs: `logs/combined.log`
- Console output in development

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `DATABASE_URL` | PostgreSQL connection string | Required |
| `JWT_SECRET` | JWT signing secret | Required |
| `JWT_EXPIRES_IN` | Access token expiration | 24h |
| `JWT_REFRESH_EXPIRES_IN` | Refresh token expiration | 7d |
| `PORT` | Server port | 8888 |
| `NODE_ENV` | Environment | development |
| `CORS_ORIGIN` | CORS allowed origin | http://localhost:3001 |
| `LOG_LEVEL` | Logging level | info |

## Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build TypeScript to JavaScript
- `npm start` - Start production server
- `npm run db:generate` - Generate Prisma client
- `npm run db:push` - Push schema to database
- `npm run db:migrate` - Run database migrations
- `npm run db:seed` - Seed database with initial data
- `npm run db:reset` - Reset database and run migrations
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint errors

## Contributing

1. Follow TypeScript best practices
2. Use meaningful commit messages
3. Add proper error handling
4. Include input validation
5. Write comprehensive tests
6. Update documentation

## License

ISC License
