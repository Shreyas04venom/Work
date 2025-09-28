import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Lightbulb, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle, 
  DollarSign,
  Target,
  Calendar,
  Zap,
  ArrowRight,
  X,
  RefreshCw
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Nudge {
  id: string;
  type: 'opportunity' | 'warning' | 'tip' | 'achievement';
  priority: 'high' | 'medium' | 'low';
  title: string;
  description: string;
  action: string;
  impact: string;
  category: 'tax' | 'credit' | 'investment' | 'savings' | 'general';
  timestamp: string;
  dismissed?: boolean;
}

interface AINudgesProps {
  userId: string;
}

const AINudges = ({ userId }: AINudgesProps) => {
  const [nudges, setNudges] = useState<Nudge[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'high' | 'medium' | 'low'>('all');
  const { toast } = useToast();

  useEffect(() => {
    generateNudges();
  }, [userId]);

  const generateNudges = async () => {
    setIsLoading(true);
    
    // Simulate AI analysis and nudge generation
    setTimeout(() => {
      const generatedNudges: Nudge[] = [
        {
          id: '1',
          type: 'opportunity',
          priority: 'high',
          title: 'Tax Regime Switch Opportunity',
          description: 'You could save ₹18,500 by switching to the Old Tax Regime this year. Your current deductions suggest higher savings potential.',
          action: 'Switch to Old Regime',
          impact: '₹18,500 annual savings',
          category: 'tax',
          timestamp: '2 minutes ago'
        },
        {
          id: '2',
          type: 'warning',
          priority: 'high',
          title: 'Credit Utilization High',
          description: 'Your credit card utilization is at 78%, which is negatively impacting your credit score. Consider paying down balances.',
          action: 'Reduce Credit Usage',
          impact: '+15 credit score points',
          category: 'credit',
          timestamp: '15 minutes ago'
        },
        {
          id: '3',
          type: 'tip',
          priority: 'medium',
          title: 'Emergency Fund Opportunity',
          description: 'You have ₹2.5L in your savings account earning 3.5% interest. Consider moving to a high-yield savings account for 6.5% returns.',
          action: 'Optimize Savings',
          impact: '₹7,500 additional annual income',
          category: 'savings',
          timestamp: '1 hour ago'
        },
        {
          id: '4',
          type: 'achievement',
          priority: 'low',
          title: 'Investment Milestone Reached',
          description: 'Congratulations! Your SIP investments have grown by 12% this quarter, outperforming the market average of 8%.',
          action: 'View Portfolio',
          impact: '₹24,000 unrealized gains',
          category: 'investment',
          timestamp: '2 hours ago'
        },
        {
          id: '5',
          type: 'opportunity',
          priority: 'medium',
          title: 'Section 80C Optimization',
          description: 'You\'ve only utilized ₹1.2L of your ₹1.5L Section 80C limit. Consider investing in ELSS funds for tax benefits.',
          action: 'Invest in ELSS',
          impact: '₹9,000 tax savings',
          category: 'tax',
          timestamp: '3 hours ago'
        },
        {
          id: '6',
          type: 'tip',
          priority: 'low',
          title: 'GST Return Due Soon',
          description: 'Your monthly GST return for January 2024 is due in 3 days. Early filing can help avoid penalties.',
          action: 'File GST Return',
          impact: 'Avoid ₹500 penalty',
          category: 'tax',
          timestamp: '4 hours ago'
        }
      ];
      
      setNudges(generatedNudges);
      setIsLoading(false);
    }, 1500);
  };

  const handleNudgeAction = (nudgeId: string, action: string) => {
    toast({
      title: "Action Initiated",
      description: `${action} - This feature will be implemented soon!`,
    });
    
    // Mark nudge as acted upon
    setNudges(prev => 
      prev.map(nudge => 
        nudge.id === nudgeId 
          ? { ...nudge, dismissed: true }
          : nudge
      )
    );
  };

  const dismissNudge = (nudgeId: string) => {
    setNudges(prev => 
      prev.map(nudge => 
        nudge.id === nudgeId 
          ? { ...nudge, dismissed: true }
          : nudge
      )
    );
  };

  const getNudgeIcon = (type: string) => {
    switch (type) {
      case 'opportunity': return <TrendingUp className="h-5 w-5 text-success" />;
      case 'warning': return <AlertTriangle className="h-5 w-5 text-destructive" />;
      case 'tip': return <Lightbulb className="h-5 w-5 text-warning" />;
      case 'achievement': return <CheckCircle className="h-5 w-5 text-primary" />;
      default: return <Zap className="h-5 w-5 text-muted-foreground" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'destructive';
      case 'medium': return 'warning';
      case 'low': return 'secondary';
      default: return 'outline';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'tax': return 'bg-blue-100 text-blue-800';
      case 'credit': return 'bg-green-100 text-green-800';
      case 'investment': return 'bg-purple-100 text-purple-800';
      case 'savings': return 'bg-yellow-100 text-yellow-800';
      case 'general': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredNudges = nudges.filter(nudge => {
    if (nudge.dismissed) return false;
    if (filter === 'all') return true;
    return nudge.priority === filter;
  });

  const nudgeStats = {
    total: nudges.length,
    active: filteredNudges.length,
    high: nudges.filter(n => n.priority === 'high' && !n.dismissed).length,
    opportunities: nudges.filter(n => n.type === 'opportunity' && !n.dismissed).length
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <RefreshCw className="h-8 w-8 animate-spin text-primary mx-auto mb-4" />
            <p className="text-muted-foreground">AI is analyzing your financial data...</p>
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
          <h2 className="text-3xl font-bold text-gradient-primary">AI Financial Nudges</h2>
          <p className="text-muted-foreground">Personalized insights and recommendations powered by AI</p>
        </div>
        <Button onClick={generateNudges} variant="outline">
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh Analysis
        </Button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Active Nudges</p>
                <p className="text-2xl font-bold text-primary">{nudgeStats.active}</p>
              </div>
              <Zap className="h-8 w-8 text-primary/20" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">High Priority</p>
                <p className="text-2xl font-bold text-destructive">{nudgeStats.high}</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-destructive/20" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Opportunities</p>
                <p className="text-2xl font-bold text-success">{nudgeStats.opportunities}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-success/20" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Generated</p>
                <p className="text-2xl font-bold text-accent">{nudgeStats.total}</p>
              </div>
              <Lightbulb className="h-8 w-8 text-accent/20" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2">
        {['all', 'high', 'medium', 'low'].map((priority) => (
          <Button
            key={priority}
            variant={filter === priority ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilter(priority as any)}
            className="capitalize"
          >
            {priority} Priority
            {priority !== 'all' && (
              <Badge variant="outline" className="ml-2">
                {nudges.filter(n => n.priority === priority && !n.dismissed).length}
              </Badge>
            )}
          </Button>
        ))}
      </div>

      {/* Nudges List */}
      <div className="space-y-4">
        {filteredNudges.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <CheckCircle className="h-12 w-12 text-success mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">All Caught Up!</h3>
              <p className="text-muted-foreground">
                No {filter === 'all' ? '' : filter + ' priority'} nudges at the moment. 
                Check back later for new AI insights.
              </p>
            </CardContent>
          </Card>
        ) : (
          filteredNudges.map((nudge) => (
            <Card key={nudge.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4 flex-1">
                    <div className="flex-shrink-0">
                      {getNudgeIcon(nudge.type)}
                    </div>
                    
                    <div className="flex-1 space-y-3">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-lg">{nudge.title}</h3>
                        <Badge variant={getPriorityColor(nudge.priority) as any}>
                          {nudge.priority} priority
                        </Badge>
                        <Badge variant="outline" className={getCategoryColor(nudge.category)}>
                          {nudge.category}
                        </Badge>
                      </div>
                      
                      <p className="text-muted-foreground">{nudge.description}</p>
                      
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2 text-sm">
                          <DollarSign className="h-4 w-4 text-success" />
                          <span className="font-medium text-success">{nudge.impact}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Calendar className="h-4 w-4" />
                          <span>{nudge.timestamp}</span>
                        </div>
                      </div>
                      
                      <div className="flex gap-2">
                        <Button
                          onClick={() => handleNudgeAction(nudge.id, nudge.action)}
                          className="bg-gradient-primary"
                        >
                          {nudge.action}
                          <ArrowRight className="h-4 w-4 ml-2" />
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() => dismissNudge(nudge.id)}
                        >
                          <X className="h-4 w-4 mr-2" />
                          Dismiss
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* AI Insights Footer */}
      <Card className="bg-gradient-card border-border/50">
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
              <Zap className="h-6 w-6 text-primary" />
            </div>
            <div className="flex-1">
              <h4 className="font-semibold">AI Analysis Complete</h4>
              <p className="text-sm text-muted-foreground">
                Your financial data has been analyzed using advanced AI algorithms. 
                New nudges are generated every hour based on your activity and market conditions.
              </p>
            </div>
            <Button variant="outline" size="sm">
              Learn More
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AINudges;
