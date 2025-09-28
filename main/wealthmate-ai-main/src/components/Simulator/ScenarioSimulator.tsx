import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { 
  Calculator, 
  TrendingUp, 
  CreditCard, 
  Target, 
  BarChart3,
  PieChart,
  DollarSign,
  Calendar,
  AlertCircle,
  CheckCircle
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart as RechartsPieChart, Cell } from 'recharts';

interface ScenarioSimulatorProps {
  userId: string;
}

interface ScenarioData {
  income: number;
  expenses: number;
  investments: number;
  creditScore: number;
  age: number;
  retirementAge: number;
  inflationRate: number;
  investmentReturn: number;
}

const ScenarioSimulator = ({ userId }: ScenarioSimulatorProps) => {
  const [scenario, setScenario] = useState<ScenarioData>({
    income: 1000000,
    expenses: 600000,
    investments: 200000,
    creditScore: 720,
    age: 30,
    retirementAge: 60,
    inflationRate: 6,
    investmentReturn: 12
  });

  const [projections, setProjections] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState('tax');

  // Calculate projections based on scenario
  useEffect(() => {
    calculateProjections();
  }, [scenario]);

  const calculateProjections = () => {
    const years = scenario.retirementAge - scenario.age;
    const projections = [];
    
    let currentWealth = scenario.investments;
    let currentIncome = scenario.income;
    let currentExpenses = scenario.expenses;
    
    for (let year = 0; year <= years; year++) {
      const age = scenario.age + year;
      
      // Calculate tax liability
      const taxLiability = calculateTax(currentIncome);
      const netIncome = currentIncome - taxLiability;
      
      // Calculate savings
      const savings = netIncome - currentExpenses;
      const investmentGrowth = currentWealth * (scenario.investmentReturn / 100);
      
      // Update wealth
      currentWealth += savings + investmentGrowth;
      
      // Apply inflation to income and expenses
      currentIncome *= (1 + scenario.inflationRate / 100);
      currentExpenses *= (1 + scenario.inflationRate / 100);
      
      projections.push({
        year: age,
        income: Math.round(currentIncome),
        expenses: Math.round(currentExpenses),
        savings: Math.round(savings),
        wealth: Math.round(currentWealth),
        taxLiability: Math.round(taxLiability),
        netIncome: Math.round(netIncome)
      });
    }
    
    setProjections(projections);
  };

  const calculateTax = (income: number) => {
    // Simplified tax calculation (Old Regime)
    if (income <= 250000) return 0;
    if (income <= 500000) return (income - 250000) * 0.05;
    if (income <= 1000000) return 12500 + (income - 500000) * 0.20;
    return 112500 + (income - 1000000) * 0.30;
  };

  const calculateCreditScoreProjection = () => {
    const currentScore = scenario.creditScore;
    const utilization = (scenario.expenses * 0.3) / 500000; // Assuming credit limit
    const paymentHistory = 95; // Assume good payment history
    
    // Simplified credit score calculation
    let projectedScore = currentScore;
    
    if (utilization < 0.3) projectedScore += 20;
    if (paymentHistory > 90) projectedScore += 15;
    if (scenario.investments > scenario.income * 0.2) projectedScore += 10;
    
    return Math.min(850, Math.max(300, projectedScore));
  };

  const getRetirementReadiness = () => {
    const finalWealth = projections[projections.length - 1]?.wealth || 0;
    const requiredWealth = scenario.expenses * 25; // 25x annual expenses rule
    
    const readiness = (finalWealth / requiredWealth) * 100;
    
    if (readiness >= 100) return { status: 'excellent', color: 'success', text: 'On Track' };
    if (readiness >= 75) return { status: 'good', color: 'warning', text: 'Almost There' };
    return { status: 'needs-work', color: 'destructive', text: 'Needs Improvement' };
  };

  const retirementReadiness = getRetirementReadiness();
  const projectedCreditScore = calculateCreditScoreProjection();

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gradient-primary">Scenario Simulator</h2>
          <p className="text-muted-foreground">Model different financial scenarios and see their impact</p>
        </div>
        <Button className="bg-gradient-primary">
          <BarChart3 className="h-4 w-4 mr-2" />
          Export Report
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="tax">Tax Projections</TabsTrigger>
          <TabsTrigger value="wealth">Wealth Building</TabsTrigger>
          <TabsTrigger value="credit">Credit Score</TabsTrigger>
          <TabsTrigger value="retirement">Retirement</TabsTrigger>
        </TabsList>

        {/* Tax Projections */}
        <TabsContent value="tax" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calculator className="h-5 w-5" />
                  Tax Scenario Inputs
                </CardTitle>
                <CardDescription>
                  Adjust parameters to see tax impact
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Annual Income: ₹{scenario.income.toLocaleString()}</Label>
                  <Slider
                    value={[scenario.income]}
                    onValueChange={([value]) => setScenario(prev => ({ ...prev, income: value }))}
                    min={100000}
                    max={10000000}
                    step={50000}
                    className="w-full"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Annual Expenses: ₹{scenario.expenses.toLocaleString()}</Label>
                  <Slider
                    value={[scenario.expenses]}
                    onValueChange={([value]) => setScenario(prev => ({ ...prev, expenses: value }))}
                    min={100000}
                    max={scenario.income}
                    step={10000}
                    className="w-full"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Current Age: {scenario.age} years</Label>
                  <Slider
                    value={[scenario.age]}
                    onValueChange={([value]) => setScenario(prev => ({ ...prev, age: value }))}
                    min={18}
                    max={65}
                    step={1}
                    className="w-full"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Retirement Age: {scenario.retirementAge} years</Label>
                  <Slider
                    value={[scenario.retirementAge]}
                    onValueChange={([value]) => setScenario(prev => ({ ...prev, retirementAge: value }))}
                    min={scenario.age + 1}
                    max={80}
                    step={1}
                    className="w-full"
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Tax Projections</CardTitle>
                <CardDescription>
                  How your tax liability changes over time
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={projections.slice(0, 10)}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="year" />
                      <YAxis />
                      <Tooltip formatter={(value) => [`₹${value.toLocaleString()}`, '']} />
                      <Line type="monotone" dataKey="taxLiability" stroke="#8884d8" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Tax Optimization Insights</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 bg-primary/10 rounded-lg">
                  <h4 className="font-medium text-primary">Current Tax Liability</h4>
                  <p className="text-2xl font-bold">₹{calculateTax(scenario.income).toLocaleString()}</p>
                  <p className="text-sm text-muted-foreground">
                    {((calculateTax(scenario.income) / scenario.income) * 100).toFixed(1)}% of income
                  </p>
                </div>
                
                <div className="p-4 bg-success/10 rounded-lg">
                  <h4 className="font-medium text-success">Potential Savings</h4>
                  <p className="text-2xl font-bold">₹{(scenario.income * 0.1).toLocaleString()}</p>
                  <p className="text-sm text-muted-foreground">With proper tax planning</p>
                </div>
                
                <div className="p-4 bg-warning/10 rounded-lg">
                  <h4 className="font-medium text-warning">Recommended Investment</h4>
                  <p className="text-2xl font-bold">₹{Math.min(scenario.income * 0.2, 150000).toLocaleString()}</p>
                  <p className="text-sm text-muted-foreground">For Section 80C benefits</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Wealth Building */}
        <TabsContent value="wealth" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Investment Parameters
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Current Investments: ₹{scenario.investments.toLocaleString()}</Label>
                  <Slider
                    value={[scenario.investments]}
                    onValueChange={([value]) => setScenario(prev => ({ ...prev, investments: value }))}
                    min={0}
                    max={scenario.income}
                    step={10000}
                    className="w-full"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Expected Return: {scenario.investmentReturn}%</Label>
                  <Slider
                    value={[scenario.investmentReturn]}
                    onValueChange={([value]) => setScenario(prev => ({ ...prev, investmentReturn: value }))}
                    min={5}
                    max={20}
                    step={0.5}
                    className="w-full"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Inflation Rate: {scenario.inflationRate}%</Label>
                  <Slider
                    value={[scenario.inflationRate]}
                    onValueChange={([value]) => setScenario(prev => ({ ...prev, inflationRate: value }))}
                    min={2}
                    max={10}
                    step={0.5}
                    className="w-full"
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Wealth Growth Projection</CardTitle>
                <CardDescription>
                  Your wealth accumulation over time
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={projections}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="year" />
                      <YAxis />
                      <Tooltip formatter={(value) => [`₹${value.toLocaleString()}`, '']} />
                      <Line type="monotone" dataKey="wealth" stroke="#00C49F" strokeWidth={3} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Wealth Building Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-muted/50 rounded-lg">
                  <div className="text-2xl font-bold text-primary">
                    ₹{projections[projections.length - 1]?.wealth.toLocaleString() || 0}
                  </div>
                  <div className="text-sm text-muted-foreground">Final Wealth</div>
                </div>
                
                <div className="text-center p-4 bg-muted/50 rounded-lg">
                  <div className="text-2xl font-bold text-success">
                    ₹{((projections[projections.length - 1]?.wealth || 0) - scenario.investments).toLocaleString()}
                  </div>
                  <div className="text-sm text-muted-foreground">Total Growth</div>
                </div>
                
                <div className="text-center p-4 bg-muted/50 rounded-lg">
                  <div className="text-2xl font-bold text-warning">
                    {((projections[projections.length - 1]?.wealth || 0) / scenario.investments).toFixed(1)}x
                  </div>
                  <div className="text-sm text-muted-foreground">Growth Multiple</div>
                </div>
                
                <div className="text-center p-4 bg-muted/50 rounded-lg">
                  <div className="text-2xl font-bold text-accent">
                    {scenario.investmentReturn}%
                  </div>
                  <div className="text-sm text-muted-foreground">Annual Return</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Credit Score */}
        <TabsContent value="credit" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5" />
                  Credit Score Factors
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Current Credit Score: {scenario.creditScore}</Label>
                  <Slider
                    value={[scenario.creditScore]}
                    onValueChange={([value]) => setScenario(prev => ({ ...prev, creditScore: value }))}
                    min={300}
                    max={850}
                    step={10}
                    className="w-full"
                  />
                </div>

                <div className="space-y-4">
                  <div className="p-4 bg-muted/50 rounded-lg">
                    <h4 className="font-medium mb-2">Credit Utilization</h4>
                    <div className="text-sm text-muted-foreground">
                      Current: {((scenario.expenses * 0.3) / 500000 * 100).toFixed(1)}%
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Recommended: Below 30%
                    </div>
                  </div>

                  <div className="p-4 bg-muted/50 rounded-lg">
                    <h4 className="font-medium mb-2">Payment History</h4>
                    <div className="text-sm text-muted-foreground">
                      Assumed: 95% (Excellent)
                    </div>
                  </div>

                  <div className="p-4 bg-muted/50 rounded-lg">
                    <h4 className="font-medium mb-2">Credit Mix</h4>
                    <div className="text-sm text-muted-foreground">
                      Based on investments: Good
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Credit Score Projection</CardTitle>
                <CardDescription>
                  How your credit score could improve
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center space-y-4">
                  <div className="relative w-32 h-32 mx-auto">
                    <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                      <path
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        fill="none"
                        stroke="hsl(var(--muted))"
                        strokeWidth="2"
                      />
                      <path
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        fill="none"
                        stroke="hsl(var(--primary))"
                        strokeWidth="2"
                        strokeDasharray={`${(projectedCreditScore / 850) * 100}, 100`}
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-primary">
                          {projectedCreditScore}
                        </div>
                        <div className="text-xs text-muted-foreground">Projected Score</div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Badge variant="outline" className="bg-success/20 text-success">
                      +{projectedCreditScore - scenario.creditScore} points
                    </Badge>
                    <div className="text-sm text-muted-foreground">
                      Potential improvement
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Retirement Planning */}
        <TabsContent value="retirement" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  Retirement Readiness
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center p-6 bg-muted/50 rounded-lg">
                  <div className="text-4xl font-bold mb-2">
                    {retirementReadiness.text}
                  </div>
                  <Badge variant={retirementReadiness.color as any} className="text-lg px-4 py-2">
                    {retirementReadiness.status === 'excellent' ? 'Excellent' : 
                     retirementReadiness.status === 'good' ? 'Good' : 'Needs Work'}
                  </Badge>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm">Required Wealth:</span>
                    <span className="font-medium">₹{(scenario.expenses * 25).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Projected Wealth:</span>
                    <span className="font-medium">₹{projections[projections.length - 1]?.wealth.toLocaleString() || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Years to Retirement:</span>
                    <span className="font-medium">{scenario.retirementAge - scenario.age} years</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Retirement Projection</CardTitle>
                <CardDescription>
                  Your wealth vs. retirement needs
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={projections}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="year" />
                      <YAxis />
                      <Tooltip formatter={(value) => [`₹${value.toLocaleString()}`, '']} />
                      <Line type="monotone" dataKey="wealth" stroke="#00C49F" strokeWidth={3} name="Projected Wealth" />
                      <Line type="monotone" dataKey="expenses" stroke="#FF8042" strokeWidth={2} name="Annual Expenses" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Retirement Recommendations</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {retirementReadiness.status === 'needs-work' && (
                  <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
                    <AlertCircle className="h-5 w-5 text-destructive mb-2" />
                    <h4 className="font-medium text-destructive">Increase Savings</h4>
                    <p className="text-sm text-muted-foreground">
                      Consider increasing your monthly savings by ₹{Math.round((scenario.expenses * 25 - (projections[projections.length - 1]?.wealth || 0)) / ((scenario.retirementAge - scenario.age) * 12))}
                    </p>
                  </div>
                )}
                
                <div className="p-4 bg-primary/10 border border-primary/20 rounded-lg">
                  <CheckCircle className="h-5 w-5 text-primary mb-2" />
                  <h4 className="font-medium text-primary">Diversify Investments</h4>
                  <p className="text-sm text-muted-foreground">
                    Consider a mix of equity, debt, and alternative investments
                  </p>
                </div>
                
                <div className="p-4 bg-warning/10 border border-warning/20 rounded-lg">
                  <Target className="h-5 w-5 text-warning mb-2" />
                  <h4 className="font-medium text-warning">Review Annually</h4>
                  <p className="text-sm text-muted-foreground">
                    Adjust your strategy based on market conditions and life changes
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ScenarioSimulator;
