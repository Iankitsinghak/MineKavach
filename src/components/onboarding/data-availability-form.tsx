// src/components/onboarding/data-availability-form.tsx
'use client';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '../ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { Checkbox } from '@/components/ui/checkbox';
import { CardHeader, CardTitle, CardDescription } from '../ui/card';
import { ArrowLeft, ArrowRight } from 'lucide-react';

const sensors = [
  { id: 'vibration', label: 'Vibration Sensor' },
  { id: 'tilt', label: 'Tilt Sensor' },
  { id: 'strain', label: 'Strain Sensor' },
  { id: 'pore_pressure', label: 'Pore Pressure Sensor' },
  { id: 'temperature', label: 'Temperature Sensor' },
  { id: 'humidity', label: 'Humidity Sensor' },
] as const;

const formSchema = z.object({
  sensors: z.array(z.string()).refine((value) => value.some((item) => item), {
    message: 'You have to select at least one item.',
  }),
});

type FormValues = z.infer<typeof formSchema>;


interface DataAvailabilityFormProps {
    onSubmit: (data: any) => void;
    onBack: () => void;
}

export function DataAvailabilityForm({ onSubmit, onBack }: DataAvailabilityFormProps) {
    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            sensors: [],
        },
    });

    const processSubmit = (data: FormValues) => {
        const selectedSensors = data.sensors.reduce((acc, sensorId) => {
            return { ...acc, [sensorId]: true };
        }, {});
        onSubmit({ dataSources: selectedSensors });
    }

    return (
         <>
            <CardHeader className="p-0 pb-6">
                <CardTitle>Step 2: Data Availability</CardTitle>
                <CardDescription>Let us know which data sources you have available.</CardDescription>
            </CardHeader>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(processSubmit)} className="space-y-8">
                     <FormField
                        control={form.control}
                        name="sensors"
                        render={() => (
                            <FormItem>
                            <div className="mb-4">
                                <FormLabel className="text-base">Available Sensors</FormLabel>
                            </div>
                             <div className="grid grid-cols-2 gap-4">
                                {sensors.map((item) => (
                                <FormField
                                    key={item.id}
                                    control={form.control}
                                    name="sensors"
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
                    <div className="flex justify-between mt-8">
                        <Button onClick={onBack} variant="outline">
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
