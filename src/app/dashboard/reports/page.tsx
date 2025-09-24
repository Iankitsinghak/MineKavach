// src/app/dashboard/reports/page.tsx
'use client';
import { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { mockAlerts, mockSensorData } from '@/lib/data';
import type { Alert } from '@/lib/types';
import {
  generateActionPlans,
  GenerateActionPlansOutput,
} from '@/ai/flows/generate-action-plans-from-rockfall-prediction';
import { useToast } from '@/hooks/use-toast';
import { Loader2, ListChecks } from 'lucide-react';
import { summarizeSensorDataForRiskAssessment } from '@/ai/flows/summarize-sensor-data-for-risk-assessment';

export default function ReportsPage() {
  const [alerts, setAlerts] = useState<Alert[]>(mockAlerts);
  const [selectedAlert, setSelectedAlert] = useState<Alert | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [actionPlan, setActionPlan] = useState<GenerateActionPlansOutput | null>(
    null
  );
  const { toast } = useToast();

  const severityMap: { [key: string]: string } = {
    Low: 'default',
    Medium: 'secondary',
    High: 'destructive',
  };
  
  const probabilityMap = {
    'Low': 0.2,
    'Medium': 0.5,
    'High': 0.8
  }

  const handleResolveClick = async (alert: Alert) => {
    setSelectedAlert(alert);
    setActionPlan(null);
    setIsGenerating(true);

    try {
      // Create summaries for the AI flow
      const sensorDataSummary = await summarizeSensorDataForRiskAssessment({
        sensorData: JSON.stringify(mockSensorData.slice(-5)), // last 5 readings
        environmentalFactors: "Recent heavy rainfall"
      });

      const input = {
        rockfallProbability: probabilityMap[alert.severity] || 0.5,
        rockfallScale: alert.severity.toLowerCase() as 'low' | 'medium' | 'high',
        location: alert.location,
        sensorData: sensorDataSummary.summary,
        environmentalFactors: "Heavy rainfall in the last 24 hours. No significant seismic activity.",
      };

      const plan = await generateActionPlans(input);
      setActionPlan(plan);
    } catch (error) {
      console.error('Error generating action plan:', error);
      toast({
        variant: 'destructive',
        title: 'Generation Failed',
        description:
          'Could not generate an action plan. Please try again later.',
      });
      setSelectedAlert(null); // Close dialog on error
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <>
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Alerts & Reports</CardTitle>
            <CardDescription>
              View all historical alerts and generate remediation plans.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Severity</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Timestamp</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {alerts.map((alert) => (
                  <TableRow key={alert.id}>
                    <TableCell>
                      <Badge variant={severityMap[alert.severity] as any}>
                        {alert.severity}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-medium">{alert.location}</TableCell>
                    <TableCell>{alert.description}</TableCell>
                    <TableCell className="text-muted-foreground">
                      {alert.timestamp}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleResolveClick(alert)}
                      >
                        Resolve
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      <Dialog
        open={!!selectedAlert}
        onOpenChange={(isOpen) => !isOpen && setSelectedAlert(null)}
      >
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>AI-Generated Action Plan</DialogTitle>
            <DialogDescription>
              For alert at {selectedAlert?.location} ({selectedAlert?.severity}{' '}
              Severity)
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            {isGenerating && (
              <div className="flex items-center justify-center space-x-2">
                <Loader2 className="h-6 w-6 animate-spin" />
                <span className="text-muted-foreground">
                  Generating plan...
                </span>
              </div>
            )}
            {actionPlan && (
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold">
                    Generated Action Plan (Risk:{' '}
                    <span className="text-accent">{actionPlan.riskLevel}</span>)
                  </h4>
                  <p className="text-sm text-muted-foreground italic mt-1">
                    &quot;{actionPlan.justification}&quot;
                  </p>
                </div>
                <ul className="list-decimal list-inside space-y-2 text-sm bg-secondary p-4 rounded-lg">
                  {actionPlan.actionPlans.map((plan, index) => (
                    <li key={index}>{plan}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
