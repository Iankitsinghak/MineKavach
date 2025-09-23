import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { mockAlerts } from '@/lib/data';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';

export function RecentAlerts() {
  const severityMap: { [key: string]: string } = {
    Low: 'default',
    Medium: 'secondary',
    High: 'destructive',
  };

  return (
    <Card className="flex flex-col">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Recent Alerts</CardTitle>
            <CardDescription>Critical events from monitoring systems.</CardDescription>
          </div>
          <Button variant="outline" size="sm" asChild>
            <Link href="/dashboard/alerts">
              View All
              <ArrowRight className="ml-2" />
            </Link>
          </Button>
        </div>
      </CardHeader>
      <CardContent className="flex-grow">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Severity</TableHead>
              <TableHead>Location</TableHead>
              <TableHead className="hidden md:table-cell">Description</TableHead>
              <TableHead className="text-right hidden sm:table-cell">Time</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {mockAlerts.slice(0, 4).map((alert) => (
              <TableRow key={alert.id}>
                <TableCell>
                  <Badge variant={severityMap[alert.severity] as any}>{alert.severity}</Badge>
                </TableCell>
                <TableCell className="font-medium">{alert.location}</TableCell>
                <TableCell className="hidden md:table-cell truncate max-w-[150px]">{alert.description}</TableCell>
                <TableCell className="text-right text-muted-foreground hidden sm:table-cell">{alert.timestamp}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
