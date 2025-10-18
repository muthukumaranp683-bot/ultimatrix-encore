-- Note: This migration creates a test superadmin account
-- IMPORTANT: Change the password after first login!

-- Insert superadmin into auth.users (you'll need to do this via Supabase Dashboard)
-- Go to: Authentication > Users > Add User
-- Email: admin@gmail.com
-- Password: admin111 (or your preferred password)
-- Confirm Email: Yes

-- Once the user is created in auth, run this to assign the role:
-- First, get the auth user_id by checking if it exists
DO $$
DECLARE
    auth_user_id UUID;
BEGIN
    -- Check if admin user exists in auth.users
    SELECT id INTO auth_user_id FROM auth.users WHERE email = 'admin@gmail.com';
    
    IF auth_user_id IS NOT NULL THEN
        -- Update the existing users table record with the correct auth user_id
        UPDATE public.users 
        SET user_id = auth_user_id
        WHERE email = 'admin@gmail.com';
        
        -- Insert into user_roles if not exists
        INSERT INTO public.user_roles (user_id, role)
        VALUES (auth_user_id, 'superadmin')
        ON CONFLICT (user_id, role) DO NOTHING;
        
        RAISE NOTICE 'Superadmin role assigned successfully';
    ELSE
        RAISE NOTICE 'Admin user not found in auth.users. Please create it via Supabase Dashboard first.';
    END IF;
END $$;