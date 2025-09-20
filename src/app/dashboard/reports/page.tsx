import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function ReportsPage() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Reports</CardTitle>
          <CardDescription>Generate and view historical reports.</CardDescription>
        </CardHeader>
        <CardContent>
          <p>Reporting functionality coming soon.</p>
        </CardContent>
      </Card>
    </div>
  );
}
