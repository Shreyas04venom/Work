import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, ArrowRight, Plus, Trash2, Target, Home, GraduationCap, PiggyBank } from 'lucide-react';

interface FinancialGoalsStepProps {
  data: any;
  onNext: (data: any) => void;
  onPrevious: () => void;
  isFirstStep: boolean;
  isLastStep: boolean;
}

interface FinancialGoal {
  id: string;
  type: string;
  name: string;
  targetAmount: string;
  currentAmount: string;
  targetDate: string;
  priority: 'low' | 'medium' | 'high';
}

const FinancialGoalsStep = ({ data, onNext, onPrevious }: FinancialGoalsStepProps) => {
  const [goals, setGoals] = useState<FinancialGoal[]>(
    data.goals || [
      {
        id: '1',
        type: 'emergency_fund',
        name: 'Emergency Fund',
        targetAmount: '500000',
        currentAmount: '0',
        targetDate: '',
        priority: 'high'
      }
    ]
  );

  const goalTypes = [
    { id: 'emergency_fund', name: 'Emergency Fund', icon: PiggyBank, description: '6 months of expenses' },
    { id: 'home_purchase', name: 'Home Purchase', icon: Home, description: 'Down payment for house' },
    { id: 'retirement', name: 'Retirement Fund', icon: Target, description: 'Long-term retirement savings' },
    { id: 'education', name: 'Education Fund', icon: GraduationCap, description: 'Children\'s education' },
    { id: 'other', name: 'Other Goal', icon: Target, description: 'Custom financial goal' }
  ];

  const addGoal = () => {
    const newGoal: FinancialGoal = {
      id: Date.now().toString(),
      type: 'other',
      name: '',
      targetAmount: '',
      currentAmount: '0',
      targetDate: '',
      priority: 'medium'
    };
    setGoals([...goals, newGoal]);
  };

  const removeGoal = (id: string) => {
    setGoals(goals.filter(goal => goal.id !== id));
  };

  const updateGoal = (id: string, field: keyof FinancialGoal, value: string) => {
    setGoals(goals.map(goal => 
      goal.id === id ? { ...goal, [field]: value } : goal
    ));
  };

  const getGoalTypeInfo = (type: string) => {
    return goalTypes.find(gt => gt.id === type) || goalTypes[0];
  };

  const validateGoals = () => {
    return goals.every(goal => 
      goal.name.trim() && 
      goal.targetAmount && 
      parseFloat(goal.targetAmount) > 0 &&
      goal.targetDate
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateGoals()) {
      onNext({ goals: goals.filter(goal => goal.name.trim()) });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-semibold mb-2">Set Your Financial Goals</h3>
          <p className="text-muted-foreground">
            Define your financial objectives to get personalized recommendations and track your progress.
          </p>
        </div>

        {goals.map((goal, index) => {
          const goalTypeInfo = getGoalTypeInfo(goal.type);
          const Icon = goalTypeInfo.icon;

          return (
            <Card key={goal.id} className="p-4">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                    <Icon className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-medium">{goalTypeInfo.name}</h4>
                    <p className="text-sm text-muted-foreground">{goalTypeInfo.description}</p>
                  </div>
                </div>
                {goals.length > 1 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeGoal(goal.id)}
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor={`goal-name-${goal.id}`}>Goal Name</Label>
                  <Input
                    id={`goal-name-${goal.id}`}
                    value={goal.name}
                    onChange={(e) => updateGoal(goal.id, 'name', e.target.value)}
                    placeholder="Enter goal name"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor={`goal-type-${goal.id}`}>Goal Type</Label>
                  <select
                    id={`goal-type-${goal.id}`}
                    value={goal.type}
                    onChange={(e) => updateGoal(goal.id, 'type', e.target.value)}
                    className="w-full h-10 px-3 py-2 border border-input bg-background rounded-md text-sm"
                  >
                    {goalTypes.map(type => (
                      <option key={type.id} value={type.id}>
                        {type.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor={`target-amount-${goal.id}`}>Target Amount (₹)</Label>
                  <Input
                    id={`target-amount-${goal.id}`}
                    type="number"
                    value={goal.targetAmount}
                    onChange={(e) => updateGoal(goal.id, 'targetAmount', e.target.value)}
                    placeholder="Enter target amount"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor={`current-amount-${goal.id}`}>Current Amount (₹)</Label>
                  <Input
                    id={`current-amount-${goal.id}`}
                    type="number"
                    value={goal.currentAmount}
                    onChange={(e) => updateGoal(goal.id, 'currentAmount', e.target.value)}
                    placeholder="Enter current amount"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor={`target-date-${goal.id}`}>Target Date</Label>
                  <Input
                    id={`target-date-${goal.id}`}
                    type="date"
                    value={goal.targetDate}
                    onChange={(e) => updateGoal(goal.id, 'targetDate', e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor={`priority-${goal.id}`}>Priority</Label>
                  <select
                    id={`priority-${goal.id}`}
                    value={goal.priority}
                    onChange={(e) => updateGoal(goal.id, 'priority', e.target.value)}
                    className="w-full h-10 px-3 py-2 border border-input bg-background rounded-md text-sm"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
              </div>

              <div className="mt-4">
                <Badge 
                  variant={goal.priority === 'high' ? 'destructive' : goal.priority === 'medium' ? 'default' : 'secondary'}
                >
                  {goal.priority} Priority
                </Badge>
              </div>
            </Card>
          );
        })}

        <Button
          type="button"
          variant="outline"
          onClick={addGoal}
          className="w-full border-dashed"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Another Goal
        </Button>
      </div>

      <div className="flex justify-between pt-6">
        <Button
          type="button"
          variant="outline"
          onClick={onPrevious}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Previous
        </Button>

        <Button 
          type="submit" 
          className="flex items-center gap-2"
          disabled={!validateGoals()}
        >
          Next
          <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    </form>
  );
};

export default FinancialGoalsStep;
