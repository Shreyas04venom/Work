import { useMemo, useState } from "react";
import { CreditCard, TrendingUp, AlertTriangle, CheckCircle, Sliders, Zap, Target, BarChart3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Slider as SliderComponent } from "@/components/ui/slider";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";

const CreditHealthAdvisor = () => {
  const [currentScore, setCurrentScore] = useState(720);
  const [creditUtilization, setCreditUtilization] = useState([35]);
  const [paymentHistory, setPaymentHistory] = useState([95]);
  const [newAccounts, setNewAccounts] = useState([2]);
  const [isGeneratingReport, setIsGeneratingReport] = useState(false);
  const [isQuickAction, setIsQuickAction] = useState(false);
  const { toast } = useToast();

  // Accuracy inputs for better scoring
  const [totalCreditLimit, setTotalCreditLimit] = useState<number>(850000);
  const [amountUsed, setAmountUsed] = useState<number>(280000);
  const [monthlyIncome, setMonthlyIncome] = useState<number>(120000);
  const [monthlyEMI, setMonthlyEMI] = useState<number>(25000);
  const [avgCreditAgeYears, setAvgCreditAgeYears] = useState<number>(5.2);
  const [revolvingAccounts, setRevolvingAccounts] = useState<number>(3);
  const [installmentAccounts, setInstallmentAccounts] = useState<number>(2);
  const [missedPaymentsLast24, setMissedPaymentsLast24] = useState<number>(1);
  const [hardInquiriesLast12, setHardInquiriesLast12] = useState<number>(2);

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

  const metrics = useMemo(() => {
    const utilizationPct = totalCreditLimit > 0 ? Math.round((amountUsed / totalCreditLimit) * 100) : 0;
    const dtiPct = monthlyIncome > 0 ? Math.round((monthlyEMI / monthlyIncome) * 100) : 0;
    const paymentRate = Math.min(100, Math.max(0, 100 - Math.round((missedPaymentsLast24 / 24) * 100)));
    const mixScore = (() => {
      const total = revolvingAccounts + installmentAccounts;
      if (total === 0) return 50;
      const ratio = revolvingAccounts / total;
      const balancePenalty = Math.abs(0.5 - ratio) * 100;
      return Math.max(50, Math.round(100 - balancePenalty));
    })();
    return { utilizationPct, dtiPct, paymentRate, mixScore };
  }, [totalCreditLimit, amountUsed, monthlyIncome, monthlyEMI, missedPaymentsLast24, revolvingAccounts, installmentAccounts]);

  const simulateScore = () => {
    const wPayment = 0.35;
    const wUtil = 0.30;
    const wAge = 0.15;
    const wNew = 0.10;
    const wMix = 0.10;

    const paymentSub = metrics.paymentRate;
    const utilSub = Math.max(0, 100 - Math.max(0, metrics.utilizationPct - 10) * 2.5);
    const ageSub = Math.min(100, Math.round((avgCreditAgeYears / 10) * 100));
    const newSub = Math.max(0, 100 - hardInquiriesLast12 * 15 - Math.max(0, newAccounts[0] - 1) * 10);
    const mixSub = metrics.mixScore;

    const composite = wPayment * paymentSub + wUtil * utilSub + wAge * ageSub + wNew * newSub + wMix * mixSub;
    const base = 300;
    const projected = Math.round(base + (composite / 100) * (850 - base));
    const dtiAdj = metrics.dtiPct > 40 ? -Math.min(40, Math.round((metrics.dtiPct - 40) * 0.8)) : 0;
    return Math.min(850, Math.max(300, projected + dtiAdj));
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

  // REVERT: disable memoized recommendations
  /* const recommendations = useMemo(() => {
    const recs: Array<{ title: string; color: string; description: string; impact: string; action: string; onClick: () => void }> = [];
    const util = metrics.utilizationPct;
    const targetUtil = 30;
    if (util > targetUtil) {
      const desiredUsed = Math.round((targetUtil / 100) * totalCreditLimit);
      const paydown = Math.max(0, amountUsed - desiredUsed);
      recs.push({
        title: "Reduce Credit Utilization",
        color: "primary",
        description: `Pay down ₹${paydown.toLocaleString()} to reach ${targetUtil}% utilization`,
        impact: "+15-25 points",
        action: "View Plan",
        onClick: () => handleAction("View Credit Utilization Plan", "+15-25 points"),
      });
      recs.push({
        title: "Request Credit Limit Increase",
        color: "accent",
        description: "Ask issuers for 10-20% limit increase to lower utilization",
        impact: "+8-12 points",
        action: "Apply Now",
        onClick: () => handleAction("Apply for Credit Limit Increase", "+8-12 points"),
      });
    }
    if (missedPaymentsLast24 > 0) {
      recs.push({
        title: "Stabilize Payment History",
        color: "success",
        description: "Set autopay and clear overdue balances to avoid delinquencies",
        impact: "+10-20 points over 3-6 months",
        action: "Setup Autopay",
        onClick: () => handleAction("Setup Autopay & Reminders", "+10-20 points over 3-6 months"),
      });
    }
    if (hardInquiriesLast12 >= 2 || newAccounts[0] >= 2) {
      recs.push({
        title: "Limit New Credit Applications",
        color: "warning",
        description: "Pause new applications for 3-6 months to recover inquiry impact",
        impact: "+5-10 points",
        action: "Plan Pause",
        onClick: () => handleAction("Limit New Credit Applications", "+5-10 points"),
      });
    }
    if (metrics.dtiPct > 40) {
      recs.push({
        title: "Lower Debt-to-Income (DTI)",
        color: "warning",
        description: "Prepay loans or refinance to bring DTI under 35%",
        impact: "+5-12 points",
        action: "Explore Options",
        onClick: () => handleAction("Lower Debt-to-Income (DTI)", "+5-12 points"),
      });
    }
    if (metrics.mixScore < 70) {
      recs.push({
        title: "Balance Credit Mix",
        color: "success",
        description: "Consider adjusting revolving vs installment accounts to improve mix",
        impact: "+3-7 points",
        action: "Explore",
        onClick: () => handleAction("Explore Credit Mix Options", "+3-7 points"),
      });
    }
    return recs;
  }, [metrics, totalCreditLimit, amountUsed, missedPaymentsLast24, hardInquiriesLast12, newAccounts]); */

  // REVERT: remove export insights handler

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
            See how changes to your profile and behavior impact your score
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Simulation Controls */}
            <div className="space-y-6">
              {/* Profile Inputs for accuracy */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Total Credit Limit (₹)</label>
                  <Input type="number" value={totalCreditLimit}
                    onChange={(e) => setTotalCreditLimit(Number(e.target.value) || 0)} />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Amount Used (₹)</label>
                  <Input type="number" value={amountUsed}
                    onChange={(e) => setAmountUsed(Number(e.target.value) || 0)} />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Monthly Income (₹)</label>
                  <Input type="number" value={monthlyIncome}
                    onChange={(e) => setMonthlyIncome(Number(e.target.value) || 0)} />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Monthly EMI (₹)</label>
                  <Input type="number" value={monthlyEMI}
                    onChange={(e) => setMonthlyEMI(Number(e.target.value) || 0)} />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Avg Credit Age (years)</label>
                  <Input type="number" step="0.1" value={avgCreditAgeYears}
                    onChange={(e) => setAvgCreditAgeYears(Number(e.target.value) || 0)} />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Hard Inquiries (12m)</label>
                  <Input type="number" value={hardInquiriesLast12}
                    onChange={(e) => setHardInquiriesLast12(Number(e.target.value) || 0)} />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Missed Payments (24m)</label>
                  <Input type="number" value={missedPaymentsLast24}
                    onChange={(e) => setMissedPaymentsLast24(Number(e.target.value) || 0)} />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Revolving Accounts</label>
                  <Input type="number" value={revolvingAccounts}
                    onChange={(e) => setRevolvingAccounts(Number(e.target.value) || 0)} />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Installment Accounts</label>
                  <Input type="number" value={installmentAccounts}
                    onChange={(e) => setInstallmentAccounts(Number(e.target.value) || 0)} />
                </div>
              </div>
              <div className="space-y-3">
                <label className="text-sm font-medium">
                  Credit Utilization: {metrics.utilizationPct}%
                </label>
                <div className="text-xs text-muted-foreground">
                  Recommended: Below 30%
                </div>
                <div className="text-xs text-muted-foreground">
                  DTI: {metrics.dtiPct}% (Aim &lt; 35%)
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-sm font-medium">
                  Payment History: {metrics.paymentRate}%
                </label>
                <div className="text-xs text-muted-foreground">
                  Missed in 24m: {missedPaymentsLast24}
                </div>
                <div className="text-xs text-muted-foreground">
                  Target: 100% on-time payments
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-sm font-medium">
                  New Accounts (Last 6 months): {newAccounts[0]} | Inquiries: {hardInquiriesLast12}
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
                <div className="p-3 bg-secondary border rounded-lg text-sm">
                  Utilization: {metrics.utilizationPct}% • DTI: {metrics.dtiPct}% • Age: {avgCreditAgeYears}y
                </div>
                {metrics.utilizationPct <= 30 && (
                  <div className="p-3 bg-success/20 border border-success/30 rounded-lg">
                    <div className="text-sm font-medium text-success">Credit Utilization Optimized</div>
                    <div className="text-xs text-success/80">+15-25 point boost expected</div>
                  </div>
                )}
                {metrics.dtiPct >= 40 && (
                  <div className="p-3 bg-warning/20 border border-warning/30 rounded-lg">
                    <div className="text-sm font-medium text-warning">High DTI</div>
                    <div className="text-xs text-warning/80">Reduce EMI or increase income to mitigate penalty</div>
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
          {/** Dynamic recommendations based on profile */}
          {(() => {
            const recs = [] as Array<{ title: string; color: string; description: string; impact: string; action: string; onClick: () => void }>;
            const util = metrics.utilizationPct;
            const targetUtil = 30;
            if (util > targetUtil) {
              const desiredUsed = Math.round((targetUtil / 100) * totalCreditLimit);
              const paydown = Math.max(0, amountUsed - desiredUsed);
              recs.push({
                title: "Reduce Credit Utilization",
                color: "primary",
                description: `Pay down ₹${paydown.toLocaleString()} to reach ${targetUtil}% utilization`,
                impact: "+15-25 points",
                action: "View Plan",
                onClick: () => handleAction("View Credit Utilization Plan", "+15-25 points"),
              });
              recs.push({
                title: "Request Credit Limit Increase",
                color: "accent",
                description: "Ask issuers for 10-20% limit increase to lower utilization",
                impact: "+8-12 points",
                action: "Apply Now",
                onClick: () => handleAction("Apply for Credit Limit Increase", "+8-12 points"),
              });
            }
            if (missedPaymentsLast24 > 0) {
              recs.push({
                title: "Stabilize Payment History",
                color: "success",
                description: "Set autopay and clear overdue balances to avoid delinquencies",
                impact: "+10-20 points over 3-6 months",
                action: "Setup Autopay",
                onClick: () => handleAction("Setup Autopay & Reminders", "+10-20 points over 3-6 months"),
              });
            }
            if (hardInquiriesLast12 >= 2 || newAccounts[0] >= 2) {
              recs.push({
                title: "Limit New Credit Applications",
                color: "warning",
                description: "Pause new applications for 3-6 months to recover inquiry impact",
                impact: "+5-10 points",
                action: "Plan Pause",
                onClick: () => handleAction("Limit New Credit Applications", "+5-10 points"),
              });
            }
            if (metrics.dtiPct > 40) {
              recs.push({
                title: "Lower Debt-to-Income (DTI)",
                color: "warning",
                description: "Prepay loans or refinance to bring DTI under 35%",
                impact: "+5-12 points",
                action: "Explore Options",
                onClick: () => handleAction("Lower Debt-to-Income (DTI)", "+5-12 points"),
              });
            }
            if (metrics.mixScore < 70) {
              recs.push({
                title: "Balance Credit Mix",
                color: "success",
                description: "Consider adjusting revolving vs installment accounts to improve mix",
                impact: "+3-7 points",
                action: "Explore",
                onClick: () => handleAction("Explore Credit Mix Options", "+3-7 points"),
              });
            }
            return (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {recs.length === 0 ? (
                  <div className="p-4 bg-secondary rounded text-sm text-muted-foreground">
                    Your profile looks strong. Keep up consistent payments and low utilization.
                  </div>
                ) : (
                  recs.map((r, i) => (
                    <div key={i} className={`p-4 bg-${r.color}/10 border border-${r.color}/20 rounded-lg`}>
                      <div className="flex items-start justify-between">
                        <div className="space-y-2">
                          <h4 className={`font-medium text-${r.color}`}>{r.title}</h4>
                          <p className="text-sm text-muted-foreground">{r.description}</p>
                          <div className={`text-xs text-${r.color}`}>Impact: {r.impact}</div>
                        </div>
                        <Button size="sm" variant="outline" onClick={r.onClick}>
                          {r.action}
                        </Button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            );
          })()}
        </CardContent>
      </Card>
    </div>
  );
};

export default CreditHealthAdvisor;