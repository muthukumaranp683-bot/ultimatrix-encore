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

// Mock student data
const studentData = {
  name: "John Doe",
  id: "STU001",
  course: "Computer Science",
  semester: "6th Semester",
  attendance: 85,
  gpa: 3.7,
  subjects: [
    { name: "Data Structures", grade: "A", credits: 4 },
    { name: "Web Development", grade: "A+", credits: 3 },
    { name: "Database Systems", grade: "B+", credits: 4 },
    { name: "Software Engineering", grade: "A", credits: 3 }
  ],
  recentActivities: [
    { activity: "Assignment submitted for Web Development", date: "2 hours ago" },
    { activity: "Attended Database Systems lecture", date: "1 day ago" },
    { activity: "Grade updated for Data Structures", date: "3 days ago" }
  ]
};

export default function StudentDashboard() {
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate("/");
  };

  const getGradeColor = (grade: string) => {
    if (grade.includes("A")) return "bg-academic-green text-white";
    if (grade.includes("B")) return "bg-academic-blue text-white";
    return "bg-muted text-muted-foreground";
  };

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
              <CardTitle className="text-sm font-medium text-muted-foreground">Student ID</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{studentData.id}</div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-card shadow-card border-border/50">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Current GPA</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-academic-green">{studentData.gpa}</div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-card shadow-card border-border/50">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Attendance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-academic-blue mb-2">{studentData.attendance}%</div>
              <Progress value={studentData.attendance} className="h-2" />
            </CardContent>
          </Card>

          <Card className="bg-gradient-card shadow-card border-border/50">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Semester</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-lg font-semibold text-foreground">{studentData.semester}</div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Current Subjects */}
          <Card className="bg-gradient-card shadow-card border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center">
                <BookOpen className="h-5 w-5 mr-2 text-primary" />
                Current Subjects
              </CardTitle>
              <CardDescription>Your enrolled subjects and grades</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {studentData.subjects.map((subject, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                    <div>
                      <h4 className="font-medium text-foreground">{subject.name}</h4>
                      <p className="text-sm text-muted-foreground">{subject.credits} Credits</p>
                    </div>
                    <Badge className={getGradeColor(subject.grade)}>
                      {subject.grade}
                    </Badge>
                  </div>
                ))}
              </div>
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
              <div className="space-y-4">
                {studentData.recentActivities.map((activity, index) => (
                  <div key={index} className="flex items-start space-x-3 p-3 bg-muted/50 rounded-lg">
                    <Calendar className="h-4 w-4 mt-1 text-primary flex-shrink-0" />
                    <div>
                      <p className="text-sm text-foreground">{activity.activity}</p>
                      <p className="text-xs text-muted-foreground">{activity.date}</p>
                    </div>
                  </div>
                ))}
              </div>
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