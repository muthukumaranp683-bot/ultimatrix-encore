import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  GraduationCap, 
  Calendar, 
  BookOpen, 
  TrendingUp, 
  MessageCircle,
  User,
  LogOut
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";

export default function StudentDashboard() {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const [studentData, setStudentData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchStudentData();
    }
  }, [user]);

  const fetchStudentData = async () => {
    if (!user) return;

    try {
      // Fetch student info
      const { data: studentInfo, error: studentError } = await supabase
        .from('students')
        .select(`
          *,
          users!inner(full_name, email)
        `)
        .eq('user_id', user.id)
        .maybeSingle();

      if (studentError) throw studentError;

      // Fetch marks
      const { data: marks, error: marksError } = await supabase
        .from('marks')
        .select('*')
        .eq('student_id', studentInfo?.student_id);

      // Fetch recent attendance
      const { data: attendance, error: attendanceError } = await supabase
        .from('attendance')
        .select('*')
        .eq('student_id', studentInfo?.student_id)
        .order('date', { ascending: false })
        .limit(5);

      setStudentData({
        name: studentInfo?.users?.full_name || 'Student',
        id: studentInfo?.roll_no || 'N/A',
        department: studentInfo?.department || 'Not Assigned',
        year: studentInfo?.year_of_study || 'N/A',
        attendance: studentInfo?.attendance_percentage || 0,
        marks: marks || [],
        recentActivities: attendance?.map(a => ({
          activity: `Attendance marked: ${a.status}`,
          date: new Date(a.date).toLocaleDateString()
        })) || []
      });
    } catch (error) {
      console.error('Error fetching student data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await signOut();
    navigate("/");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!studentData) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground">No student data found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-gradient-primary shadow-card border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20">
                <GraduationCap className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">Student Portal</h1>
                <p className="text-primary-foreground/80">Welcome back, {studentData.name}</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                className="text-white hover:bg-white/20"
                onClick={() => navigate("/chat")}
              >
                <MessageCircle className="h-4 w-4 mr-2" />
                AI Chat
              </Button>
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
        {/* Student Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gradient-card shadow-card border-border/50">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Roll Number</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{studentData.id}</div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-card shadow-card border-border/50">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Department</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-lg font-semibold text-academic-green">{studentData.department}</div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-card shadow-card border-border/50">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Attendance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-academic-blue mb-2">{studentData.attendance.toFixed(1)}%</div>
              <Progress value={studentData.attendance} className="h-2" />
            </CardContent>
          </Card>

          <Card className="bg-gradient-card shadow-card border-border/50">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Year of Study</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{studentData.year}</div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Marks */}
          <Card className="bg-gradient-card shadow-card border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center">
                <BookOpen className="h-5 w-5 mr-2 text-primary" />
                Recent Marks
              </CardTitle>
              <CardDescription>Your exam and assessment results</CardDescription>
            </CardHeader>
            <CardContent>
              {studentData.marks.length > 0 ? (
                <div className="space-y-4">
                  {studentData.marks.slice(0, 5).map((mark: any, index: number) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                      <div>
                        <h4 className="font-medium text-foreground">{mark.subject}</h4>
                        <p className="text-sm text-muted-foreground">{mark.exam_type}</p>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold text-foreground">{mark.marks_obtained}/{mark.max_marks}</div>
                        <p className="text-xs text-muted-foreground">{((mark.marks_obtained / mark.max_marks) * 100).toFixed(1)}%</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground text-center py-4">No marks available yet</p>
              )}
            </CardContent>
          </Card>

          {/* Recent Activities */}
          <Card className="bg-gradient-card shadow-card border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center">
                <TrendingUp className="h-5 w-5 mr-2 text-primary" />
                Recent Activities
              </CardTitle>
              <CardDescription>Your latest academic activities</CardDescription>
            </CardHeader>
            <CardContent>
              {studentData.recentActivities.length > 0 ? (
                <div className="space-y-4">
                  {studentData.recentActivities.map((activity: any, index: number) => (
                    <div key={index} className="flex items-start space-x-3 p-3 bg-muted/50 rounded-lg">
                      <Calendar className="h-4 w-4 mt-1 text-primary flex-shrink-0" />
                      <div>
                        <p className="text-sm text-foreground">{activity.activity}</p>
                        <p className="text-xs text-muted-foreground">{activity.date}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground text-center py-4">No recent activities</p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card className="mt-8 bg-gradient-card shadow-card border-border/50">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Frequently used features</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button 
                className="bg-gradient-primary hover:bg-primary-glow h-12"
                onClick={() => navigate("/chat")}
              >
                <MessageCircle className="h-4 w-4 mr-2" />
                Chat with AI Assistant
              </Button>
              <Button 
                variant="outline" 
                className="h-12 border-primary/20 hover:bg-primary/10"
                onClick={() => navigate("/attendance")}
              >
                <Calendar className="h-4 w-4 mr-2" />
                View Attendance
              </Button>
              <Button 
                variant="outline" 
                className="h-12 border-primary/20 hover:bg-primary/10"
                onClick={() => navigate("/grades")}
              >
                <TrendingUp className="h-4 w-4 mr-2" />
                View Grades
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}