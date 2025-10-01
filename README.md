# Telecom Cabinet Tracking System (TCTS)

A modern full-stack web application for managing telecom cabinets, tasks, jobs, and reinstatements. Built with React 19, Node.js, TypeScript, and PostgreSQL with a focus on performance, security, and user experience.

## 🚀 Quick Start

### Prerequisites
- Node.js 18 or higher
- PostgreSQL 12 or higher
- npm or yarn

### One-Command Setup
```bash
# Clone and setup everything
git clone <repository-url>
cd telecms
npm run setup
```

This will:
- Install all dependencies (frontend, backend, root)
- Generate Prisma client
- Push database schema
- Seed the database with sample data

### Development
```bash
# Start both frontend and backend
npm run dev
```

This runs:
- **Frontend**: http://localhost:3001 (React + Vite)
- **Backend**: http://localhost:8888 (Node.js + Express)

## 📁 Project Structure

```
telecms/
├── frontend/                 # React 19 + Vite + Tailwind CSS
│   ├── src/
│   │   ├── components/      # Reusable UI components
│   │   ├── pages/          # Page components
│   │   ├── contexts/       # React contexts (Auth)
│   │   ├── services/       # API services (Native Fetch)
│   │   └── types/          # TypeScript types
│   └── package.json
├── backend/                 # Node.js + Express + TypeScript
│   ├── src/
│   │   ├── controllers/    # Request handlers
│   │   ├── services/       # Business logic
│   │   ├── middleware/     # Custom middleware
│   │   ├── routes/         # API routes
│   │   ├── types/          # TypeScript types
│   │   └── utils/          # Utility functions
│   ├── prisma/             # Database schema
│   └── package.json
├── package.json            # Root package.json with scripts
└── README.md
```

## 🛠️ Available Scripts

### Development
```bash
npm run dev                 # Start both frontend and backend
npm run dev:frontend        # Start only frontend
npm run dev:backend         # Start only backend
```

### Building
```bash
npm run build               # Build both frontend and backend
npm run build:frontend      # Build only frontend
npm run build:backend       # Build only backend
```

### Database
```bash
npm run db:generate         # Generate Prisma client
npm run db:push             # Push schema to database
npm run db:seed             # Seed database with sample data
npm run db:reset            # Reset database and run migrations
```

### Installation
```bash
npm run install:all         # Install all dependencies
npm run setup               # Complete setup (install + db setup)
npm run clean:install       # Clean and reinstall everything
```

## 🔐 Default Login Credentials

After running `npm run setup`, you can use these accounts:

| Role | Username | Password | Access Level |
|------|----------|----------|--------------|
| Administrator | admin | Admin123! | Full system access |
| Supervisor | supervisor | Supervisor123! | Supervisory access |
| Technician | technician | Technician123! | Basic access |

## 🌐 Application URLs

- **Frontend**: http://localhost:3001
- **Backend API**: http://localhost:8888
- **API Documentation**: http://localhost:8888/api-docs
- **Health Check**: http://localhost:8888/health

## 🏗️ Architecture

### Frontend (React 19 + Vite)
- **Framework**: React 19 with TypeScript
- **Build Tool**: Vite for fast development and building
- **Styling**: Tailwind CSS with responsive design
- **Routing**: React Router v7
- **State Management**: React Context API
- **HTTP Client**: Native Fetch API with custom service layer
- **Authentication**: JWT token management with automatic refresh

### Backend (Node.js + Express)
- **Runtime**: Node.js 18+
- **Framework**: Express.js with TypeScript
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: JWT with access and refresh tokens
- **Security**: Helmet, CORS, Rate Limiting, Input Validation
- **Logging**: Winston with structured logs
- **API Documentation**: Swagger/OpenAPI integration

### Database (PostgreSQL)
- **ORM**: Prisma with type safety
- **Features**: Migrations, seeding, query optimization
- **Entities**: Users, Roles, Tasks, Cabinets, Jobs, Reinstatements, Images
- **Relationships**: Proper foreign key constraints and cascading

## 🔧 Configuration

### Environment Variables

#### Backend (.env in backend/ directory)
```env
DATABASE_URL="postgresql://username:password@localhost:5432/tcts_db?schema=public"
JWT_SECRET="your-super-secret-jwt-key"
JWT_REFRESH_SECRET="your-refresh-token-secret"
PORT=8888
NODE_ENV=development
CORS_ORIGIN=http://localhost:3001
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

#### Frontend (vite.config.ts)
- Automatically configured for development
- API proxy: `/api` → `http://localhost:8888`
- Hot Module Replacement (HMR) enabled

## 📊 Features

### ✅ Fully Implemented
- **🔐 Authentication System**: JWT-based with refresh tokens and automatic logout
- **👥 User Management**: Complete CRUD with role-based access control
- **📊 Dashboard**: Statistics overview with real-time data
- **🎨 Responsive Design**: Mobile-first approach with Tailwind CSS
- **🔒 Security**: Rate limiting, CORS, input validation, password hashing
- **📝 Error Handling**: Comprehensive error management with user-friendly messages
- **📋 Logging**: Structured logging with Winston for debugging and monitoring
- **🔄 API Integration**: Native Fetch API with proper error handling and token management
- **🎯 Type Safety**: Full TypeScript implementation across frontend and backend

