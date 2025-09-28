import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  BarChart3, 
  TrendingUp, 
  PieChart, 
  Activity,
  Download,
  RefreshCw,
  Filter,
  Calendar,
  DollarSign,
  Target,
  AlertCircle,
  CheckCircle
} from 'lucide-react';
import { 
  LineChart, 
  Line, 
  AreaChart, 
  Area,
  BarChart, 
  Bar, 
  PieChart as RechartsPieChart, 
  Pie,
  Cell,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Legend,
  ScatterChart,
  Scatter
} from 'recharts';
import { useToast } from '@/hooks/use-toast';

interface AnalyticsData {
  period: string;
  income: number;
  expenses: number;
  savings: number;
  investments: number;
  tax: number;
  creditScore: number;
}

interface AnalyticsProps {
  userId: string;
}

const AdvancedAnalytics = ({ userId }: AnalyticsProps) => {
  const [data, setData] = useState<AnalyticsData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState('12months');
  const [selectedMetric, setSelectedMetric] = useState('all');
  const { toast } = useToast();

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D'];

  useEffect(() => {
    console.log('Generating analytics data for user:', userId);
    generateAnalyticsData();
  }, [selectedPeriod, userId]);

  const generateAnalyticsData = async () => {
    setIsLoading(true);
    
    // Simulate data generation based on period
    setTimeout(() => {
      const months = selectedPeriod === '6months' ? 6 : selectedPeriod === '12months' ? 12 : 24;
      const generatedData: AnalyticsData[] = [];
      
      for (let i = months - 1; i >= 0; i--) {
        const date = new Date();
        date.setMonth(date.getMonth() - i);
        
        generatedData.push({
          period: date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
          income: Math.floor(Math.random() * 200000) + 800000,
          expenses: Math.floor(Math.random() * 150000) + 500000,
          savings: Math.floor(Math.random() * 100000) + 200000,
          investments: Math.floor(Math.random() * 80000) + 100000,
          tax: Math.floor(Math.random() * 50000) + 50000,
          creditScore: Math.floor(Math.random() * 100) + 700
        });
      }
      
      setData(generatedData);
      setIsLoading(false);
    }, 1500);
  };

  const calculateGrowth = (current: number, previous: number) => {
    return previous === 0 ? 0 : ((current - previous) / previous) * 100;
  };

  const getCurrentMetrics = () => {
    if (data.length === 0) return null;
    
    const current = data[data.length - 1];
    const previous = data.length > 1 ? data[data.length - 2] : current;
    
    return {
      income: {
        value: current.income,
        growth: calculateGrowth(current.income, previous.income),
        trend: current.income > previous.income ? 'up' : 'down'
      },
      expenses: {
        value: current.expenses,
        growth: calculateGrowth(current.expenses, previous.expenses),
        trend: current.expenses > previous.expenses ? 'up' : 'down'
      },
      savings: {
        value: current.savings,
        growth: calculateGrowth(current.savings, previous.savings),
        trend: current.savings > previous.savings ? 'up' : 'down'
      },
      investments: {
        value: current.investments,
        growth: calculateGrowth(current.investments, previous.investments),
        trend: current.investments > previous.investments ? 'up' : 'down'
      },
      creditScore: {
        value: current.creditScore,
        growth: calculateGrowth(current.creditScore, previous.creditScore),
        trend: current.creditScore > previous.creditScore ? 'up' : 'down'
      }
    };
  };

  const getInsights = () => {
    if (data.length === 0) return [];
    
    const insights = [];
    const metrics = getCurrentMetrics();
    
    if (metrics) {
      // Income growth insight
      if (metrics.income.growth > 10) {
        insights.push({
          type: 'positive',
          title: 'Strong Income Growth',
          description: `Your income has grown by ${metrics.income.growth.toFixed(1)}% this period. Great job!`,
          icon: TrendingUp
        });
      } else if (metrics.income.growth < -5) {
        insights.push({
          type: 'warning',
          title: 'Income Decline',
          description: `Your income has decreased by ${Math.abs(metrics.income.growth).toFixed(1)}%. Consider reviewing your income sources.`,
          icon: AlertCircle
        });
      }
      
      // Savings rate insight
      const savingsRate = (metrics.savings.value / metrics.income.value) * 100;
      if (savingsRate > 20) {
        insights.push({
          type: 'positive',
          title: 'Excellent Savings Rate',
          description: `You're saving ${savingsRate.toFixed(1)}% of your income. This is above the recommended 20%.`,
          icon: CheckCircle
        });
      } else if (savingsRate < 10) {
        insights.push({
          type: 'warning',
          title: 'Low Savings Rate',
          description: `Your savings rate is ${savingsRate.toFixed(1)}%. Consider increasing it to at least 20%.`,
          icon: AlertCircle
        });
      }
      
      // Credit score insight
      if (metrics.creditScore.value > 750) {
        insights.push({
          type: 'positive',
          title: 'Excellent Credit Score',
          description: `Your credit score of ${metrics.creditScore.value} is excellent. You qualify for the best rates.`,
          icon: CheckCircle
        });
      } else if (metrics.creditScore.value < 650) {
        insights.push({
          type: 'warning',
          title: 'Credit Score Needs Improvement',
          description: `Your credit score of ${metrics.creditScore.value} could be improved. Focus on payment history and credit utilization.`,
          icon: AlertCircle
        });
      }
    }
    
    return insights;
  };

  const exportReport = () => {
    toast({
      title: "Report Export",
      description: "Your analytics report is being generated and will be downloaded shortly.",
    });
  };

  const metrics = getCurrentMetrics();
  const insights = getInsights();

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-center min-h-[600px]">
          <div className="text-center">
            <RefreshCw className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
            <p className="text-xl font-medium">Generating analytics insights...</p>
            <p className="text-muted-foreground mt-2">This may take a few moments</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gradient-primary">Advanced Analytics</h2>
          <p className="text-muted-foreground">Deep insights into your financial patterns and trends</p>
        </div>
        <div className="flex gap-2">
          <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="6months">Last 6 Months</SelectItem>
              <SelectItem value="12months">Last 12 Months</SelectItem>
              <SelectItem value="24months">Last 24 Months</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={exportReport} variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      {metrics && (
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Income</p>
                  <p className="text-2xl font-bold">₹{metrics.income.value.toLocaleString()}</p>
                  <div className={`flex items-center text-xs ${metrics.income.trend === 'up' ? 'text-success' : 'text-destructive'}`}>
                    <TrendingUp className="h-3 w-3 mr-1" />
                    {metrics.income.growth.toFixed(1)}%
                  </div>
                </div>
                <DollarSign className="h-8 w-8 text-primary/20" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Expenses</p>
                  <p className="text-2xl font-bold">₹{metrics.expenses.value.toLocaleString()}</p>
                  <div className={`flex items-center text-xs ${metrics.expenses.trend === 'up' ? 'text-destructive' : 'text-success'}`}>
                    <TrendingUp className="h-3 w-3 mr-1" />
                    {metrics.expenses.growth.toFixed(1)}%
                  </div>
                </div>
                <Activity className="h-8 w-8 text-destructive/20" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Savings</p>
                  <p className="text-2xl font-bold">₹{metrics.savings.value.toLocaleString()}</p>
                  <div className={`flex items-center text-xs ${metrics.savings.trend === 'up' ? 'text-success' : 'text-destructive'}`}>
                    <TrendingUp className="h-3 w-3 mr-1" />
                    {metrics.savings.growth.toFixed(1)}%
                  </div>
                </div>
                <Target className="h-8 w-8 text-success/20" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Investments</p>
                  <p className="text-2xl font-bold">₹{metrics.investments.value.toLocaleString()}</p>
                  <div className={`flex items-center text-xs ${metrics.investments.trend === 'up' ? 'text-success' : 'text-destructive'}`}>
                    <TrendingUp className="h-3 w-3 mr-1" />
                    {metrics.investments.growth.toFixed(1)}%
                  </div>
                </div>
                <BarChart3 className="h-8 w-8 text-accent/20" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Credit Score</p>
                  <p className="text-2xl font-bold">{metrics.creditScore.value}</p>
                  <div className={`flex items-center text-xs ${metrics.creditScore.trend === 'up' ? 'text-success' : 'text-destructive'}`}>
                    <TrendingUp className="h-3 w-3 mr-1" />
                    {metrics.creditScore.growth.toFixed(1)}%
                  </div>
                </div>
                <CheckCircle className="h-8 w-8 text-warning/20" />
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* AI Insights */}
      {insights.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-primary" />
              AI-Powered Insights
            </CardTitle>
            <CardDescription>
              Personalized recommendations based on your financial patterns
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {insights.map((insight, index) => {
                const Icon = insight.icon;
                return (
                  <div
                    key={index}
                    className={`p-4 rounded-lg border ${
                      insight.type === 'positive' 
                        ? 'bg-success/10 border-success/20' 
                        : insight.type === 'warning'
                        ? 'bg-warning/10 border-warning/20'
                        : 'bg-muted/50 border-border'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <Icon className={`h-5 w-5 mt-0.5 ${
                        insight.type === 'positive' 
                          ? 'text-success' 
                          : insight.type === 'warning'
                          ? 'text-warning'
                          : 'text-muted-foreground'
                      }`} />
                      <div>
                        <h4 className="font-medium mb-1">{insight.title}</h4>
                        <p className="text-sm text-muted-foreground">{insight.description}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Analytics Charts */}
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="trends">Trends</TabsTrigger>
          <TabsTrigger value="breakdown">Breakdown</TabsTrigger>
          <TabsTrigger value="correlation">Correlation</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Income vs Expenses</CardTitle>
                <CardDescription>Monthly comparison of income and expenses</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={data}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="period" />
                      <YAxis />
                      <Tooltip formatter={(value) => [`₹${value.toLocaleString()}`, '']} />
                      <Area type="monotone" dataKey="income" stackId="1" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
                      <Area type="monotone" dataKey="expenses" stackId="2" stroke="#82ca9d" fill="#82ca9d" fillOpacity={0.6} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Savings Rate</CardTitle>
                <CardDescription>Percentage of income saved each month</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={data.map(d => ({
                      ...d,
                      savingsRate: ((d.savings / d.income) * 100).toFixed(1)
                    }))}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="period" />
                      <YAxis />
                      <Tooltip formatter={(value) => [`${value}%`, 'Savings Rate']} />
                      <Line type="monotone" dataKey="savingsRate" stroke="#8884d8" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="trends" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Financial Trends</CardTitle>
              <CardDescription>Long-term trends across all financial metrics</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-96">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="period" />
                    <YAxis />
                    <Tooltip formatter={(value) => [`₹${value.toLocaleString()}`, '']} />
                    <Legend />
                    <Line type="monotone" dataKey="income" stroke="#8884d8" strokeWidth={2} name="Income" />
                    <Line type="monotone" dataKey="expenses" stroke="#82ca9d" strokeWidth={2} name="Expenses" />
                    <Line type="monotone" dataKey="savings" stroke="#ffc658" strokeWidth={2} name="Savings" />
                    <Line type="monotone" dataKey="investments" stroke="#ff7300" strokeWidth={2} name="Investments" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="breakdown" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Expense Breakdown</CardTitle>
                <CardDescription>Distribution of expenses by category</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsPieChart>
                      <Pie
                        data={[
                          { name: 'Housing', value: 40, color: '#0088FE' },
                          { name: 'Food', value: 25, color: '#00C49F' },
                          { name: 'Transport', value: 15, color: '#FFBB28' },
                          { name: 'Entertainment', value: 10, color: '#FF8042' },
                          { name: 'Others', value: 10, color: '#8884D8' }
                        ]}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {data.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </RechartsPieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Investment Growth</CardTitle>
                <CardDescription>Monthly investment amounts and growth</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="period" />
                      <YAxis />
                      <Tooltip formatter={(value) => [`₹${value.toLocaleString()}`, '']} />
                      <Bar dataKey="investments" fill="#8884d8" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="correlation" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Financial Correlations</CardTitle>
              <CardDescription>Relationship between different financial metrics</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-96">
                <ResponsiveContainer width="100%" height="100%">
                  <ScatterChart data={data}>
                    <CartesianGrid />
                    <XAxis dataKey="income" name="Income" />
                    <YAxis dataKey="savings" name="Savings" />
                    <Tooltip cursor={{ strokeDasharray: '3 3' }} />
                    <Scatter dataKey="savings" fill="#8884d8" />
                  </ScatterChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdvancedAnalytics;
