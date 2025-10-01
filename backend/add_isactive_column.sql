-- Add isActive column to users table
-- This script adds the isActive boolean column with a default value of true

-- Check if the column already exists before adding it
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'users' 
        AND column_name = 'isActive'
    ) THEN
        -- Add the isActive column
        ALTER TABLE users 
        ADD COLUMN "isActive" BOOLEAN NOT NULL DEFAULT true;
        
        -- Update any existing users to be active by default
        UPDATE users SET "isActive" = true WHERE "isActive" IS NULL;
        
        RAISE NOTICE 'isActive column added successfully to users table';
    ELSE
        RAISE NOTICE 'isActive column already exists in users table';
    END IF;
END $$;

-- Verify the column was added
SELECT column_name, data_type, is_nullable, column_default 
FROM information_schema.columns 
WHERE table_name = 'users' 
AND column_name = 'isActive';
