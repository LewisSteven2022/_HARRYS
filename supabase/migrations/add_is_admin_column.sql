-- Add isAdmin column to User table
ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "isAdmin" BOOLEAN NOT NULL DEFAULT false;

-- Create index for faster admin queries (optional but recommended)
CREATE INDEX IF NOT EXISTS "User_isAdmin_idx" ON "User"("isAdmin");
