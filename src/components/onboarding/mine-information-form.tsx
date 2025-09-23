// src/components/onboarding/mine-information-form.tsx
'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CardHeader, CardTitle, CardDescription } from '../ui/card';
import { ArrowRight, MapPin, Loader2 } from 'lucide-react';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';

const formSchema = z.object({
  mineName: z.string().min(2, { message: 'Mine name must be at least 2 characters.' }),
  location: z.string().min(5, { message: 'Please enter a valid location or address.' }),
  mineType: z.enum(['iron_ore', 'coal', 'gold', 'copper', 'diamond', 'other']),
  mineSize: z.string().min(2, { message: 'Please provide the mine size.' }),
});

type FormValues = z.infer<typeof formSchema>;

interface MineInformationFormProps {
  onSubmit: (data: FormValues) => void;
}

export function MineInformationForm({ onSubmit }: MineInformationFormProps) {
  const [isLocating, setIsLocating] = useState(false);
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      mineName: '',
      location: '',
      mineSize: '',
    },
  });

  const handleAutoLocate = () => {
    if (!navigator.geolocation) {
      toast({
        variant: 'destructive',
        title: 'Geolocation Not Supported',
        description: 'Your browser does not support geolocation.',
      });
      return;
    }

    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        const coords = `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`;
        form.setValue('location', coords, { shouldValidate: true });
        setIsLocating(false);
        toast({
            title: 'Location Found',
            description: `Set to: ${coords}`,
        });
      },
      (error) => {
        setIsLocating(false);
        toast({
          variant: 'destructive',
          title: 'Geolocation Error',
          description: 'Could not retrieve your location. Please enter it manually.',
        });
        console.error('Geolocation Error:', error);
      }
    );
  };

  return (
    <>
        <CardHeader className="p-0 pb-6">
            <CardTitle>Step 1: Mine Information</CardTitle>
            <CardDescription>Start by telling us about your mining operation.</CardDescription>
        </CardHeader>
        <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
            control={form.control}
            name="mineName"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Mine Name</FormLabel>
                <FormControl>
                    <Input placeholder="e.g., North Star Quarry" {...field} />
                </FormControl>
                <FormMessage />
                </FormItem>
            )}
            />
            <FormField
            control={form.control}
            name="location"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Location</FormLabel>
                 <div className="relative">
                    <FormControl>
                        <Input placeholder="GPS coordinates or full address" {...field} />
                    </FormControl>
                    <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8"
                        onClick={handleAutoLocate}
                        disabled={isLocating}
                        aria-label="Auto-locate"
                    >
                        {isLocating ? <Loader2 className="animate-spin" /> : <MapPin />}
                    </Button>
                </div>
                <FormMessage />
                </FormItem>
            )}
            />
             <FormField
              control={form.control}
              name="mineType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mine Type</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select mine type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="iron_ore">Iron Ore</SelectItem>
                      <SelectItem value="coal">Coal</SelectItem>
                      <SelectItem value="gold">Gold</SelectItem>
                      <SelectItem value="copper">Copper</SelectItem>
                      <SelectItem value="diamond">Diamond</SelectItem>
                       <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
            control={form.control}
            name="mineSize"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Mine Size (Area or Depth)</FormLabel>
                <FormControl>
                    <Input placeholder="e.g., 500 hectares or 300m depth" {...field} />
                </FormControl>
                <FormMessage />
                </FormItem>
            )}
            />
            <div className="flex justify-end">
                <Button type="submit">
                    Next Step
                    <ArrowRight className="ml-2"/>
                </Button>
            </div>
        </form>
        </Form>
    </>
  );
}
