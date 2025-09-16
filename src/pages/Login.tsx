import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { GraduationCap, User, Shield } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// Demo credentials
const DEMO_CREDENTIALS = {
  student: { username: "john_doe", password: "password" },
  staff: { username: "staff_admin", password: "staff123" },
  admin: { username: "superadmin", password: "admin123" }
};

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const userType = searchParams.get("type") || "student";
  
  const getPortalInfo = () => {
    switch (userType) {
      case "staff":
        return {
          title: "Staff Portal",
          description: "Access staff dashboard and manage student records",
          icon: User,
          gradient: "from-academic-green to-emerald-400"
        };
      case "admin":
        return {
          title: "Super Admin Portal",
          description: "Complete system access with administrative controls",
          icon: Shield,
          gradient: "from-academic-orange to-orange-400"
        };
      default:
        return {
          title: "Student Portal",
          description: "Access your academic information and AI assistant",
          icon: GraduationCap,
          gradient: "from-primary to-primary-glow"
        };
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));

    const credentials = DEMO_CREDENTIALS[userType as keyof typeof DEMO_CREDENTIALS];
    
    if (username === credentials.username && password === credentials.password) {
      toast({
        title: "Login Successful",
        description: `Welcome to the ${getPortalInfo().title}!`,
      });
      
      // Navigate to appropriate dashboard
      navigate(`/dashboard/${userType}`);
    } else {
      toast({
        title: "Login Failed",
        description: "Invalid username or password. Check demo credentials below.",
        variant: "destructive",
      });
    }
    
    setIsLoading(false);
  };

  const portalInfo = getPortalInfo();
  const Icon = portalInfo.icon;

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Portal Header */}
        <div className="text-center space-y-4">
          <div className={`mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br ${portalInfo.gradient} shadow-glow`}>
            <Icon className="h-8 w-8 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">{portalInfo.title}</h1>
            <p className="text-muted-foreground">{portalInfo.description}</p>
          </div>
        </div>

        {/* Login Form */}
        <Card className="bg-gradient-card shadow-card border-border/50">
          <CardHeader>
            <CardTitle>Sign In</CardTitle>
            <CardDescription>Enter your credentials to access the portal</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter your username"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                />
              </div>
              <Button 
                type="submit" 
                className="w-full bg-gradient-primary hover:bg-primary-glow shadow-card hover:shadow-card-hover"
                disabled={isLoading}
              >
                {isLoading ? "Signing in..." : "Sign In"}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Demo Credentials */}
        <Card className="bg-muted/30 border-muted">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Demo Credentials</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="text-xs space-y-1 text-muted-foreground">
              <div><strong>Current Portal:</strong> {DEMO_CREDENTIALS[userType as keyof typeof DEMO_CREDENTIALS].username} / {DEMO_CREDENTIALS[userType as keyof typeof DEMO_CREDENTIALS].password}</div>
            </div>
          </CardContent>
        </Card>

        {/* Back to Home */}
        <div className="text-center">
          <Button 
            variant="ghost" 
            onClick={() => navigate("/")}
            className="text-muted-foreground hover:text-foreground"
          >
            ← Back to Home
          </Button>
        </div>
      </div>
    </div>
  );
}