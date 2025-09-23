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
import { getAddressFromCoordinates } from '@/ai/tools/geocoding-tool';
import { getNearbyMines } from '@/ai/tools/nearby-mines-tool';

const formSchema = z.object({
  mineName: z.string().min(2, { message: 'Mine name must be at least 2 characters.' }),
  location: z.string().min(5, { message: 'Please enter a valid location or address.' }),
  pinCode: z.string().min(5, { message: 'Please enter a valid pin code.' }),
  mineType: z.enum(['iron_ore', 'coal', 'gold', 'copper', 'diamond', 'other']),
  mineSize: z.string().min(2, { message: 'Please provide the mine size.' }),
  customMineName: z.string().optional(),
}).superRefine((data, ctx) => {
    if (data.mineName === 'other' && (!data.customMineName || data.customMineName.length < 2)) {
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Mine name must be at least 2 characters.",
            path: ['customMineName'],
        });
    }
});


type FormValues = z.infer<typeof formSchema>;

interface MineInformationFormProps {
  onSubmit: (data: any) => void;
}

export function MineInformationForm({ onSubmit }: MineInformationFormProps) {
  const [isLocating, setIsLocating] = useState(false);
  const [isFetchingMines, setIsFetchingMines] = useState(false);
  const [nearbyMines, setNearbyMines] = useState<{id: string; name: string}[]>([]);
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      mineName: '',
      location: '',
      pinCode: '',
      mineSize: '',
    },
  });

  const watchMineName = form.watch('mineName');

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
    setIsFetchingMines(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        const coords = `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`;
        form.setValue('location', coords, { shouldValidate: true });
        
        try {
            const address = await getAddressFromCoordinates({ latitude, longitude });
            form.setValue('pinCode', address.pinCode, { shouldValidate: true });
             toast({
                title: 'Location Found',
                description: `Set to: ${coords}. Pin code found: ${address.pinCode}.`,
            });
        } catch (error) {
             toast({
                variant: 'destructive',
                title: 'Could not fetch Pin Code',
                description: 'Please enter pin code manually.',
            });
        } finally {
            setIsLocating(false);
        }

        try {
            const result = await getNearbyMines({ latitude, longitude });
            if (result.mines.length > 0) {
                 setNearbyMines(result.mines);
                 toast({
                    title: 'Nearby Mines Found',
                    description: `Found ${result.mines.length} mines in your area.`,
                });
            } else {
                 toast({
                    title: 'No Nearby Mines Found',
                    description: 'You can enter a mine name manually.',
                });
                setNearbyMines([]);
            }
        } catch (error) {
             toast({
                variant: 'destructive',
                title: 'Could Not Fetch Nearby Mines',
                description: 'Please enter the mine name manually.',
            });
             setNearbyMines([]);
        } finally {
            setIsFetchingMines(false);
        }
      },
      (error) => {
        setIsLocating(false);
        setIsFetchingMines(false);
        toast({
          variant: 'destructive',
          title: 'Geolocation Error',
          description: 'Could not retrieve your location. Please enter it manually.',
        });
        console.error('Geolocation Error:', error);
      }
    );
  };
  
  const processSubmit = (data: FormValues) => {
    const finalData = { ...data };
    if (data.mineName === 'other') {
      finalData.mineName = data.customMineName!;
    }
    delete finalData.customMineName;
    onSubmit(finalData);
  }

  return (
    <>
        <CardHeader className="p-0 pb-6">
            <CardTitle>Step 1: Mine Information</CardTitle>
            <CardDescription>Start by telling us about your mining operation.</CardDescription>
        </CardHeader>
        <Form {...form}>
        <form onSubmit={form.handleSubmit(processSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                                disabled={isLocating || isFetchingMines}
                                aria-label="Auto-locate"
                            >
                                {isLocating || isFetchingMines ? <Loader2 className="animate-spin" /> : <MapPin />}
                            </Button>
                        </div>
                        <FormMessage />
                        </FormItem>
                    )}
                />
                 <FormField
                    control={form.control}
                    name="pinCode"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Pin Code</FormLabel>
                        <FormControl>
                            <Input placeholder="e.g. 90210" {...field} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                />
            </div>
            
            { isFetchingMines && <div className="flex items-center gap-2 text-sm text-muted-foreground"><Loader2 className="animate-spin h-4 w-4" /> Finding nearby mines...</div> }

            { (nearbyMines.length > 0 && !isFetchingMines) && (
                <>
                    <FormField
                    control={form.control}
                    name="mineName"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Mine Name</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                            <SelectTrigger>
                                <SelectValue placeholder="Select a nearby mine" />
                            </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                                {nearbyMines.map(mine => (
                                    <SelectItem key={mine.id} value={mine.name}>{mine.name}</SelectItem>
                                ))}
                                <SelectItem value="other">Other (please specify)</SelectItem>
                            </SelectContent>
                        </Select>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                    { watchMineName === 'other' && (
                        <FormField
                            control={form.control}
                            name="customMineName"
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel>Custom Mine Name</FormLabel>
                                <FormControl>
                                    <Input placeholder="e.g., North Star Quarry" {...field} />
                                </FormControl>
                                <FormMessage />
                                </FormItem>
                            )}
                        />
                    )}
                </>
            )}

            { nearbyMines.length === 0 && !isFetchingMines && (
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
            )}
            
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
