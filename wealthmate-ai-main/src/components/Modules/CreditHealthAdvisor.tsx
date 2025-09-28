import { useState } from "react";
import { CreditCard, TrendingUp, AlertTriangle, CheckCircle, Sliders, Zap, Target, BarChart3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Slider as SliderComponent } from "@/components/ui/slider";
import { useToast } from "@/hooks/use-toast";

const CreditHealthAdvisor = () => {
  const [currentScore, setCurrentScore] = useState(720);
  const [creditUtilization, setCreditUtilization] = useState([35]);
  const [paymentHistory, setPaymentHistory] = useState([95]);
  const [newAccounts, setNewAccounts] = useState([2]);
  const [isGeneratingReport, setIsGeneratingReport] = useState(false);
  const [isQuickAction, setIsQuickAction] = useState(false);
  const { toast } = useToast();

  const getScoreColor = (score: number) => {
    if (score >= 750) return "text-success";
    if (score >= 700) return "text-warning";
    return "text-destructive";
  };

  const getScoreStatus = (score: number) => {
    if (score >= 750) return { text: "Excellent", color: "success" };
    if (score >= 700) return { text: "Good", color: "warning" };
    if (score >= 650) return { text: "Fair", color: "warning" };
    return { text: "Poor", color: "destructive" };
  };

  const simulateScore = () => {
    const utilizationImpact = (30 - creditUtilization[0]) * 2;
    const paymentImpact = (paymentHistory[0] - 95) * 3;
    const accountImpact = Math.max(0, (2 - newAccounts[0]) * 10);
    
    return Math.min(850, Math.max(300, currentScore + utilizationImpact + paymentImpact + accountImpact));
  };

  const projectedScore = simulateScore();
  const scoreStatus = getScoreStatus(projectedScore);

  const handleGenerateReport = async () => {
    setIsGeneratingReport(true);
    toast({
      title: "Generating Credit Report",
      description: "Your detailed credit report is being generated...",
    });
    
    setTimeout(() => {
      setIsGeneratingReport(false);
      toast({
        title: "Credit Report Ready",
        description: "Your credit report has been generated successfully!",
      });
    }, 2000);
  };

  const handleQuickActions = () => {
    setIsQuickAction(true);
    toast({
      title: "Quick Actions",
      description: "Opening quick action menu for credit improvement...",
    });
    
    setTimeout(() => {
      setIsQuickAction(false);
    }, 1000);
  };

  const handleAction = (action: string, impact?: string) => {
    toast({
      title: action,
      description: impact ? `Action initiated: ${impact}` : "Action initiated successfully!",
    });
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold text-gradient-primary">Credit Health Advisor</h2>
          <p className="text-muted-foreground">Monitor and improve your credit score with AI insights</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={handleGenerateReport}
            disabled={isGeneratingReport}
            className="btn-mobile"
          >
            <BarChart3 className="h-4 w-4 mr-2" />
            {isGeneratingReport ? "Generating..." : "Credit Report"}
          </Button>
          <Button 
            className="bg-gradient-primary btn-mobile"
            onClick={handleQuickActions}
            disabled={isQuickAction}
          >
            <Zap className="h-4 w-4 mr-2" />
            {isQuickAction ? "Loading..." : "Quick Actions"}
          </Button>
        </div>
      </div>

      {/* Current Credit Score */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="bg-gradient-card border-border/50 card-hover lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5 text-primary" />
              Credit Score Overview
            </CardTitle>
            <CardDescription>
              Your current CIBIL score and key factors affecting it
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Current Score */}
              <div className="text-center space-y-4">
                <div className="relative w-32 h-32 mx-auto">
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                    <path
                      d="M18 2.0845
                        a 15.9155 15.9155 0 0 1 0 31.831
                        a 15.9155 15.9155 0 0 1 0 -31.831"
                      fill="none"
                      stroke="hsl(var(--muted))"
                      strokeWidth="2"
                    />
                    <path
                      d="M18 2.0845
                        a 15.9155 15.9155 0 0 1 0 31.831
                        a 15.9155 15.9155 0 0 1 0 -31.831"
                      fill="none"
                      stroke="hsl(var(--primary))"
                      strokeWidth="2"
                      strokeDasharray={`${(currentScore / 850) * 100}, 100`}
                      className="transition-all duration-500"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <div className={`text-2xl font-bold ${getScoreColor(currentScore)}`}>
                        {currentScore}
                      </div>
                      <div className="text-xs text-muted-foreground">CIBIL Score</div>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Badge variant="outline" className={`bg-${scoreStatus.color}/20 text-${scoreStatus.color}`}>
                    {scoreStatus.text}
                  </Badge>
                  <div className="text-sm text-muted-foreground">
                    Last updated: 2 days ago
                  </div>
                </div>
              </div>

              {/* Score Factors */}
              <div className="space-y-4">
                <h4 className="font-medium">Key Factors</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-success" />
                      <span className="text-sm">Payment History</span>
                    </div>
                    <span className="text-sm font-medium">Excellent</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="h-4 w-4 text-warning" />
                      <span className="text-sm">Credit Utilization</span>
                    </div>
                    <span className="text-sm font-medium">High (35%)</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-success" />
                      <span className="text-sm">Credit Age</span>
                    </div>
                    <span className="text-sm font-medium">5.2 years</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-success" />
                      <span className="text-sm">Credit Mix</span>
                    </div>
                    <span className="text-sm font-medium">Good</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Stats */}
        <div className="space-y-4">
          <Card className="bg-gradient-success border-border/50 card-hover">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold text-success-foreground">12</div>
                  <div className="text-sm text-success-foreground/80">Credit Accounts</div>
                </div>
                <CreditCard className="h-8 w-8 text-success-foreground/80" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-secondary border-border/50 card-hover">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold">₹8.5L</div>
                  <div className="text-sm text-muted-foreground">Total Credit Limit</div>
                </div>
                <Target className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-warning/20 border-warning/30 card-hover">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold text-warning">₹2.8L</div>
                  <div className="text-sm text-warning-foreground">Amount Used</div>
                </div>
                <AlertTriangle className="h-8 w-8 text-warning" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Credit Score Simulator */}
      <Card className="bg-gradient-card border-border/50 card-hover">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-primary" />
            Credit Score Simulator
          </CardTitle>
          <CardDescription>
            See how changes to your credit behavior could impact your score
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Simulation Controls */}
            <div className="space-y-6">
              <div className="space-y-3">
                <label className="text-sm font-medium">
                  Credit Utilization: {creditUtilization[0]}%
                </label>
                <SliderComponent
                  value={creditUtilization}
                  onValueChange={setCreditUtilization}
                  max={100}
                  step={1}
                  className="w-full"
                />
                <div className="text-xs text-muted-foreground">
                  Current: 35% → Recommended: Below 30%
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-sm font-medium">
                  Payment History: {paymentHistory[0]}%
                </label>
                <SliderComponent
                  value={paymentHistory}
                  onValueChange={setPaymentHistory}
                  max={100}
                  min={70}
                  step={1}
                  className="w-full"
                />
                <div className="text-xs text-muted-foreground">
                  Current: 98% → Target: 100%
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-sm font-medium">
                  New Accounts (Last 6 months): {newAccounts[0]}
                </label>
                <SliderComponent
                  value={newAccounts}
                  onValueChange={setNewAccounts}
                  max={5}
                  min={0}
                  step={1}
                  className="w-full"
                />
                <div className="text-xs text-muted-foreground">
                  Fewer new accounts = Better score
                </div>
              </div>
            </div>

            {/* Projected Results */}
            <div className="space-y-4">
              <div className="text-center p-6 bg-secondary rounded-lg">
                <div className="text-sm text-muted-foreground mb-2">Projected Score</div>
                <div className={`text-4xl font-bold ${getScoreColor(projectedScore)}`}>
                  {projectedScore}
                </div>
                <div className="text-sm mt-2">
                  {projectedScore > currentScore ? (
                    <span className="text-success">
                      +{projectedScore - currentScore} points
                    </span>
                  ) : projectedScore < currentScore ? (
                    <span className="text-destructive">
                      {projectedScore - currentScore} points
                    </span>
                  ) : (
                    <span className="text-muted-foreground">No change</span>
                  )}
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="font-medium">Impact Analysis</h4>
                
                {creditUtilization[0] <= 30 && (
                  <div className="p-3 bg-success/20 border border-success/30 rounded-lg">
                    <div className="text-sm font-medium text-success">Credit Utilization Optimized</div>
                    <div className="text-xs text-success/80">+15-20 point boost expected</div>
                  </div>
                )}
                
                {paymentHistory[0] === 100 && (
                  <div className="p-3 bg-success/20 border border-success/30 rounded-lg">
                    <div className="text-sm font-medium text-success">Perfect Payment History</div>
                    <div className="text-xs text-success/80">Maintains high score</div>
                  </div>
                )}
                
                {newAccounts[0] === 0 && (
                  <div className="p-3 bg-success/20 border border-success/30 rounded-lg">
                    <div className="text-sm font-medium text-success">No New Credit Inquiries</div>
                    <div className="text-xs text-success/80">+5-10 point boost over time</div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recommendations */}
      <Card className="bg-gradient-card border-border/50 card-hover">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-warning" />
            AI Recommendations
          </CardTitle>
          <CardDescription>
            Personalized actions to improve your credit score
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-primary/10 border border-primary/20 rounded-lg">
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <h4 className="font-medium text-primary">Reduce Credit Utilization</h4>
                  <p className="text-sm text-muted-foreground">
                    Pay down ₹1.2L to bring utilization below 30%
                  </p>
                  <div className="text-xs text-primary">Impact: +15-25 points</div>
                </div>
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => handleAction("View Credit Utilization Plan", "+15-25 points")}
                >
                  View Plan
                </Button>
              </div>
            </div>

            <div className="p-4 bg-accent/10 border border-accent/20 rounded-lg">
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <h4 className="font-medium text-accent">Increase Credit Limit</h4>
                  <p className="text-sm text-muted-foreground">
                    Request limit increase on 2 existing cards
                  </p>
                  <div className="text-xs text-accent">Impact: +10-15 points</div>
                </div>
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => handleAction("Apply for Credit Limit Increase", "+10-15 points")}
                >
                  Apply Now
                </Button>
              </div>
            </div>

            <div className="p-4 bg-success/10 border border-success/20 rounded-lg">
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <h4 className="font-medium text-success">Diversify Credit Mix</h4>
                  <p className="text-sm text-muted-foreground">
                    Consider a small personal loan or retail account
                  </p>
                  <div className="text-xs text-success">Impact: +5-10 points</div>
                </div>
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => handleAction("Explore Credit Mix Options", "+5-10 points")}
                >
                  Explore
                </Button>
              </div>
            </div>

            <div className="p-4 bg-warning/10 border border-warning/20 rounded-lg">
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <h4 className="font-medium text-warning">Monitor Credit Report</h4>
                  <p className="text-sm text-muted-foreground">
                    Set up alerts for any changes to your credit report
                  </p>
                  <div className="text-xs text-warning">Prevents: Score drops</div>
                </div>
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => handleAction("Setup Credit Monitoring Alerts", "Prevents score drops")}
                >
                  Setup Alerts
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CreditHealthAdvisor;