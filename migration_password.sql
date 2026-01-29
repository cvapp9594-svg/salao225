-- Add admin_password column to settings table
ALTER TABLE settings 
ADD COLUMN IF NOT EXISTS admin_password text DEFAULT 'adminsalao';

-- Update the existing record (if any) to have the default password
UPDATE settings 
SET admin_password = 'adminsalao' 
WHERE id = 'main' AND admin_password IS NULL;
