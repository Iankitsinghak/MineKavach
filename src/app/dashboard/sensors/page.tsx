import { RealtimeSensorChart } from '@/components/dashboard/realtime-sensor-chart';
import { mockDataSources } from '@/lib/data';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function SensorsPage() {
  const sensors = mockDataSources.filter(s => s.type === 'Sensor' || s.type === 'Environmental');

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Live Sensor Data</CardTitle>
          <CardDescription>Real-time data streams from active geotechnical and environmental sensors.</CardDescription>
        </CardHeader>
      </Card>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {sensors.map((sensor) => (
          <RealtimeSensorChart key={sensor.name} sensor={sensor} />
        ))}
        <Card className="lg:col-span-2">
            <CardHeader>
                <CardTitle>Other Data Sources</CardTitle>
            </CardHeader>
            <CardContent>
                <ul className="space-y-4">
                {mockDataSources.filter(s => s.type !== 'Sensor' && s.type !== 'Environmental').map((source) => (
                    <li key={source.name} className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <span className="font-medium">{source.name}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="text-sm text-muted-foreground">{source.status}</span>
                        </div>
                    </li>
                ))}
                </ul>
            </CardContent>
        </Card>
      </div>
    </div>
  );
}
