// src/components/onboarding/monitoring-preferences-form.tsx
'use client';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '../ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormDescription } from '@/components/ui/form';
import { Switch } from '@/components/ui/switch';
import { Checkbox } from '@/components/ui/checkbox';
import { CardHeader, CardTitle, CardDescription } from '../ui/card';
import { ArrowLeft, ArrowRight } from 'lucide-react';

const alertMethods = [
    { id: 'sms', label: 'SMS' },
    { id: 'email', label: 'Email' },
] as const;

const formSchema = z.object({
  riskMaps: z.boolean().default(true),
  liveAlerts: z.boolean().default(true),
  alertMethods: z.array(z.string()).refine((value) => value.some((item) => item), {
    message: 'You have to select at least one alert method.',
  }),
  automaticSiren: z.boolean().default(false),
});

type FormValues = z.infer<typeof formSchema>;

interface MonitoringPreferencesFormProps {
    onSubmit: (data: any) => void;
    onBack: () => void;
}

export function MonitoringPreferencesForm({ onSubmit, onBack }: MonitoringPreferencesFormProps) {
    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            riskMaps: true,
            liveAlerts: true,
            alertMethods: ['email'],
            automaticSiren: false,
        },
    });

    const processSubmit = (data: FormValues) => {
        onSubmit({ monitoringPreferences: data });
    }

    return (
        <>
            <CardHeader className="p-0 pb-6">
                <CardTitle>Step 3: Monitoring Preferences</CardTitle>
                <CardDescription>Customize how you want to monitor your operation and receive alerts.</CardDescription>
            </CardHeader>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(processSubmit)} className="space-y-8">
                    <FormField
                        control={form.control}
                        name="riskMaps"
                        render={({ field }) => (
                            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                                <div className="space-y-0.5">
                                    <FormLabel className="text-base">Risk Maps</FormLabel>
                                    <FormDescription>
                                        Enable real-time risk map generation.
                                    </FormDescription>
                                </div>
                                <FormControl>
                                    <Switch
                                        checked={field.value}
                                        onCheckedChange={field.onChange}
                                    />
                                </FormControl>
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="liveAlerts"
                        render={({ field }) => (
                            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                                <div className="space-y-0.5">
                                    <FormLabel className="text-base">Live Alerts</FormLabel>
                                    <FormDescription>
                                        Receive live alerts on the dashboard.
                                    </FormDescription>
                                </div>
                                <FormControl>
                                    <Switch
                                        checked={field.value}
                                        onCheckedChange={field.onChange}
                                    />
                                </FormControl>
                            </FormItem>
                        )}
                    />
                     <FormField
                        control={form.control}
                        name="alertMethods"
                        render={() => (
                            <FormItem className="rounded-lg border p-4">
                            <div className="mb-4">
                                <FormLabel className="text-base">Send Alerts On</FormLabel>
                                <FormDescription>
                                    Select how you want to be notified of critical alerts.
                                </FormDescription>
                            </div>
                             <div className="flex items-center space-x-6">
                                {alertMethods.map((item) => (
                                <FormField
                                    key={item.id}
                                    control={form.control}
                                    name="alertMethods"
                                    render={({ field }) => {
                                    return (
                                        <FormItem
                                            key={item.id}
                                            className="flex flex-row items-start space-x-3 space-y-0"
                                        >
                                            <FormControl>
                                                <Checkbox
                                                checked={field.value?.includes(item.id)}
                                                onCheckedChange={(checked) => {
                                                    return checked
                                                    ? field.onChange([...field.value, item.id])
                                                    : field.onChange(
                                                        field.value?.filter(
                                                        (value) => value !== item.id
                                                        )
                                                    )
                                                }}
                                                />
                                            </FormControl>
                                            <FormLabel className="font-normal">
                                                {item.label}
                                            </FormLabel>
                                        </FormItem>
                                    )
                                    }}
                                />
                                ))}
                            </div>
                            </FormItem>
                        )}
                        />
                    <FormField
                        control={form.control}
                        name="automaticSiren"
                        render={({ field }) => (
                            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                                <div className="space-y-0.5">
                                    <FormLabel className="text-base">Automatic Siren</FormLabel>
                                    <FormDescription>
                                        Ring the site siren if a critical alert is unread for 90 seconds.
                                    </FormDescription>
                                </div>
                                <FormControl>
                                    <Switch
                                        checked={field.value}
                                        onCheckedChange={field.onChange}
                                    />
                                </FormControl>
                            </FormItem>
                        )}
                    />
                    <div className="flex justify-between mt-8">
                        <Button onClick={onBack} variant="outline" type="button">
                            <ArrowLeft className="mr-2"/>
                            Back
                        </Button>
                        <Button type="submit">
                            Next Step
                            <ArrowRight className="ml-2"/>
                        </Button>
                    </div>
                </form>
            </Form>
        </>
    )
}
