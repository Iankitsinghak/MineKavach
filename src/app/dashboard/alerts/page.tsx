import { RecentAlerts } from '@/components/dashboard/recent-alerts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ListFilter } from 'lucide-react';

export default function AlertsPage() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Alerts Dashboard</CardTitle>
          <CardDescription>View, filter, and manage all system alerts.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            <Input placeholder="Search by location or description..." className="flex-1" />
            <Select>
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
            <Button className="w-full sm:w-auto">
                <ListFilter className="mr-2" />
                Apply Filter
            </Button>
          </div>
        </CardContent>
      </Card>
      <RecentAlerts />
    </div>
  );
}
