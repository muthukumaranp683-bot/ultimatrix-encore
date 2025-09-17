import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { 
  Shield, 
  Users, 
  UserPlus,
  LogOut,
  Building,
  BookOpen,
  Settings
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface StaffMember {
  staff_id: string;
  full_name: string;
  email: string;
  department: string;
  designation: string;
  subject: string;
}

export default function SuperAdminDashboard() {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const { toast } = useToast();
  const [stats, setStats] = useState({
    totalStudents: 0,
    totalStaff: 0,
    totalEvents: 0,
    pendingRequests: 0
  });
  const [staffMembers, setStaffMembers] = useState<StaffMember[]>([]);
  const [isAddStaffOpen, setIsAddStaffOpen] = useState(false);
  const [newStaff, setNewStaff] = useState({
    fullName: '',
    email: '',
    password: '',
    department: '',
    designation: '',
    subject: ''
  });

  useEffect(() => {
    fetchStats();
    fetchStaffMembers();
  }, []);

  const fetchStats = async () => {
    const [studentsRes, staffRes, eventsRes, requestsRes] = await Promise.all([
      supabase.from('students').select('student_id'),
      supabase.from('staff').select('staff_id'),
      supabase.from('events').select('event_id'),
      supabase.from('leave_requests').select('leave_id').eq('status', 'pending')
    ]);

    setStats({
      totalStudents: studentsRes.data?.length || 0,
      totalStaff: staffRes.data?.length || 0,
      totalEvents: eventsRes.data?.length || 0,
      pendingRequests: requestsRes.data?.length || 0
    });
  };

  const fetchStaffMembers = async () => {
    const { data, error } = await supabase
      .from('staff')
      .select(`
        staff_id,
        department,
        designation,
        subject,
        users!inner(full_name, email)
      `);

    if (error) {
      console.error('Error fetching staff:', error);
      return;
    }

    const formattedStaff = data?.map((staff: any) => ({
      staff_id: staff.staff_id,
      full_name: staff.users.full_name,
      email: staff.users.email,
      department: staff.department,
      designation: staff.designation,
      subject: staff.subject
    })) || [];

    setStaffMembers(formattedStaff);
  };

  const handleAddStaff = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // Create user in Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.admin.createUser({
        email: newStaff.email,
        password: newStaff.password,
        email_confirm: true,
        user_metadata: {
          full_name: newStaff.fullName,
          role: 'staff'
        }
      });

      if (authError) {
        toast({
          title: "Error creating staff account",
          description: authError.message,
          variant: "destructive",
        });
        return;
      }

      // Add to users table
      const { error: userError } = await supabase
        .from('users')
        .insert({
          user_id: authData.user.id,
          email: newStaff.email,
          full_name: newStaff.fullName,
          role: 'staff',
          password_hash: 'managed_by_supabase_auth'
        });

      if (userError) {
        toast({
          title: "Error creating user record",
          description: userError.message,
          variant: "destructive",
        });
        return;
      }

      // Add to staff table
      const { error: staffError } = await supabase
        .from('staff')
        .insert({
          user_id: authData.user.id,
          department: newStaff.department,
          designation: newStaff.designation,
          subject: newStaff.subject
        });

      if (staffError) {
        toast({
          title: "Error creating staff record",
          description: staffError.message,
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Staff member added successfully",
        description: `${newStaff.fullName} has been added to the system.`,
      });

      setNewStaff({
        fullName: '',
        email: '',
        password: '',
        department: '',
        designation: '',
        subject: ''
      });
      setIsAddStaffOpen(false);
      fetchStaffMembers();
      fetchStats();

    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred while adding staff member.",
        variant: "destructive",
      });
    }
  };

  const handleLogout = async () => {
    await signOut();
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-gradient-to-r from-academic-orange to-orange-400 shadow-card border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20">
                <Shield className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">Super Admin Portal</h1>
                <p className="text-white/80">Complete system administration</p>
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
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Students</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-academic-blue">{stats.totalStudents}</div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-card shadow-card border-border/50">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Staff</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-academic-green">{stats.totalStaff}</div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-card shadow-card border-border/50">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Events</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-academic-orange">{stats.totalEvents}</div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-card shadow-card border-border/50">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Pending Requests</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">{stats.pendingRequests}</div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Staff Management */}
          <Card className="bg-gradient-card shadow-card border-border/50">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center">
                    <Users className="h-5 w-5 mr-2 text-primary" />
                    Staff Management
                  </CardTitle>
                  <CardDescription>Manage staff members and their access</CardDescription>
                </div>
                <Dialog open={isAddStaffOpen} onOpenChange={setIsAddStaffOpen}>
                  <DialogTrigger asChild>
                    <Button className="bg-gradient-primary">
                      <UserPlus className="h-4 w-4 mr-2" />
                      Add Staff
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                      <DialogTitle>Add New Staff Member</DialogTitle>
                      <DialogDescription>
                        Create a new staff account with access to the system.
                      </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleAddStaff} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="fullName">Full Name</Label>
                        <Input
                          id="fullName"
                          value={newStaff.fullName}
                          onChange={(e) => setNewStaff({...newStaff, fullName: e.target.value})}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          type="email"
                          value={newStaff.email}
                          onChange={(e) => setNewStaff({...newStaff, email: e.target.value})}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="password">Password</Label>
                        <Input
                          id="password"
                          type="password"
                          value={newStaff.password}
                          onChange={(e) => setNewStaff({...newStaff, password: e.target.value})}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="department">Department</Label>
                        <Input
                          id="department"
                          value={newStaff.department}
                          onChange={(e) => setNewStaff({...newStaff, department: e.target.value})}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="designation">Designation</Label>
                        <Input
                          id="designation"
                          value={newStaff.designation}
                          onChange={(e) => setNewStaff({...newStaff, designation: e.target.value})}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="subject">Subject</Label>
                        <Input
                          id="subject"
                          value={newStaff.subject}
                          onChange={(e) => setNewStaff({...newStaff, subject: e.target.value})}
                          required
                        />
                      </div>
                      <Button type="submit" className="w-full bg-gradient-primary">
                        Add Staff Member
                      </Button>
                    </form>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 max-h-64 overflow-y-auto">
                {staffMembers.map((staff) => (
                  <div key={staff.staff_id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                    <div>
                      <h4 className="font-medium text-foreground">{staff.full_name}</h4>
                      <p className="text-sm text-muted-foreground">{staff.department} • {staff.subject}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card className="bg-gradient-card shadow-card border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Settings className="h-5 w-5 mr-2 text-primary" />
                System Management
              </CardTitle>
              <CardDescription>Administrative controls and settings</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-4">
                <Button 
                  className="bg-gradient-to-r from-academic-orange to-orange-400 hover:from-academic-orange/90 hover:to-orange-400/90 h-12 justify-start"
                  onClick={() => navigate("/admin/students")}
                >
                  <Users className="h-4 w-4 mr-2" />
                  Manage All Students
                </Button>
                <Button 
                  variant="outline" 
                  className="h-12 justify-start border-primary/20 hover:bg-primary/10"
                  onClick={() => navigate("/admin/events")}
                >
                  <BookOpen className="h-4 w-4 mr-2" />
                  Manage Events
                </Button>
                <Button 
                  variant="outline" 
                  className="h-12 justify-start border-primary/20 hover:bg-primary/10"
                  onClick={() => navigate("/admin/analytics")}
                >
                  <Building className="h-4 w-4 mr-2" />
                  System Analytics
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}