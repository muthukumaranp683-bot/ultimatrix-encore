-- Fix RLS policies for users table to allow signup
-- This allows authenticated users to insert their own record during signup

-- Drop existing policies first
DROP POLICY IF EXISTS "Superadmin can view all users" ON public.users;
DROP POLICY IF EXISTS "Users can view their own data" ON public.users;

-- Recreate SELECT policies
CREATE POLICY "Users can view their own data"
ON public.users
FOR SELECT
USING ((auth.uid())::text = (user_id)::text);

CREATE POLICY "Superadmin can view all users"
ON public.users
FOR SELECT
USING (has_role(auth.uid(), 'superadmin'::app_role));

-- Add INSERT policy to allow user creation during signup
CREATE POLICY "Users can insert their own record"
ON public.users
FOR INSERT
WITH CHECK ((auth.uid())::text = (user_id)::text);

-- Add UPDATE policy for users to update their own data
CREATE POLICY "Users can update their own data"
ON public.users
FOR UPDATE
USING ((auth.uid())::text = (user_id)::text);

-- Superadmin can manage all users
CREATE POLICY "Superadmin can manage all users"
ON public.users
FOR ALL
USING (has_role(auth.uid(), 'superadmin'::app_role));

-- Also fix students table INSERT policy
DROP POLICY IF EXISTS "Staff and admin can view all students" ON public.students;
DROP POLICY IF EXISTS "Students can view their own data" ON public.students;

-- Recreate SELECT policies for students
CREATE POLICY "Students can view their own data"
ON public.students
FOR SELECT
USING ((auth.uid())::text = (user_id)::text);

CREATE POLICY "Staff and admin can view all students"
ON public.students
FOR SELECT
USING (has_role(auth.uid(), 'staff'::app_role) OR has_role(auth.uid(), 'superadmin'::app_role));

-- Add INSERT policy for students to create their own record during signup
CREATE POLICY "Students can insert their own record"
ON public.students
FOR INSERT
WITH CHECK ((auth.uid())::text = (user_id)::text);

-- Superadmin can manage all students
CREATE POLICY "Superadmin can manage all students"
ON public.students
FOR ALL
USING (has_role(auth.uid(), 'superadmin'::app_role));