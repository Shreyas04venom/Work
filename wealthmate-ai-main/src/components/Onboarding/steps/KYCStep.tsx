import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, ArrowRight, Shield, Check, AlertTriangle, Camera, Upload } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface KYCStepProps {
  data: any;
  onNext: (data: any) => void;
  onPrevious: () => void;
  isFirstStep: boolean;
  isLastStep: boolean;
}

const KYCStep = ({ data, onNext, onPrevious }: KYCStepProps) => {
  const [kycData, setKycData] = useState({
    panNumber: data.panNumber || '',
    aadhaarNumber: data.aadhaarNumber || '',
    panImage: data.panImage || null,
    aadhaarFront: data.aadhaarFront || null,
    aadhaarBack: data.aadhaarBack || null,
    selfie: data.selfie || null,
    addressProof: data.addressProof || null,
    incomeProof: data.incomeProof || null,
  });

  const [verificationStatus, setVerificationStatus] = useState<Record<string, 'pending' | 'verified' | 'failed'>>({
    pan: 'pending',
    aadhaar: 'pending',
    selfie: 'pending',
    address: 'pending',
    income: 'pending'
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const { toast } = useToast();

  const handleInputChange = (field: string, value: string) => {
    setKycData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleFileUpload = (field: string, file: File) => {
    setKycData(prev => ({ ...prev, [field]: file }));
    
    // Simulate verification process
    setTimeout(() => {
      setVerificationStatus(prev => ({ ...prev, [field]: 'verified' }));
      toast({
        title: "Document Verified",
        description: `${field} has been verified successfully!`,
      });
    }, 2000);
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!kycData.panNumber.trim()) {
      newErrors.panNumber = 'PAN number is required';
    } else if (!/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(kycData.panNumber)) {
      newErrors.panNumber = 'Please enter a valid PAN number';
    }

    if (!kycData.aadhaarNumber.trim()) {
      newErrors.aadhaarNumber = 'Aadhaar number is required';
    } else if (!/^\d{12}$/.test(kycData.aadhaarNumber)) {
      newErrors.aadhaarNumber = 'Please enter a valid 12-digit Aadhaar number';
    }

    if (!kycData.panImage) {
      newErrors.panImage = 'PAN card image is required';
    }

    if (!kycData.aadhaarFront) {
      newErrors.aadhaarFront = 'Aadhaar front image is required';
    }

    if (!kycData.aadhaarBack) {
      newErrors.aadhaarBack = 'Aadhaar back image is required';
    }

    if (!kycData.selfie) {
      newErrors.selfie = 'Selfie is required for verification';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onNext({ kyc: kycData });
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'verified':
        return <Check className="h-4 w-4 text-success" />;
      case 'failed':
        return <AlertTriangle className="h-4 w-4 text-destructive" />;
      default:
        return <Shield className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'verified':
        return 'bg-success/10 text-success border-success/20';
      case 'failed':
        return 'bg-destructive/10 text-destructive border-destructive/20';
      default:
        return 'bg-muted/10 text-muted-foreground border-muted/20';
    }
  };

  const FileUploadCard = ({ 
    title, 
    description, 
    field, 
    required = false 
  }: { 
    title: string; 
    description: string; 
    field: string; 
    required?: boolean;
  }) => {
    const file = kycData[field as keyof typeof kycData] as File | null;
    const status = verificationStatus[field] || 'pending';

    return (
      <Card className={`${getStatusColor(status)}`}>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            {getStatusIcon(status)}
            {title}
            {required && <Badge variant="destructive">Required</Badge>}
          </CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent>
          {file ? (
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Check className="h-4 w-4 text-success" />
                <span className="text-sm font-medium">{file.name}</span>
              </div>
              <Badge className={getStatusColor(status)}>
                {status === 'verified' ? 'Verified' : status === 'failed' ? 'Failed' : 'Processing...'}
              </Badge>
            </div>
          ) : (
            <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
              <Camera className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
              <div className="text-sm font-medium mb-1">Upload {title}</div>
              <div className="text-xs text-muted-foreground mb-3">
                JPG, PNG up to 5MB
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => {
                  const input = document.createElement('input');
                  input.type = 'file';
                  input.accept = 'image/*';
                  input.onchange = (e) => {
                    const file = (e.target as HTMLInputElement).files?.[0];
                    if (file) handleFileUpload(field, file);
                  };
                  input.click();
                }}
              >
                <Upload className="h-4 w-4 mr-2" />
                Choose File
              </Button>
            </div>
          )}
          {errors[field] && (
            <p className="text-sm text-destructive mt-2">{errors[field]}</p>
          )}
        </CardContent>
      </Card>
    );
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-semibold mb-2">KYC Verification</h3>
          <p className="text-muted-foreground">
            Complete your identity verification to access all features and ensure secure transactions.
          </p>
        </div>

        {/* Personal Information */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Personal Information</CardTitle>
            <CardDescription>
              Enter your official identification details
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="panNumber">PAN Number *</Label>
                <Input
                  id="panNumber"
                  value={kycData.panNumber}
                  onChange={(e) => handleInputChange('panNumber', e.target.value.toUpperCase())}
                  placeholder="ABCDE1234F"
                  className={errors.panNumber ? 'border-destructive' : ''}
                />
                {errors.panNumber && <p className="text-sm text-destructive">{errors.panNumber}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="aadhaarNumber">Aadhaar Number *</Label>
                <Input
                  id="aadhaarNumber"
                  value={kycData.aadhaarNumber}
                  onChange={(e) => handleInputChange('aadhaarNumber', e.target.value.replace(/\D/g, ''))}
                  placeholder="123456789012"
                  maxLength={12}
                  className={errors.aadhaarNumber ? 'border-destructive' : ''}
                />
                {errors.aadhaarNumber && <p className="text-sm text-destructive">{errors.aadhaarNumber}</p>}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Document Upload */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FileUploadCard
            title="PAN Card"
            description="Upload clear image of your PAN card"
            field="panImage"
            required
          />

          <FileUploadCard
            title="Aadhaar Front"
            description="Upload front side of your Aadhaar card"
            field="aadhaarFront"
            required
          />

          <FileUploadCard
            title="Aadhaar Back"
            description="Upload back side of your Aadhaar card"
            field="aadhaarBack"
            required
          />

          <FileUploadCard
            title="Selfie"
            description="Take a clear selfie for verification"
            field="selfie"
            required
          />

          <FileUploadCard
            title="Address Proof"
            description="Upload utility bill or bank statement"
            field="addressProof"
          />

          <FileUploadCard
            title="Income Proof"
            description="Upload salary slip or Form 16"
            field="incomeProof"
          />
        </div>

        {/* Security Notice */}
        <Card className="bg-primary/5 border-primary/20">
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <Shield className="h-5 w-5 text-primary mt-0.5" />
              <div>
                <h4 className="font-medium text-primary">Security & Privacy</h4>
                <p className="text-sm text-muted-foreground mt-1">
                  Your documents are encrypted and stored securely. We use bank-grade security 
                  to protect your personal information and comply with all data protection regulations.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
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
        >
          Complete Setup
          <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    </form>
  );
};

export default KYCStep;
