-- Enable Row Level Security on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE students ENABLE ROW LEVEL SECURITY;
ALTER TABLE staff ENABLE ROW LEVEL SECURITY;
ALTER TABLE attendance ENABLE ROW LEVEL SECURITY;
ALTER TABLE marks ENABLE ROW LEVEL SECURITY;
ALTER TABLE fees ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE holidays ENABLE ROW LEVEL SECURITY;
ALTER TABLE leave_requests ENABLE ROW LEVEL SECURITY;

-- Create policies for users table
CREATE POLICY "Users can view their own data" ON users
    FOR SELECT USING (auth.uid()::text = user_id::text);

CREATE POLICY "Superadmin can view all users" ON users
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM users WHERE user_id::text = auth.uid()::text AND role = 'superadmin'
        )
    );

-- Create policies for students table
CREATE POLICY "Students can view their own data" ON students
    FOR SELECT USING (auth.uid()::text = user_id::text);

CREATE POLICY "Staff and admin can view all students" ON students
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM users WHERE user_id::text = auth.uid()::text AND role IN ('staff', 'superadmin')
        )
    );

-- Create policies for staff table
CREATE POLICY "Staff can view their own data" ON staff
    FOR SELECT USING (auth.uid()::text = user_id::text);

CREATE POLICY "Superadmin can view and manage all staff" ON staff
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM users WHERE user_id::text = auth.uid()::text AND role = 'superadmin'
        )
    );

-- Create policies for attendance table
CREATE POLICY "Students can view their own attendance" ON attendance
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM students WHERE student_id = attendance.student_id AND auth.uid()::text = user_id::text
        )
    );

CREATE POLICY "Staff and admin can manage attendance" ON attendance
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM users WHERE user_id::text = auth.uid()::text AND role IN ('staff', 'superadmin')
        )
    );

-- Create policies for marks table
CREATE POLICY "Students can view their own marks" ON marks
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM students WHERE student_id = marks.student_id AND auth.uid()::text = user_id::text
        )
    );

CREATE POLICY "Staff and admin can manage marks" ON marks
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM users WHERE user_id::text = auth.uid()::text AND role IN ('staff', 'superadmin')
        )
    );

-- Create policies for fees table
CREATE POLICY "Students can view their own fees" ON fees
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM students WHERE student_id = fees.student_id AND auth.uid()::text = user_id::text
        )
    );

CREATE POLICY "Staff and admin can manage fees" ON fees
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM users WHERE user_id::text = auth.uid()::text AND role IN ('staff', 'superadmin')
        )
    );

-- Create policies for events table
CREATE POLICY "Everyone can view events" ON events
    FOR SELECT USING (true);

CREATE POLICY "Staff and admin can manage events" ON events
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM users WHERE user_id::text = auth.uid()::text AND role IN ('staff', 'superadmin')
        )
    );

CREATE POLICY "Staff and admin can update events" ON events
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM users WHERE user_id::text = auth.uid()::text AND role IN ('staff', 'superadmin')
        )
    );

-- Create policies for holidays table
CREATE POLICY "Everyone can view holidays" ON holidays
    FOR SELECT USING (true);

CREATE POLICY "Admin can manage holidays" ON holidays
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM users WHERE user_id::text = auth.uid()::text AND role = 'superadmin'
        )
    );

-- Create policies for leave_requests table
CREATE POLICY "Students can manage their own leave requests" ON leave_requests
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM students WHERE student_id = leave_requests.student_id AND auth.uid()::text = user_id::text
        )
    );

CREATE POLICY "Staff and admin can review leave requests" ON leave_requests
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM users WHERE user_id::text = auth.uid()::text AND role IN ('staff', 'superadmin')
        )
    );

CREATE POLICY "Staff and admin can update leave requests" ON leave_requests
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM users WHERE user_id::text = auth.uid()::text AND role IN ('staff', 'superadmin')
        )
    );