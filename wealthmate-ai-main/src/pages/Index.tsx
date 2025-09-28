import { useState, useEffect } from "react";
import DashboardLayout from "@/components/Layout/DashboardLayout";
import TaxOptimizer from "@/components/Modules/TaxOptimizer";
import CreditHealthAdvisor from "@/components/Modules/CreditHealthAdvisor";
import FinanceDashboard from "@/components/Modules/FinanceDashboard";
import UserProfile from "@/components/Profile/UserProfile";
import ScenarioSimulator from "@/components/Simulator/ScenarioSimulator";
import AINudges from "@/components/AI/AINudges";
import DocumentProcessor from "@/components/Documents/DocumentProcessor";
import AdvancedAnalytics from "@/components/Analytics/AdvancedAnalytics";
import { useToast } from "@/hooks/use-toast";

const Index = () => {
  const [activeModule, setActiveModule] = useState<"tax" | "credit" | "finance" | "profile" | "simulator" | "nudges" | "documents" | "analytics">("tax");
  const [isLoading, setIsLoading] = useState(false);
  const [userId] = useState("demo-user"); // In real app, get from auth context
  const { toast } = useToast();

  // Handle module change with loading state
  const handleModuleChange = (module: "tax" | "credit" | "finance" | "profile" | "simulator" | "nudges" | "documents" | "analytics") => {
    setIsLoading(true);
    setActiveModule(module);
    
    // Simulate loading for better UX
    setTimeout(() => {
      setIsLoading(false);
      const moduleNames = {
        tax: "Tax Optimizer",
        credit: "Credit Health Advisor", 
        finance: "Finance Dashboard",
        profile: "User Profile",
        simulator: "Scenario Simulator",
        nudges: "AI Nudges",
        documents: "Document Processor",
        analytics: "Advanced Analytics"
      };
      toast({
        title: "Module Switched",
        description: `Switched to ${moduleNames[module]}`,
      });
    }, 300);
  };

  const renderModule = () => {
    if (isLoading) {
      return (
        <div className="flex items-center justify-center h-96">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      );
    }

    switch (activeModule) {
      case "tax":
        return <TaxOptimizer />;
      case "credit":
        return <CreditHealthAdvisor />;
      case "finance":
        return <FinanceDashboard />;
      case "profile":
        return <UserProfile userId={userId} />;
      case "simulator":
        return <ScenarioSimulator userId={userId} />;
      case "nudges":
        return <AINudges userId={userId} />;
      case "documents":
        return <DocumentProcessor userId={userId} />;
      case "analytics":
        return <AdvancedAnalytics userId={userId} />;
      default:
        return <TaxOptimizer />;
    }
  };

  return (
    <DashboardLayout activeModule={activeModule} onModuleChange={handleModuleChange}>
      {renderModule()}
    </DashboardLayout>
  );
};

export default Index;
