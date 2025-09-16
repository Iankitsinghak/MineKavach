'use client';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { generateActionPlans, GenerateActionPlansOutput } from '@/ai/flows/generate-action-plans-from-rockfall-prediction';
import { useToast } from "@/hooks/use-toast"
import { Loader2, ListChecks } from 'lucide-react';

const formSchema = z.object({
  rockfallProbability: z.number().min(0).max(1),
  rockfallScale: z.enum(['small', 'medium', 'large']),
  location: z.string().min(3, 'Location is required.'),
});

type FormValues = z.infer<typeof formSchema>;

export function ActionPlanGenerator() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<GenerateActionPlansOutput | null>(null);
  const { toast } = useToast()

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      rockfallProbability: 0.5,
      rockfallScale: 'medium',
      location: 'Bench 3, West Wall',
    },
  });

  async function onSubmit(values: FormValues) {
    setIsLoading(true);
    setResult(null);
    try {
      const input = {
        ...values,
        sensorData: 'Recent displacement spike noted.',
        environmentalFactors: 'Heavy rainfall in the last 24 hours.',
      };
      const response = await generateActionPlans(input);
      setResult(response);
    } catch (error) {
      console.error('Error generating action plan:', error);
       toast({
        variant: "destructive",
        title: "Error Generating Plan",
        description: "Could not generate an action plan. Please try again.",
      })
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>AI Action Plan Generator</CardTitle>
        <CardDescription>Generate mitigation strategies for potential rockfall events.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="rockfallProbability"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Probability ({field.value.toFixed(2)})</FormLabel>
                  <FormControl>
                    <Slider
                      min={0}
                      max={1}
                      step={0.01}
                      value={[field.value]}
                      onValueChange={(vals) => field.onChange(vals[0])}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="rockfallScale"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Estimated Scale</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select scale" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="small">Small</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="large">Large</SelectItem>
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Location</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Bench 3, West Wall" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={isLoading} className="w-full">
              {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <ListChecks className="mr-2 h-4 w-4" />}
              Generate Plan
            </Button>
          </form>
        </Form>
        {result && (
          <div className="mt-6 space-y-4">
            <div>
              <h4 className="font-semibold">Generated Action Plan (Risk: <span className="text-accent">{result.riskLevel}</span>)</h4>
              <p className="text-sm text-muted-foreground italic mt-1">&quot;{result.justification}&quot;</p>
            </div>
            <ul className="list-decimal list-inside space-y-2 text-sm bg-secondary p-4 rounded-lg">
              {result.actionPlans.map((plan, index) => (
                <li key={index}>{plan}</li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
