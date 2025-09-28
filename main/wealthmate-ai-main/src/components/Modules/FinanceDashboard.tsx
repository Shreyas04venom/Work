import { useState } from "react";
import { DollarSign, TrendingUp, PieChart, Calendar, FileText, Smartphone, Target, BarChart3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const FinanceDashboard = () => {
  const [selectedPeriod, setSelectedPeriod] = useState("month");
  const [isGeneratingReport, setIsGeneratingReport] = useState(false);
  const [isViewingAnalytics, setIsViewingAnalytics] = useState(false);
  const { toast } = useToast();

  const monthlyData = {
    income: 125000,
    expenses: 89000,
    savings: 36000,
    investments: 25000
  };

  const expenseCategories = [
    { name: "Housing", amount: 35000, percentage: 39, color: "electric-blue" },
    { name: "Food & Dining", amount: 18000, percentage: 20, color: "graph-green" },
    { name: "Transportation", amount: 12000, percentage: 13, color: "graph-amber" },
    { name: "Entertainment", amount: 8000, percentage: 9, color: "graph-purple" },
    { name: "Utilities", amount: 6000, percentage: 7, color: "graph-red" },
    { name: "Others", amount: 10000, percentage: 12, color: "secondary" }
  ];

  const investmentGoals = [
    { name: "Emergency Fund", target: 500000, current: 340000, progress: 68 },
    { name: "Home Down Payment", target: 2000000, current: 850000, progress: 43 },
    { name: "Retirement Fund", target: 10000000, current: 1200000, progress: 12 },
    { name: "Child Education", target: 1500000, current: 320000, progress: 21 }
  ];

  const upcomingEvents = [
    { type: "Tax Filing", date: "31 Mar 2024", status: "pending", priority: "high" },
    { type: "GST Return", date: "20 Jan 2024", status: "overdue", priority: "critical" },
    { type: "Income Tax Payment", date: "15 Feb 2024", status: "scheduled", priority: "medium" },
    { type: "Investment Review", date: "28 Jan 2024", status: "pending", priority: "medium" }
  ];

  const handleGenerateReport = async () => {
    setIsGeneratingReport(true);
    toast({
      title: "Generating Report",
      description: "Your financial report is being generated...",
    });
    
    // Simulate report generation
    setTimeout(() => {
      setIsGeneratingReport(false);
      toast({
        title: "Report Generated",
        description: "Your financial report has been generated successfully!",
      });
    }, 2000);
  };

  const handleViewAnalytics = () => {
    setIsViewingAnalytics(true);
    toast({
      title: "Opening Analytics",
      description: "Loading detailed analytics dashboard...",
    });
    
    setTimeout(() => {
      setIsViewingAnalytics(false);
    }, 1000);
  };

  const handleAction = (action: string, amount?: number) => {
    toast({
      title: action,
      description: amount ? `Action initiated for ₹${amount.toLocaleString()}` : "Action initiated successfully!",
    });
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold text-gradient-primary">Finance Dashboard</h2>
          <p className="text-muted-foreground">Complete overview of your financial health</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={handleGenerateReport}
            disabled={isGeneratingReport}
            className="btn-mobile"
          >
            <FileText className="h-4 w-4 mr-2" />
            {isGeneratingReport ? "Generating..." : "Generate Report"}
          </Button>
          <Button 
            className="bg-gradient-primary btn-mobile"
            onClick={handleViewAnalytics}
            disabled={isViewingAnalytics}
          >
            <BarChart3 className="h-4 w-4 mr-2" />
            {isViewingAnalytics ? "Loading..." : "Analytics"}
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-gradient-success border-border/50 card-hover">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-success-foreground">₹{(monthlyData.income / 1000).toFixed(0)}K</div>
                <div className="text-sm text-success-foreground/80">Monthly Income</div>
              </div>
              <TrendingUp className="h-8 w-8 text-success-foreground/80" />
            </div>
            <div className="mt-2 text-xs text-success-foreground/70">
              +12% from last month
            </div>
          </CardContent>
        </Card>

        <Card className="bg-destructive/20 border-destructive/30 card-hover">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-foreground">₹{(monthlyData.expenses / 1000).toFixed(0)}K</div>
                <div className="text-sm text-muted-foreground">Monthly Expenses</div>
              </div>
              <DollarSign className="h-8 w-8 text-destructive" />
            </div>
            <div className="mt-2 text-xs text-muted-foreground">
              71% of income
            </div>
          </CardContent>
        </Card>

        <Card className="bg-electric-blue/20 border-electric-blue/30 card-hover">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-foreground">₹{(monthlyData.savings / 1000).toFixed(0)}K</div>
                <div className="text-sm text-muted-foreground">Monthly Savings</div>
              </div>
              <Target className="h-8 w-8 text-electric-blue" />
            </div>
            <div className="mt-2 text-xs text-muted-foreground">
              29% savings rate
            </div>
          </CardContent>
        </Card>

        <Card className="bg-graph-purple/20 border-graph-purple/30 card-hover">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-foreground">₹{(monthlyData.investments / 1000).toFixed(0)}K</div>
                <div className="text-sm text-muted-foreground">Investments</div>
              </div>
              <PieChart className="h-8 w-8 text-graph-purple" />
            </div>
            <div className="mt-2 text-xs text-muted-foreground">
              20% of income
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Dashboard Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Expense Breakdown */}
        <Card className="lg:col-span-2 bg-gradient-card border-border/50 card-hover">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PieChart className="h-5 w-5 text-primary" />
              Expense Analysis
            </CardTitle>
            <CardDescription>
              Monthly spending breakdown by category
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {expenseCategories.map((category, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">{category.name}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-sm">₹{category.amount.toLocaleString()}</span>
                      <Badge variant="secondary" className="text-xs">
                        {category.percentage}%
                      </Badge>
                    </div>
                  </div>
                  <Progress value={category.percentage} className="h-2" />
                </div>
              ))}
            </div>

            <div className="mt-6 p-4 bg-secondary/50 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Smartphone className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium">AI Insights</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Your food expenses increased by 15% this month. Consider setting a dining budget of ₹15,000 to stay on track.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Compliance Calendar */}
        <Card className="bg-gradient-card border-border/50 card-hover">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-primary" />
              Compliance Calendar
            </CardTitle>
            <CardDescription>
              Upcoming tax and compliance deadlines
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {upcomingEvents.map((event, index) => (
              <div 
                key={index} 
                className="p-3 bg-secondary/50 rounded-lg border-l-4 border-l-primary"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <div className="text-sm font-medium">{event.type}</div>
                    <div className="text-xs text-muted-foreground">{event.date}</div>
                  </div>
                  <Badge 
                    variant={event.status === "overdue" ? "destructive" : "secondary"}
                    className="text-xs"
                  >
                    {event.status}
                  </Badge>
                </div>
              </div>
            ))}
            
            <Button 
              variant="outline" 
              size="sm" 
              className="w-full mt-4"
              onClick={() => handleAction("View Full Calendar")}
            >
              View Full Calendar
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Investment Goals & GST Assistant */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Investment Goals */}
        <Card className="bg-gradient-card border-border/50 card-hover">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5 text-success" />
              Investment Goals
            </CardTitle>
            <CardDescription>
              Track progress towards your financial goals
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {investmentGoals.map((goal, index) => (
              <div key={index} className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">{goal.name}</span>
                  <span className="text-sm text-muted-foreground">
                    {goal.progress}%
                  </span>
                </div>
                <Progress value={goal.progress} className="h-2" />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>₹{(goal.current / 100000).toFixed(1)}L</span>
                  <span>₹{(goal.target / 100000).toFixed(1)}L</span>
                </div>
              </div>
            ))}
            
            <Button 
              variant="outline" 
              size="sm" 
              className="w-full mt-4"
              onClick={() => handleAction("Adjust Investment Goals")}
            >
              Adjust Goals
            </Button>
          </CardContent>
        </Card>

        {/* GST Assistant */}
        <Card className="bg-gradient-card border-border/50 card-hover">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-warning" />
              GST Assistant
            </CardTitle>
            <CardDescription>
              For freelancers and business owners
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="returns">Returns</TabsTrigger>
              </TabsList>
              
              <TabsContent value="overview" className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-3 bg-secondary/50 rounded">
                    <div className="text-lg font-bold">₹45,000</div>
                    <div className="text-xs text-muted-foreground">GST Collected</div>
                  </div>
                  <div className="text-center p-3 bg-secondary/50 rounded">
                    <div className="text-lg font-bold">₹12,000</div>
                    <div className="text-xs text-muted-foreground">GST Paid</div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm">Next Return Due</span>
                    <span className="text-sm font-medium">20 Jan 2024</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Pending Payment</span>
                    <span className="text-sm font-medium text-warning">₹33,000</span>
                  </div>
                </div>
                
                <Button 
                  size="sm" 
                  className="w-full"
                  onClick={() => handleAction("File GST Return", 33000)}
                >
                  File GST Return
                </Button>
              </TabsContent>
              
              <TabsContent value="returns" className="space-y-4">
                <div className="text-center text-muted-foreground">
                  <FileText className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <div className="text-sm">GST Return History</div>
                  <div className="text-xs">Coming soon...</div>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>

      {/* AI Recommendations */}
      <Card className="bg-gradient-card border-border/50 card-hover">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Smartphone className="h-5 w-5 text-primary" />
            AI Financial Advisor
          </CardTitle>
          <CardDescription>
            Personalized recommendations based on your financial data
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-success/10 border border-success/20 rounded-lg">
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <h4 className="font-medium text-success">Optimize Emergency Fund</h4>
                  <p className="text-sm text-muted-foreground">
                    Increase monthly SIP by ₹5,000 to reach 6-month goal faster
                  </p>
                  <div className="text-xs text-success">Saves: 8 months</div>
                </div>
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => handleAction("Setup SIP", 5000)}
                >
                  Setup SIP
                </Button>
              </div>
            </div>

            <div className="p-4 bg-primary/10 border border-primary/20 rounded-lg">
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <h4 className="font-medium text-primary">Tax-Saving Investment</h4>
                  <p className="text-sm text-muted-foreground">
                    Invest ₹50,000 more in ELSS for Section 80C benefit
                  </p>
                  <div className="text-xs text-primary">Saves: ₹15,000 tax</div>
                </div>
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => handleAction("Invest in ELSS", 50000)}
                >
                  Invest Now
                </Button>
              </div>
            </div>

            <div className="p-4 bg-warning/10 border border-warning/20 rounded-lg">
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <h4 className="font-medium text-warning">Reduce Dining Expenses</h4>
                  <p className="text-sm text-muted-foreground">
                    Set a ₹15,000 monthly budget for food & dining
                  </p>
                  <div className="text-xs text-warning">Saves: ₹3,000/month</div>
                </div>
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => handleAction("Set Dining Budget", 15000)}
                >
                  Set Budget
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default FinanceDashboard;