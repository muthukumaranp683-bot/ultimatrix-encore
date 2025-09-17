-- Add subject field to staff table
ALTER TABLE staff ADD COLUMN subject VARCHAR(100);

-- Insert superadmin user
INSERT INTO users (email, password_hash, full_name, role) 
VALUES ('admin@gmail.com', 'managed_by_supabase_auth', 'Super Admin', 'superadmin');