-- Create app_role enum
CREATE TYPE public.app_role AS ENUM ('student', 'staff', 'superadmin');

-- Create user_roles table
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, role)
);

-- Enable RLS
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Create security definer function to check roles
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

-- Create function to get user role
CREATE OR REPLACE FUNCTION public.get_user_role(_user_id UUID)
RETURNS app_role
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT role
  FROM public.user_roles
  WHERE user_id = _user_id
  LIMIT 1
$$;

-- RLS Policies for user_roles table
CREATE POLICY "Users can view their own roles"
ON public.user_roles
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Superadmin can manage all roles"
ON public.user_roles
FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'superadmin'));

-- Migrate existing roles from users table to user_roles table
-- First, we need to get the auth.users id for each user
INSERT INTO public.user_roles (user_id, role)
SELECT 
  u.user_id,
  u.role::app_role
FROM public.users u
WHERE u.user_id IN (SELECT id FROM auth.users)
ON CONFLICT (user_id, role) DO NOTHING;

-- Update RLS policies for existing tables to use the new role system
-- Update students table policies
DROP POLICY IF EXISTS "Staff and admin can view all students" ON public.students;
CREATE POLICY "Staff and admin can view all students"
ON public.students
FOR SELECT
TO authenticated
USING (
  public.has_role(auth.uid(), 'staff') OR 
  public.has_role(auth.uid(), 'superadmin')
);

-- Update staff table policies
DROP POLICY IF EXISTS "Superadmin can view and manage all staff" ON public.staff;
CREATE POLICY "Superadmin can view and manage all staff"
ON public.staff
FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'superadmin'));

-- Update users table policies
DROP POLICY IF EXISTS "Superadmin can view all users" ON public.users;
CREATE POLICY "Superadmin can view all users"
ON public.users
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'superadmin'));

-- Update attendance policies
DROP POLICY IF EXISTS "Staff and admin can manage attendance" ON public.attendance;
CREATE POLICY "Staff and admin can manage attendance"
ON public.attendance
FOR ALL
TO authenticated
USING (
  public.has_role(auth.uid(), 'staff') OR 
  public.has_role(auth.uid(), 'superadmin')
);

-- Update events policies
DROP POLICY IF EXISTS "Staff and admin can manage events" ON public.events;
DROP POLICY IF EXISTS "Staff and admin can update events" ON public.events;

CREATE POLICY "Staff and admin can manage events"
ON public.events
FOR INSERT
TO authenticated
WITH CHECK (
  public.has_role(auth.uid(), 'staff') OR 
  public.has_role(auth.uid(), 'superadmin')
);

CREATE POLICY "Staff and admin can update events"
ON public.events
FOR UPDATE
TO authenticated
USING (
  public.has_role(auth.uid(), 'staff') OR 
  public.has_role(auth.uid(), 'superadmin')
);

-- Update fees policies
DROP POLICY IF EXISTS "Staff and admin can manage fees" ON public.fees;
CREATE POLICY "Staff and admin can manage fees"
ON public.fees
FOR ALL
TO authenticated
USING (
  public.has_role(auth.uid(), 'staff') OR 
  public.has_role(auth.uid(), 'superadmin')
);

-- Update holidays policies
DROP POLICY IF EXISTS "Admin can manage holidays" ON public.holidays;
CREATE POLICY "Admin can manage holidays"
ON public.holidays
FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'superadmin'));

-- Update leave_requests policies
DROP POLICY IF EXISTS "Staff and admin can review leave requests" ON public.leave_requests;
DROP POLICY IF EXISTS "Staff and admin can update leave requests" ON public.leave_requests;

CREATE POLICY "Staff and admin can review leave requests"
ON public.leave_requests
FOR SELECT
TO authenticated
USING (
  public.has_role(auth.uid(), 'staff') OR 
  public.has_role(auth.uid(), 'superadmin')
);

CREATE POLICY "Staff and admin can update leave requests"
ON public.leave_requests
FOR UPDATE
TO authenticated
USING (
  public.has_role(auth.uid(), 'staff') OR 
  public.has_role(auth.uid(), 'superadmin')
);

-- Update marks policies
DROP POLICY IF EXISTS "Staff and admin can manage marks" ON public.marks;
CREATE POLICY "Staff and admin can manage marks"
ON public.marks
FOR ALL
TO authenticated
USING (
  public.has_role(auth.uid(), 'staff') OR 
  public.has_role(auth.uid(), 'superadmin')
);