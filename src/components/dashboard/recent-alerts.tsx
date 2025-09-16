import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { mockAlerts } from '@/lib/data';
import { cn } from '@/lib/utils';

export function RecentAlerts() {
  const severityMap: { [key: string]: string } = {
    Low: 'default',
    Medium: 'secondary',
    High: 'destructive',
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Alerts</CardTitle>
        <CardDescription>Critical events recorded from monitoring systems.</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Severity</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Description</TableHead>
              <TableHead className="text-right">Timestamp</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {mockAlerts.map((alert) => (
              <TableRow key={alert.id}>
                <TableCell>
                  <Badge variant={severityMap[alert.severity] as any}>{alert.severity}</Badge>
                </TableCell>
                <TableCell className="font-medium">{alert.location}</TableCell>
                <TableCell>{alert.description}</TableCell>
                <TableCell className="text-right text-muted-foreground">{alert.timestamp}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
