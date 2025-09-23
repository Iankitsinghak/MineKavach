// src/app/onboarding/page.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { MineInformationForm } from '@/components/onboarding/mine-information-form';
import { DataAvailabilityForm } from '@/components/onboarding/data-availability-form';
import { MonitoringPreferencesForm } from '@/components/onboarding/monitoring-preferences-form';
import { ContactsForm } from '@/components/onboarding/contacts-form';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent } from '@/components/ui/card';

const totalSteps = 4;

export default function OnboardingPage() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({});
  const router = useRouter();

  const nextStep = () => setStep((prev) => (prev < totalSteps ? prev + 1 : prev));
  const prevStep = () => setStep((prev) => (prev > 1 ? prev - 1 : prev));

  const updateFormData = (data: any) => {
    const newFormData = { ...formData, ...data };
    setFormData(newFormData);
    if (step === totalSteps) {
        console.log("Onboarding complete:", newFormData);
        // Here you would typically send the data to your backend
        router.push('/dashboard');
    } else {
        nextStep();
    }
  };
  
  const renderStep = () => {
    switch (step) {
      case 1:
        return <MineInformationForm onSubmit={updateFormData} />;
      case 2:
        return <DataAvailabilityForm onSubmit={updateFormData} onBack={prevStep} />;
      case 3:
        return <MonitoringPreferencesForm onSubmit={updateFormData} onBack={prevStep} />;
      case 4:
        return <ContactsForm onSubmit={updateFormData} onBack={prevStep} />;
      default:
        return <MineInformationForm onSubmit={updateFormData} />;
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-4xl">
        <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold tracking-tight">Setup Your Mine</h1>
            <p className="text-muted-foreground">Follow the steps to configure your monitoring environment.</p>
        </div>
        <Progress value={(step / totalSteps) * 100} className="mb-8 h-2" />
        <Card>
            <CardContent className="p-6 md:p-8">
                {renderStep()}
            </CardContent>
        </Card>
      </div>
    </div>
  );
}