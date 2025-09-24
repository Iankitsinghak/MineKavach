// src/app/dashboard/alerts/page.tsx
'use client';

import { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { ListFilter, Sparkles, Loader2 } from 'lucide-react';
import { mockAlerts, mockSensorData } from '@/lib/data';
import type { Alert } from '@/lib/types';
import { analyzeCurrentRiskFromSensors, AnalyzedRisk } from '@/ai/flows/analyze-current-risk-from-sensors';
import { useToast } from '@/hooks/use-toast';


export default function AlertsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [severityFilter, setSeverityFilter] = useState('all');
  const [alerts, setAlerts] = useState<Alert[]>(mockAlerts);
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();

  const handleGenerateRisks = async () => {
    setIsGenerating(true);
    try {
      const result = await analyzeCurrentRiskFromSensors({
        sensorData: JSON.stringify(mockSensorData.slice(-10)), // Last 10 readings
        environmentalFactors: 'Recent heavy rainfall over the past 48 hours, with temperatures fluctuating around freezing point at night.',
      });

      const newAlerts: Alert[] = result.risks.map((risk: AnalyzedRisk, index: number) => ({
        id: `AI-ALERT-${Date.now()}-${index}`,
        timestamp: new Date().toISOString().slice(0, 16).replace('T', ' '),
        location: risk.location,
        severity: risk.severity as 'Low' | 'Medium' | 'High',
        description: risk.description,
      }));

      setAlerts(newAlerts);
      toast({
        title: 'Analysis Complete',
        description: `Generated ${newAlerts.length} new risk alerts.`,
      });

    } catch (error) {
      console.error("Failed to generate risk analysis:", error);
      toast({
        variant: 'destructive',
        title: 'Analysis Failed',
        description: 'Could not generate risk analysis. Please try again.',
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const filteredAlerts = useMemo(() => {
    return alerts.filter((alert) => {
      const matchesSeverity = severityFilter === 'all' || alert.severity.toLowerCase() === severityFilter;
      const matchesSearch =
        alert.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
        alert.description.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesSeverity && matchesSearch;
    });
  }, [alerts, searchTerm, severityFilter]);

  const severityMap: { [key: string]: string } = {
    Low: 'default',
    Medium: 'secondary',
    High: 'destructive',
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Alerts Dashboard</CardTitle>
          <CardDescription>View, filter, and generate real-time risk analysis.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            <Input
              placeholder="Search by location or description..."
              className="flex-1"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Select onValueChange={setSeverityFilter} defaultValue="all">
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Filter by severity" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Severities</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="low">Low</SelectItem>
              </SelectContent>
            </Select>
            <Button className="w-full sm:w-auto" onClick={handleGenerateRisks} disabled={isGenerating}>
              {isGenerating ? <Loader2 className="mr-2 animate-spin" /> : <Sparkles className="mr-2" />}
              Generate Risk Analysis
            </Button>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Alerts ({filteredAlerts.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Severity</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Timestamp</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAlerts.length > 0 ? (
                filteredAlerts.map((alert) => (
                  <TableRow key={alert.id}>
                    <TableCell>
                      <Badge variant={severityMap[alert.severity] as any}>{alert.severity}</Badge>
                    </TableCell>
                    <TableCell className="font-medium">{alert.location}</TableCell>
                    <TableCell>{alert.description}</TableCell>
                    <TableCell className="text-muted-foreground">{alert.timestamp}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} className="h-24 text-center">
                    No alerts found. Try generating a new risk analysis.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
