# Implementing user.isActive Field

## Overview
The `user.isActive` field is already defined in the Prisma schema but needs to be implemented in the database. This field allows you to activate/deactivate user accounts.

## Current Status
- ✅ **Prisma Schema**: `isActive Boolean @default(true)` is defined
- ✅ **Code Updated**: All auth services and middleware handle the field gracefully
- ⏳ **Database**: Field needs to be added to the actual database table

## Implementation Options

### Option 1: Using Docker (Recommended)
1. Start Docker Desktop
2. Run the following commands:
```bash
# Start PostgreSQL database
docker-compose up -d

# Navigate to backend directory
cd backend

# Run Prisma migration
npx prisma migrate dev --name add_user_isactive

# Generate Prisma client
npx prisma generate
```

### Option 2: Manual SQL Execution
If you have direct access to the PostgreSQL database, run the SQL script:

```bash
# Connect to your PostgreSQL database and run:
psql -h localhost -U postgres -d tcts_db -f add_isactive_column.sql
```

### Option 3: Using Prisma DB Push (Development)
For development environments, you can push the schema directly:

```bash
cd backend
npx prisma db push
```

## Verification

After implementing, verify the field exists:

```sql
-- Check if the column exists
SELECT column_name, data_type, is_nullable, column_default 
FROM information_schema.columns 
WHERE table_name = 'users' 
AND column_name = 'isActive';

-- Check existing users
SELECT id, username, email, "isActive" FROM users LIMIT 5;
```

## Usage Examples

### In API Responses
```typescript
// All users will have isActive field
const users = await prisma.user.findMany({
  select: {
    id: true,
    username: true,
    email: true,
    isActive: true
  }
});
```

### Activating/Deactivating Users
```typescript
// Deactivate a user
await prisma.user.update({
  where: { id: userId },
  data: { isActive: false }
});

// Activate a user
await prisma.user.update({
  where: { id: userId },
  data: { isActive: true }
});
```

### Filtering Active Users
```typescript
// Get only active users
const activeUsers = await prisma.user.findMany({
  where: { isActive: true }
});

// Get inactive users
const inactiveUsers = await prisma.user.findMany({
  where: { isActive: false }
});
```

## Code Changes Made

1. **Auth Service** (`src/services/authService.ts`):
   - Added graceful handling for missing `isActive` field
   - Defaults to `true` if field doesn't exist yet

2. **Auth Middleware** (`src/middleware/auth.ts`):
   - Added graceful handling for missing `isActive` field
   - Defaults to `true` if field doesn't exist yet

3. **SQL Script** (`add_isactive_column.sql`):
   - Safe SQL script to add the column
   - Checks if column exists before adding
   - Sets default value to `true` for existing users

## Next Steps

1. Choose one of the implementation options above
2. Run the database migration/script
3. Test the functionality by:
   - Creating a new user (should be active by default)
   - Deactivating a user account
   - Trying to login with deactivated account (should fail)
   - Reactivating the account (should work again)

## Troubleshooting

- **Database Connection Issues**: Make sure PostgreSQL is running and accessible
- **Docker Issues**: Ensure Docker Desktop is running
- **Permission Issues**: Make sure you have the necessary database permissions
- **Migration Conflicts**: If you have existing migrations, you may need to resolve conflicts
