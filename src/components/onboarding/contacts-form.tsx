// src/components/onboarding/contacts-form.tsx
'use client';
import { Button } from '../ui/button';

interface ContactsFormProps {
    onSubmit: (data: any) => void;
    onBack: () => void;
}

export function ContactsForm({ onSubmit, onBack }: ContactsFormProps) {
    return (
        <div>
            <h2 className="text-xl font-bold">Step 4: Contacts</h2>
            <p>Coming soon...</p>
            <div className="flex justify-between mt-4">
                <Button onClick={onBack} variant="outline">Back</Button>
                <Button onClick={() => onSubmit({})}>Finish</Button>
            </div>
        </div>
    )
}
