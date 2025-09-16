// src/components/onboarding/data-availability-form.tsx
'use client';
import { Button } from '../ui/button';

interface DataAvailabilityFormProps {
    onSubmit: (data: any) => void;
    onBack: () => void;
}

export function DataAvailabilityForm({ onSubmit, onBack }: DataAvailabilityFormProps) {
    return (
        <div>
            <h2 className="text-xl font-bold">Step 2: Data Availability</h2>
            <p>Coming soon...</p>
            <div className="flex justify-between mt-4">
                <Button onClick={onBack} variant="outline">Back</Button>
                <Button onClick={() => onSubmit({})}>Next Step</Button>
            </div>
        </div>
    )
}