### 🚧 In Progress
- **📋 Task Management**: CRUD operations for task assignment and tracking
- **👤 Role Management**: Role and permission management system
- **📦 Cabinet Management**: Cabinet tracking and status management
- **💼 Job Management**: Job assignment and progress tracking
- **🛣️ Reinstatement Management**: Street reinstatement project management

### 📋 Planned
- **📁 File Upload**: Image and document management with validation
- **📈 Reporting**: Advanced reporting and analytics dashboard
- **🔔 Notifications**: Real-time notifications and alerts
- **📊 Audit Logs**: Comprehensive user activity tracking
- **🌐 API Documentation**: Interactive Swagger documentation

## 🔒 Security Features

- **🔐 JWT Authentication** with access and refresh tokens
- **🔑 Password Hashing** with bcrypt (12 rounds)
- **⏱️ Rate Limiting** on all endpoints (5 attempts per 15 minutes for auth)
- **🌐 CORS Protection** with configurable origins
- **🛡️ Security Headers** with Helmet.js
- **✅ Input Validation** and sanitization with express-validator
- **🚫 SQL Injection Protection** via Prisma ORM
- **🛡️ XSS Protection** with content sanitization
- **🔒 Token Refresh** automatic token renewal
- **🚪 Automatic Logout** on token expiration

## 🧪 Development

### Code Quality
- **📘 TypeScript** for type safety across the entire stack
- **🔍 ESLint** for code linting and best practices
- **💅 Prettier** for consistent code formatting
- **📊 Structured Logging** for debugging and monitoring
- **🎯 Error Boundaries** for graceful error handling

### Hot Reload
- **⚡ Frontend**: Vite HMR for instant updates
- **🔄 Backend**: Nodemon for automatic restarts on changes

### Database Management
- **🗄️ Prisma Migrations** for schema changes
- **🌱 Database Seeding** for sample data
- **🔒 Type-safe Queries** with Prisma Client
- **📊 Database Health** monitoring and connection management

## 🚀 Deployment

### Production Build
```bash
npm run build
```

### Environment Setup
1. Set production environment variables
2. Configure PostgreSQL database
3. Run database migrations
4. Start the application

### Docker Support
- Docker Compose configuration available
- PostgreSQL container included
- Easy deployment setup

## 📝 API Documentation

### Authentication Endpoints
- `POST /api/auth/login` - User login with credentials
- `POST /api/auth/register` - User registration (Admin only)
- `POST /api/auth/refresh` - Refresh access token
- `GET /api/auth/verify` - Verify token validity
- `GET /api/auth/profile` - Get current user profile
- `PUT /api/auth/profile` - Update user profile
- `PUT /api/auth/change-password` - Change user password
- `POST /api/auth/logout` - Logout and invalidate tokens

### User Management Endpoints
- `GET /api/users` - List users with pagination
- `GET /api/users/:id` - Get user by ID
- `POST /api/users` - Create new user (Admin only)
- `PUT /api/users/:id` - Update user (Admin only)
- `DELETE /api/users/:id` - Delete user (Admin only)
- `PATCH /api/users/:id/activate` - Activate user account
- `PATCH /api/users/:id/deactivate` - Deactivate user account

### System Endpoints
- `GET /health` - System health check
- `GET /api-docs` - Interactive API documentation
- `GET /api-docs.json` - OpenAPI specification

## 🎯 Recent Updates

### ✅ Completed (Latest)
- **🔧 Fixed Login Redirect**: Login now properly redirects to dashboard
- **👥 Fixed Users Page**: Users list now loads and displays correctly
- **🔄 API Integration**: Frontend fully connected to backend with native Fetch
- **🎨 UI Improvements**: Enhanced user interface with proper error handling
- **🔒 Security Enhancements**: Improved authentication flow and token management
- **📱 Responsive Design**: Mobile-friendly interface across all pages

### 🚀 Performance Improvements
- **⚡ Native Fetch API**: Replaced axios with native fetch for better performance
- **🎯 Type Safety**: Enhanced TypeScript interfaces for better development experience
- **🔄 Error Handling**: Improved error handling and user feedback
- **📊 Loading States**: Better loading indicators and user experience

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Add tests if applicable
5. Commit your changes (`git commit -m 'Add some amazing feature'`)
6. Push to the branch (`git push origin feature/amazing-feature`)
7. Open a Pull Request

## 📄 License

ISC License - see LICENSE file for details

## 👥 Authors

- **Jesse Patricio** - Initial work and architecture

## 🙏 Acknowledgments

- React team for the amazing framework and latest features
- Vite team for the incredibly fast build tool
- Prisma team for the excellent ORM and type safety
- Tailwind CSS team for the utility-first CSS framework
- Express.js team for the robust backend framework
- PostgreSQL team for the reliable database system

## 📞 Support

For support, email support@telecms.com or create an issue in the repository.

---

**Built with ❤️ using modern web technologies**