import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, ArrowRight, Check, Upload, Target, Shield, User } from 'lucide-react';
import PersonalInfoStep from './steps/PersonalInfoStep';
import FinancialGoalsStep from './steps/FinancialGoalsStep';
import DocumentUploadStep from './steps/DocumentUploadStep';
import KYCStep from './steps/KYCStep';
import { useToast } from '@/hooks/use-toast';

interface OnboardingFlowProps {
  onComplete: () => void;
  onSkip: () => void;
}

const OnboardingFlow = ({ onComplete, onSkip }: OnboardingFlowProps) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [formData, setFormData] = useState<any>({});
  const { toast } = useToast();

  const steps = [
    {
      id: 'personal',
      title: 'Personal Information',
      description: 'Tell us about yourself',
      icon: User,
      component: PersonalInfoStep
    },
    {
      id: 'goals',
      title: 'Financial Goals',
      description: 'Set your financial objectives',
      icon: Target,
      component: FinancialGoalsStep
    },
    {
      id: 'documents',
      title: 'Document Upload',
      description: 'Upload your financial documents',
      icon: Upload,
      component: DocumentUploadStep
    },
    {
      id: 'kyc',
      title: 'KYC Verification',
      description: 'Complete your identity verification',
      icon: Shield,
      component: KYCStep
    }
  ];

  const progress = ((currentStep + 1) / steps.length) * 100;

  const handleNext = (stepData: any) => {
    setFormData(prev => ({ ...prev, ...stepData }));
    setCompletedSteps(prev => [...prev, currentStep]);
    
    if (currentStep < steps.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      handleComplete();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleComplete = async () => {
    try {
      // Save onboarding data to Supabase
      toast({
        title: "Onboarding Complete!",
        description: "Welcome to TaxWise AI. Let's optimize your finances!",
      });
      onComplete();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to complete onboarding. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleSkip = () => {
    toast({
      title: "Onboarding Skipped",
      description: "You can complete this later in your profile settings.",
    });
    onSkip();
  };

  const CurrentStepComponent = steps[currentStep].component;

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        {/* Progress Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold text-gradient-primary">Welcome to TaxWise AI</h1>
            <Button variant="ghost" onClick={handleSkip}>
              Skip for now
            </Button>
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>Step {currentStep + 1} of {steps.length}</span>
              <span>{Math.round(progress)}% Complete</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Steps Navigation */}
          <div className="lg:col-span-1">
            <Card className="sticky top-4">
              <CardHeader>
                <CardTitle className="text-lg">Setup Progress</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {steps.map((step, index) => {
                  const Icon = step.icon;
                  const isCompleted = completedSteps.includes(index);
                  const isCurrent = currentStep === index;
                  
                  return (
                    <div
                      key={step.id}
                      className={`flex items-center gap-3 p-3 rounded-lg transition-colors ${
                        isCurrent ? 'bg-primary/10 border border-primary/20' : ''
                      }`}
                    >
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        isCompleted ? 'bg-success text-success-foreground' :
                        isCurrent ? 'bg-primary text-primary-foreground' :
                        'bg-muted text-muted-foreground'
                      }`}>
                        {isCompleted ? <Check className="h-4 w-4" /> : <Icon className="h-4 w-4" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium">{step.title}</div>
                        <div className="text-xs text-muted-foreground">{step.description}</div>
                      </div>
                    </div>
                  );
                })}
              </CardContent>
            </Card>
          </div>

          {/* Current Step Content */}
          <div className="lg:col-span-3">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  {React.createElement(steps[currentStep].icon, { className: "h-5 w-5" })}
                  {steps[currentStep].title}
                </CardTitle>
                <CardDescription>
                  {steps[currentStep].description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <CurrentStepComponent
                  data={formData[steps[currentStep].id] || {}}
                  onNext={handleNext}
                  onPrevious={handlePrevious}
                  isFirstStep={currentStep === 0}
                  isLastStep={currentStep === steps.length - 1}
                />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OnboardingFlow;
