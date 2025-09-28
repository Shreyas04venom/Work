import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowLeft, ArrowRight } from 'lucide-react';

interface PersonalInfoStepProps {
  data: any;
  onNext: (data: any) => void;
  onPrevious: () => void;
  isFirstStep: boolean;
  isLastStep: boolean;
}

const PersonalInfoStep = ({ data, onNext, onPrevious, isFirstStep }: PersonalInfoStepProps) => {
  const [formData, setFormData] = useState({
    fullName: data.fullName || '',
    email: data.email || '',
    phone: data.phone || '',
    dateOfBirth: data.dateOfBirth || '',
    occupation: data.occupation || '',
    annualIncome: data.annualIncome || '',
    address: data.address || '',
    city: data.city || '',
    state: data.state || '',
    pincode: data.pincode || '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^\d{10}$/.test(formData.phone.replace(/\D/g, ''))) {
      newErrors.phone = 'Please enter a valid 10-digit phone number';
    }

    if (!formData.dateOfBirth) {
      newErrors.dateOfBirth = 'Date of birth is required';
    }

    if (!formData.occupation.trim()) {
      newErrors.occupation = 'Occupation is required';
    }

    if (!formData.annualIncome) {
      newErrors.annualIncome = 'Annual income is required';
    }

    if (!formData.address.trim()) {
      newErrors.address = 'Address is required';
    }

    if (!formData.city.trim()) {
      newErrors.city = 'City is required';
    }

    if (!formData.state.trim()) {
      newErrors.state = 'State is required';
    }

    if (!formData.pincode.trim()) {
      newErrors.pincode = 'Pincode is required';
    } else if (!/^\d{6}$/.test(formData.pincode)) {
      newErrors.pincode = 'Please enter a valid 6-digit pincode';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onNext({ personal: formData });
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="fullName">Full Name *</Label>
          <Input
            id="fullName"
            value={formData.fullName}
            onChange={(e) => handleInputChange('fullName', e.target.value)}
            placeholder="Enter your full name"
            className={errors.fullName ? 'border-destructive' : ''}
          />
          {errors.fullName && <p className="text-sm text-destructive">{errors.fullName}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email Address *</Label>
          <Input
            id="email"
            type="email"
            value={formData.email}
            onChange={(e) => handleInputChange('email', e.target.value)}
            placeholder="Enter your email"
            className={errors.email ? 'border-destructive' : ''}
          />
          {errors.email && <p className="text-sm text-destructive">{errors.email}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone">Phone Number *</Label>
          <Input
            id="phone"
            type="tel"
            value={formData.phone}
            onChange={(e) => handleInputChange('phone', e.target.value)}
            placeholder="Enter your phone number"
            className={errors.phone ? 'border-destructive' : ''}
          />
          {errors.phone && <p className="text-sm text-destructive">{errors.phone}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="dateOfBirth">Date of Birth *</Label>
          <Input
            id="dateOfBirth"
            type="date"
            value={formData.dateOfBirth}
            onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
            className={errors.dateOfBirth ? 'border-destructive' : ''}
          />
          {errors.dateOfBirth && <p className="text-sm text-destructive">{errors.dateOfBirth}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="occupation">Occupation *</Label>
          <Select value={formData.occupation} onValueChange={(value) => handleInputChange('occupation', value)}>
            <SelectTrigger className={errors.occupation ? 'border-destructive' : ''}>
              <SelectValue placeholder="Select your occupation" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="salaried">Salaried Employee</SelectItem>
              <SelectItem value="business">Business Owner</SelectItem>
              <SelectItem value="freelancer">Freelancer</SelectItem>
              <SelectItem value="professional">Professional (CA, Doctor, etc.)</SelectItem>
              <SelectItem value="retired">Retired</SelectItem>
              <SelectItem value="student">Student</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
          {errors.occupation && <p className="text-sm text-destructive">{errors.occupation}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="annualIncome">Annual Income *</Label>
          <Select value={formData.annualIncome} onValueChange={(value) => handleInputChange('annualIncome', value)}>
            <SelectTrigger className={errors.annualIncome ? 'border-destructive' : ''}>
              <SelectValue placeholder="Select your annual income range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="0-250000">₹0 - ₹2.5 Lakhs</SelectItem>
              <SelectItem value="250000-500000">₹2.5 - ₹5 Lakhs</SelectItem>
              <SelectItem value="500000-1000000">₹5 - ₹10 Lakhs</SelectItem>
              <SelectItem value="1000000-1500000">₹10 - ₹15 Lakhs</SelectItem>
              <SelectItem value="1500000-2500000">₹15 - ₹25 Lakhs</SelectItem>
              <SelectItem value="2500000-5000000">₹25 - ₹50 Lakhs</SelectItem>
              <SelectItem value="5000000+">₹50 Lakhs+</SelectItem>
            </SelectContent>
          </Select>
          {errors.annualIncome && <p className="text-sm text-destructive">{errors.annualIncome}</p>}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="address">Address *</Label>
        <Textarea
          id="address"
          value={formData.address}
          onChange={(e) => handleInputChange('address', e.target.value)}
          placeholder="Enter your complete address"
          className={errors.address ? 'border-destructive' : ''}
        />
        {errors.address && <p className="text-sm text-destructive">{errors.address}</p>}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="city">City *</Label>
          <Input
            id="city"
            value={formData.city}
            onChange={(e) => handleInputChange('city', e.target.value)}
            placeholder="Enter your city"
            className={errors.city ? 'border-destructive' : ''}
          />
          {errors.city && <p className="text-sm text-destructive">{errors.city}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="state">State *</Label>
          <Input
            id="state"
            value={formData.state}
            onChange={(e) => handleInputChange('state', e.target.value)}
            placeholder="Enter your state"
            className={errors.state ? 'border-destructive' : ''}
          />
          {errors.state && <p className="text-sm text-destructive">{errors.state}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="pincode">Pincode *</Label>
          <Input
            id="pincode"
            value={formData.pincode}
            onChange={(e) => handleInputChange('pincode', e.target.value)}
            placeholder="Enter pincode"
            className={errors.pincode ? 'border-destructive' : ''}
          />
          {errors.pincode && <p className="text-sm text-destructive">{errors.pincode}</p>}
        </div>
      </div>

      <div className="flex justify-between pt-6">
        <Button
          type="button"
          variant="outline"
          onClick={onPrevious}
          disabled={isFirstStep}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Previous
        </Button>

        <Button type="submit" className="flex items-center gap-2">
          Next
          <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    </form>
  );
};

export default PersonalInfoStep;
