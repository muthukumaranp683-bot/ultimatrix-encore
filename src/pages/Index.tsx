import { useNavigate } from "react-router-dom";
import { PortalCard } from "@/components/PortalCard";
import { FeatureCard } from "@/components/FeatureCard";
import { Button } from "@/components/ui/button";
import { 
  GraduationCap, 
  User, 
  Shield, 
  MessageCircle, 
  TrendingUp, 
  BookOpen,
  Github,
  ExternalLink
} from "lucide-react";

const Index = () => {
  const navigate = useNavigate();

  const handlePortalAccess = (portalType: string) => {
    navigate(`/login?type=${portalType}`);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-primary shadow-glow">
              <GraduationCap className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">Student Portal System</h1>
              <p className="text-sm text-muted-foreground">Comprehensive academic management platform</p>
            </div>
          </div>
          <Button 
            variant="outline" 
            onClick={() => window.open("https://github.com/muthukumaranp683-bot/collabo-aid", "_blank")}
            className="border-primary/20 hover:bg-primary/10"
          >
            <Github className="h-4 w-4 mr-2" />
            View Source
          </Button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 text-center">
        <div className="mx-auto max-w-3xl space-y-6">
          <h1 className="text-4xl font-bold text-foreground sm:text-5xl">
            Welcome to Your Academic Hub
          </h1>
          <p className="text-lg text-muted-foreground">
            Access your student information, chat with our AI assistant, and manage your 
            academic journey with our comprehensive portal system.
          </p>
        </div>
      </section>

      {/* Portal Cards */}
      <section className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          <PortalCard
            title="Student Portal"
            description="Access your academic information, check attendance, view marks, and chat with our AI assistant"
            icon={GraduationCap}
            onClick={() => handlePortalAccess("student")}
            variant="student"
          />
          <PortalCard
            title="Staff Portal"
            description="Manage student records, update attendance, and handle academic data"
            icon={User}
            onClick={() => handlePortalAccess("staff")}
            variant="staff"
          />
          <PortalCard
            title="Super Admin"
            description="Complete system access with full administrative controls and analytics"
            icon={Shield}
            onClick={() => handlePortalAccess("admin")}
            variant="admin"
          />
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-foreground mb-4">Platform Features</h2>
          <p className="text-lg text-muted-foreground">
            Everything you need for modern academic management
          </p>
        </div>
        
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          <FeatureCard
            title="AI Chat Assistant"
            description="Get instant answers about attendance, marks, fees, and leave requests"
            icon={MessageCircle}
          />
          <FeatureCard
            title="Real-time Analytics"
            description="Track academic performance and attendance with detailed insights"
            icon={TrendingUp}
          />
          <FeatureCard
            title="Academic Management"
            description="Complete student lifecycle management from admission to graduation"
            icon={BookOpen}
          />
        </div>
      </section>

      {/* Demo Credentials */}
      <section className="container mx-auto px-4 py-16">
        <div className="mx-auto max-w-4xl">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-foreground mb-4">Demo Credentials</h2>
            <p className="text-muted-foreground">Use these credentials to explore different portal features</p>
          </div>
          
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            <div className="bg-gradient-card shadow-card rounded-lg p-6 border border-border/50">
              <h3 className="font-semibold text-foreground mb-2 flex items-center">
                <GraduationCap className="h-4 w-4 mr-2 text-primary" />
                Student
              </h3>
              <div className="text-sm space-y-1 text-muted-foreground">
                <div><strong>Username:</strong> john_doe</div>
                <div><strong>Password:</strong> password</div>
              </div>
            </div>
            
            <div className="bg-gradient-card shadow-card rounded-lg p-6 border border-border/50">
              <h3 className="font-semibold text-foreground mb-2 flex items-center">
                <User className="h-4 w-4 mr-2 text-academic-green" />
                Staff
              </h3>
              <div className="text-sm space-y-1 text-muted-foreground">
                <div><strong>Username:</strong> staff_admin</div>
                <div><strong>Password:</strong> staff123</div>
              </div>
            </div>
            
            <div className="bg-gradient-card shadow-card rounded-lg p-6 border border-border/50">
              <h3 className="font-semibold text-foreground mb-2 flex items-center">
                <Shield className="h-4 w-4 mr-2 text-academic-orange" />
                Super Admin
              </h3>
              <div className="text-sm space-y-1 text-muted-foreground">
                <div><strong>Username:</strong> superadmin</div>
                <div><strong>Password:</strong> admin123</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="container mx-auto px-4 py-8 border-t border-border/50">
        <div className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            © 2024 Collabo-Aid. Built with React, TypeScript & Tailwind CSS.
          </div>
          <div className="flex items-center space-x-4">
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => window.open("https://collabo-aid.vercel.app", "_blank")}
              className="text-muted-foreground hover:text-foreground"
            >
              <ExternalLink className="h-4 w-4 mr-1" />
              Live Demo
            </Button>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
