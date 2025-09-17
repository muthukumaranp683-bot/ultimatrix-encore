import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  User, 
  Calendar, 
  BookOpen, 
  TrendingUp, 
  MessageCircle,
  LogOut,
  Users,
  ClipboardList
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";

export default function StaffDashboard() {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const [staffData, setStaffData] = useState<any>(null);
  const [stats, setStats] = useState({
    totalStudents: 0,
    pendingLeaveRequests: 0,
    eventsThisMonth: 0
  });

  useEffect(() => {
    if (user) {
      fetchStaffData();
      fetchStats();
    }
  }, [user]);

  const fetchStaffData = async () => {
    if (!user) return;
    
    const { data: userData } = await supabase
      .from('users')
      .select('*')
      .eq('user_id', user.id)
      .single();

    const { data: staffInfo } = await supabase
      .from('staff')
      .select('*')
      .eq('user_id', user.id)
      .single();

    setStaffData({ ...userData, ...staffInfo });
  };

  const fetchStats = async () => {
    const { data: students } = await supabase
      .from('students')
      .select('student_id');

    const { data: leaveRequests } = await supabase
      .from('leave_requests')
      .select('leave_id')
      .eq('status', 'pending');

    const { data: events } = await supabase
      .from('events')
      .select('event_id')
      .gte('event_date', new Date().toISOString().split('T')[0]);

    setStats({
      totalStudents: students?.length || 0,
      pendingLeaveRequests: leaveRequests?.length || 0,
      eventsThisMonth: events?.length || 0
    });
  };

  const handleLogout = async () => {
    await signOut();
    navigate("/");
  };

  if (!staffData) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-gradient-to-r from-academic-green to-emerald-400 shadow-card border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20">
                <User className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">Staff Portal</h1>
                <p className="text-white/80">Welcome back, {staffData.full_name}</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                className="text-white hover:bg-white/20"
                onClick={handleLogout}
              >
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gradient-card shadow-card border-border/50">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Department</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-lg font-bold text-foreground">{staffData.department || 'Not Set'}</div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-card shadow-card border-border/50">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Students</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-academic-green">{stats.totalStudents}</div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-card shadow-card border-border/50">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Pending Requests</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-academic-orange">{stats.pendingLeaveRequests}</div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-card shadow-card border-border/50">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Upcoming Events</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-academic-blue">{stats.eventsThisMonth}</div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card className="bg-gradient-card shadow-card border-border/50">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Manage students and academic records</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Button 
                className="bg-gradient-to-r from-academic-green to-emerald-400 hover:from-academic-green/90 hover:to-emerald-400/90 h-12"
                onClick={() => navigate("/staff/students")}
              >
                <Users className="h-4 w-4 mr-2" />
                Manage Students
              </Button>
              <Button 
                variant="outline" 
                className="h-12 border-primary/20 hover:bg-primary/10"
                onClick={() => navigate("/staff/attendance")}
              >
                <Calendar className="h-4 w-4 mr-2" />
                Mark Attendance
              </Button>
              <Button 
                variant="outline" 
                className="h-12 border-primary/20 hover:bg-primary/10"
                onClick={() => navigate("/staff/marks")}
              >
                <TrendingUp className="h-4 w-4 mr-2" />
                Add Marks
              </Button>
              <Button 
                variant="outline" 
                className="h-12 border-primary/20 hover:bg-primary/10"
                onClick={() => navigate("/staff/leave-requests")}
              >
                <ClipboardList className="h-4 w-4 mr-2" />
                Review Requests
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}