import { LucideIcon } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface PortalCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  onClick: () => void;
  variant?: "student" | "staff" | "admin";
}

export const PortalCard = ({ 
  title, 
  description, 
  icon: Icon, 
  onClick, 
  variant = "student" 
}: PortalCardProps) => {
  const getVariantStyles = () => {
    switch (variant) {
      case "student":
        return "from-primary to-primary-glow hover:shadow-glow border-primary/20";
      case "staff":
        return "from-academic-green to-emerald-400 hover:shadow-emerald-400/30 border-emerald-200";
      case "admin":
        return "from-academic-orange to-orange-400 hover:shadow-orange-400/30 border-orange-200";
      default:
        return "from-primary to-primary-glow hover:shadow-glow border-primary/20";
    }
  };

  return (
    <Card className={`group relative overflow-hidden bg-gradient-card shadow-card hover:shadow-card-hover transition-all duration-300 transform hover:-translate-y-1 border ${getVariantStyles()}`}>
      <div className={`absolute inset-0 bg-gradient-to-br ${getVariantStyles()} opacity-5 group-hover:opacity-10 transition-opacity duration-300`} />
      
      <CardHeader className="relative text-center pb-4">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-primary shadow-glow">
          <Icon className="h-8 w-8 text-primary-foreground" />
        </div>
        <CardTitle className="text-xl font-bold text-foreground group-hover:text-primary transition-colors duration-300">
          {title}
        </CardTitle>
        <CardDescription className="text-muted-foreground">
          {description}
        </CardDescription>
      </CardHeader>
      
      <CardContent className="relative pt-0">
        <Button 
          onClick={onClick}
          className="w-full bg-gradient-primary hover:bg-primary-glow shadow-card hover:shadow-card-hover transition-all duration-300"
          size="lg"
        >
          Access Portal
        </Button>
      </CardContent>
    </Card>
  );
};