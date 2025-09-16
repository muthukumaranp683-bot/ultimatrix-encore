import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { GraduationCap, User, Shield } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";

export default function Login() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [rollNo, setRollNo] = useState("");
  const [department, setDepartment] = useState("");
  const [yearOfStudy, setYearOfStudy] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, signIn, signUp, loading } = useAuth();
  
  const userType = searchParams.get("type") || "student";

  // Redirect if already authenticated
  useEffect(() => {
    if (!loading && user) {
      navigate('/dashboard/student');
    }
  }, [user, loading, navigate]);
  
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

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (isSignUp) {
        if (!fullName || !rollNo) {
          toast({
            title: "Missing Information",
            description: "Please fill in all required fields.",
            variant: "destructive",
          });
          setIsLoading(false);
          return;
        }

        const { error } = await signUp(
          email,
          password,
          fullName,
          rollNo,
          department || undefined,
          yearOfStudy ? parseInt(yearOfStudy) : undefined
        );

        if (error) {
          toast({
            title: "Sign Up Failed",
            description: error.message,
            variant: "destructive",
          });
        } else {
          toast({
            title: "Sign Up Successful",
            description: "Please check your email to verify your account.",
          });
        }
      } else {
        const { error } = await signIn(email, password);
        
        if (error) {
          toast({
            title: "Login Failed",
            description: error.message,
            variant: "destructive",
          });
        } else {
          toast({
            title: "Login Successful",
            description: `Welcome to the ${getPortalInfo().title}!`,
          });
          navigate('/dashboard/student');
        }
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred.",
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

        {/* Auth Form */}
        <Card className="bg-gradient-card shadow-card border-border/50">
          <CardHeader>
            <CardTitle>{isSignUp ? "Create Account" : "Sign In"}</CardTitle>
            <CardDescription>
              {isSignUp ? "Create your student account to access the portal" : "Enter your credentials to access the portal"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleAuth} className="space-y-4">
              {isSignUp && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="fullName">Full Name</Label>
                    <Input
                      id="fullName"
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="Enter your full name"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="rollNo">Roll Number</Label>
                    <Input
                      id="rollNo"
                      type="text"
                      value={rollNo}
                      onChange={(e) => setRollNo(e.target.value)}
                      placeholder="Enter your roll number"
                      required
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="department">Department (Optional)</Label>
                      <Input
                        id="department"
                        type="text"
                        value={department}
                        onChange={(e) => setDepartment(e.target.value)}
                        placeholder="e.g. Computer Science"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="yearOfStudy">Year (Optional)</Label>
                      <Input
                        id="yearOfStudy"
                        type="number"
                        min="1"
                        max="5"
                        value={yearOfStudy}
                        onChange={(e) => setYearOfStudy(e.target.value)}
                        placeholder="1-5"
                      />
                    </div>
                  </div>
                </>
              )}
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
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
                {isLoading ? (isSignUp ? "Creating Account..." : "Signing in...") : (isSignUp ? "Create Account" : "Sign In")}
              </Button>
            </form>
            
            <div className="mt-4 text-center">
              <Button
                type="button"
                variant="ghost"
                onClick={() => setIsSignUp(!isSignUp)}
                className="text-sm text-muted-foreground hover:text-foreground"
              >
                {isSignUp ? "Already have an account? Sign in" : "Don't have an account? Sign up"}
              </Button>
            </div>
          </CardContent>
        </Card>

{userType === 'student' && (
          <Card className="bg-muted/30 border-muted">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Student Portal</CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="text-xs space-y-1 text-muted-foreground">
                <p>Create a new account or sign in with your existing credentials.</p>
                <p>After signup, check your email for verification.</p>
              </div>
            </CardContent>
          </Card>
        )}

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