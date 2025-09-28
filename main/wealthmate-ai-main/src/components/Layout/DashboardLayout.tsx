import { useState, useEffect } from "react";
import { Bell, MessageCircle, User, Menu, X, TrendingUp, CreditCard, Calculator, Settings, LogOut, BarChart3, Target, Lightbulb, FileText, PieChart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface DashboardLayoutProps {
  children: React.ReactNode;
  activeModule: "tax" | "credit" | "finance" | "profile" | "simulator" | "nudges" | "documents" | "analytics";
  onModuleChange: (module: "tax" | "credit" | "finance" | "profile" | "simulator" | "nudges" | "documents" | "analytics") => void;
}

const DashboardLayout = ({ children, activeModule, onModuleChange }: DashboardLayoutProps) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notifications, setNotifications] = useState(3);
  const { toast } = useToast();

  // Handle responsive behavior
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setSidebarOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleNotificationClick = () => {
    setNotifications(0);
    toast({
      title: "Notifications Cleared",
      description: "All notifications have been marked as read.",
    });
  };

  const handleAIAssistantClick = () => {
    toast({
      title: "AI Assistant",
      description: "AI Assistant is now available to help you with your financial queries!",
    });
  };

  const handleUserAction = (action: string) => {
    toast({
      title: action,
      description: `${action} functionality will be available soon.`,
    });
  };

  const modules = [
    {
      id: "tax" as const,
      name: "Tax Optimizer",
      icon: Calculator,
      description: "Optimize your tax savings",
      color: "electric-blue"
    },
    {
      id: "credit" as const,
      name: "Credit Health",
      icon: CreditCard,
      description: "Monitor credit score",
      color: "graph-green"
    },
    {
      id: "finance" as const,
      name: "Finance Dashboard",
      icon: TrendingUp,
      description: "Track your finances",
      color: "graph-purple"
    },
    {
      id: "simulator" as const,
      name: "Scenario Simulator",
      icon: BarChart3,
      description: "Model financial scenarios",
      color: "graph-amber"
    },
    {
      id: "nudges" as const,
      name: "AI Nudges",
      icon: Lightbulb,
      description: "Personalized recommendations",
      color: "graph-orange"
    },
    {
      id: "documents" as const,
      name: "Document Processor",
      icon: FileText,
      description: "OCR & data extraction",
      color: "graph-indigo"
    },
    {
      id: "analytics" as const,
      name: "Advanced Analytics",
      icon: PieChart,
      description: "Deep financial insights",
      color: "graph-pink"
    },
    {
      id: "profile" as const,
      name: "User Profile",
      icon: User,
      description: "Manage your profile",
      color: "graph-red"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-card border-b border-border/50 backdrop-blur-md">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              className="lg:hidden"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
            
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
                <Calculator className="h-5 w-5 text-primary-foreground" />
              </div>
              <h1 className="text-lg sm:text-xl font-bold text-gradient-primary">TaxWise</h1>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Button 
              variant="ghost" 
              size="sm" 
              className="relative"
              onClick={handleNotificationClick}
            >
              <Bell className="h-5 w-5" />
              {notifications > 0 && (
                <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 bg-accent text-xs">
                  {notifications}
                </Badge>
              )}
            </Button>
            
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => handleUserAction("Messages")}
            >
              <MessageCircle className="h-5 w-5" />
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src="/api/placeholder/32/32" />
                    <AvatarFallback className="bg-primary text-primary-foreground">U</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">User Account</p>
                    <p className="text-xs leading-none text-muted-foreground">
                      user@example.com
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => handleUserAction("Profile")}>
                  <User className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleUserAction("Settings")}>
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => handleUserAction("Logout")}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className={`
          fixed lg:sticky top-16 left-0 z-40 h-[calc(100vh-4rem)] w-64 sm:w-72
          bg-card border-r border-border/50 transition-transform duration-300
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
        `}>
          <div className="p-6 space-y-2">
            {modules.map((module) => {
              const Icon = module.icon;
              const isActive = activeModule === module.id;
              
              return (
                <Button
                  key={module.id}
                  variant={isActive ? "default" : "ghost"}
                  className={`
                    w-full justify-start gap-3 h-12 transition-all duration-200
                    ${isActive 
                      ? "bg-primary text-primary-foreground shadow-glow" 
                      : "hover:bg-secondary/80"
                    }
                    btn-mobile
                  `}
                  onClick={() => {
                    onModuleChange(module.id);
                    setSidebarOpen(false);
                  }}
                >
                  <Icon className={`h-5 w-5 ${isActive ? "text-primary-foreground" : "text-muted-foreground"}`} />
                  <div className="text-left">
                    <div className={`text-sm font-medium ${isActive ? "text-primary-foreground" : "text-foreground"}`}>
                      {module.name}
                    </div>
                    <div className={`text-xs ${isActive ? "text-primary-foreground/80" : "text-muted-foreground"}`}>
                      {module.description}
                    </div>
                  </div>
                </Button>
              );
            })}
          </div>

          {/* AI Assistant Prompt */}
          <div className="p-6 mt-8">
            <div className="bg-gradient-card rounded-lg p-4 border border-border/50">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-6 h-6 bg-accent rounded-full flex items-center justify-center">
                  <MessageCircle className="h-3 w-3 text-accent-foreground" />
                </div>
                <span className="text-sm font-medium text-accent">AI Assistant</span>
              </div>
              <p className="text-xs text-muted-foreground mb-3">
                Need help optimizing your taxes or improving your credit score?
              </p>
              <Button 
                size="sm" 
                variant="outline" 
                className="w-full btn-mobile"
                onClick={handleAIAssistantClick}
              >
                Ask AI Assistant
              </Button>
            </div>
          </div>
        </aside>

        {/* Overlay for mobile */}
        {sidebarOpen && (
          <div 
            className="fixed inset-0 bg-background/80 backdrop-blur-sm z-30 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Main Content */}
        <main className="flex-1 lg:ml-0">
          <div className="container mx-auto p-4 sm:p-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;