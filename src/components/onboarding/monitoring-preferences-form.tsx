// src/components/onboarding/monitoring-preferences-form.tsx
'use client';
import { Button } from '../ui/button';

interface MonitoringPreferencesFormProps {
    onSubmit: (data: any) => void;
    onBack: () => void;
}

export function MonitoringPreferencesForm({ onSubmit, onBack }: MonitoringPreferencesFormProps) {
    return (
        <div>
            <h2 className="text-xl font-bold">Step 3: Monitoring Preferences</h2>
            <p>Coming soon...</p>
            <div className="flex justify-between mt-4">
                <Button onClick={onBack} variant="outline">Back</Button>
                <Button onClick={() => onSubmit({})}>Next Step</Button>
            </div>
        </div>
    )
}
