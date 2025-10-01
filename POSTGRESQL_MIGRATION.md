# PostgreSQL Migration Guide

This document outlines the migration from MongoDB to PostgreSQL for the Telecom Cabinet Tracking System (TCTS).

## Overview

The application has been migrated from MongoDB with Mongoose to PostgreSQL with Sequelize ORM. This provides better data consistency, ACID transactions, and improved performance for relational data.

## Changes Made

### 1. Database Configuration
- **New file**: `config/postgres-database.js` - PostgreSQL connection configuration
- **Removed**: MongoDB connection logic from `app.js`

### 2. Models Migration
- **New directory**: `models/sequelize/` - Contains all Sequelize models
- **Models converted**:
  - `User.js` - User management with role relationships
  - `Role.js` - Role-based access control
  - `Task.js` - Task management
  - `Cabinet.js` - Cabinet information
  - `Job.js` - Job tracking with relationships
  - `Reinstatement.js` - Reinstatement tracking
  - `index.js` - Model associations and database sync

### 3. API Routes Updated
All API routes have been updated to use Sequelize instead of Mongoose:
- `routes/api/auth.js` - Authentication with JWT
- `routes/api/users.js` - User management
- `routes/api/tasks.js` - Task management
- `routes/api/roles.js` - Role management
- `routes/api/cabinets.js` - Cabinet management
- `routes/api/jobs.js` - Job management
- `routes/api/reinstatements.js` - Reinstatement management
- `routes/api/dashboard.js` - Dashboard statistics
- `routes/api/reports.js` - Reporting functionality

### 4. Key Changes in Data Access

#### MongoDB (Before)
```javascript
// Find documents
const users = await User.find().populate('role');

// Create document
const user = new User(data);
await user.save();

// Update document
const user = await User.findByIdAndUpdate(id, data, { new: true });

// Delete document
const user = await User.findByIdAndDelete(id);
```

#### PostgreSQL/Sequelize (After)
```javascript
// Find records
const users = await User.findAll({
  include: [{ model: Role, as: 'role' }]
});

// Create record
const user = await User.create(data);

// Update record
const [updatedRowsCount] = await User.update(data, { where: { id } });

// Delete record
const deletedRowsCount = await User.destroy({ where: { id } });
```

## Setup Instructions

### 1. Start PostgreSQL Database
```bash
# Using Docker Compose (recommended)
npm run docker-up

# Or manually start PostgreSQL on port 5432
```

### 2. Initialize Database
```bash
# Create tables and seed initial data
npm run init-db
```

### 3. Start Application
```bash
# Development mode
npm run dev

# Production mode
npm start
```

## Database Schema

### Users Table
- `id` (Primary Key)
- `roleId` (Foreign Key to Roles)
- `username` (Unique)
- `firstname`
- `lastname`
- `email`
- `password` (Hashed)
- `createdAt`
- `updatedAt`

### Roles Table
- `id` (Primary Key)
- `name`
- `description`
- `permissions` (JSON)
- `createdAt`
- `updatedAt`

### Tasks Table
- `id` (Primary Key)
- `title`
- `description`
- `status`
- `assignedToId` (Foreign Key to Users)
- `dueDate`
- `createdAt`
- `updatedAt`

### Cabinets Table
- `id` (Primary Key)
- `name`
- `location`
- `status`
- `description`
- `dropCount`
- `createdAt`
- `updatedAt`

### Jobs Table
- `id` (Primary Key)
- `title`
- `description`
- `status`
- `assignedToId` (Foreign Key to Users)
- `addedById` (Foreign Key to Users)
- `modifiedById` (Foreign Key to Users)
- `cabinetId` (Foreign Key to Cabinets)
- `taskId` (Foreign Key to Tasks)
- `lno`
- `withDig`
- `withBackfill`
- `remarks`
- `streetNo`
- `streetName`
- `file`
- `imageUrl`
- `jobDate`
- `dueDate`
- `createdAt`
- `updatedAt`

### Reinstatements Table
- `id` (Primary Key)
- `title`
- `description`
- `status`
- `assignedToId` (Foreign Key to Users)
- `cabinetId` (Foreign Key to Cabinets)
- `streetNo`
- `streetName`
- `length`
- `width`
- `file`
- `completedAt`
- `createdAt`
- `updatedAt`

## Environment Variables

Add these to your `.env` file:

```env
# PostgreSQL Configuration
POSTGRES_HOST=localhost
POSTGRES_PORT=5432
POSTGRES_DB=telecmsdb
POSTGRES_USER=postgres
POSTGRES_PASSWORD=password

# JWT Secret
JWT_SECRET=your-secret-key

# Node Environment
NODE_ENV=development
```

## Default Credentials

After running `npm run init-db`, you can login with:
- **Username**: admin
- **Password**: admin123

## Benefits of PostgreSQL Migration

1. **ACID Compliance**: Better data integrity and consistency
2. **Relational Data**: Proper foreign key relationships
3. **Better Performance**: Optimized queries and indexing
4. **Advanced Features**: JSON support, full-text search, etc.
5. **Scalability**: Better handling of concurrent users
6. **Data Validation**: Stronger type checking and constraints

## Troubleshooting

### Connection Issues
- Ensure PostgreSQL is running on port 5432
- Check database credentials in environment variables
- Verify Docker container is running if using Docker

### Migration Issues
- Run `npm run init-db` to recreate tables
- Check console logs for specific error messages
- Ensure all dependencies are installed

### Performance Issues
- Add database indexes for frequently queried fields
- Use connection pooling (already configured)
- Monitor query performance with Sequelize logging

## Next Steps

1. **Data Migration**: If you have existing MongoDB data, create a migration script
2. **Indexing**: Add database indexes for better performance
3. **Backup Strategy**: Implement regular database backups
4. **Monitoring**: Set up database monitoring and logging
5. **Testing**: Add comprehensive database tests
