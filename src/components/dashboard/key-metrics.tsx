import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ShieldAlert, Signal, AlertTriangle, CloudRain } from 'lucide-react';

const metrics = [
  {
    title: 'Overall Risk Level',
    value: 'High',
    icon: ShieldAlert,
    color: 'text-destructive',
    subtext: 'Immediate action required',
  },
  {
    title: 'Sensor Status',
    value: '3/4 Online',
    icon: Signal,
    color: 'text-amber-500',
    subtext: '1 sensor reporting errors',
  },
  {
    title: 'Active Alerts',
    value: '2',
    icon: AlertTriangle,
    color: 'text-accent',
    subtext: '1 high, 1 medium severity',
  },
  {
    title: 'Weather Advisory',
    value: 'Rain Expected',
    icon: CloudRain,
    color: 'text-primary',
    subtext: 'Monitor pore pressure',
  },
];

export function KeyMetrics() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {metrics.map((metric) => (
        <Card key={metric.title}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{metric.title}</CardTitle>
            <metric.icon className={`h-5 w-5 text-muted-foreground ${metric.color}`} />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${metric.color}`}>{metric.value}</div>
            <p className="text-xs text-muted-foreground">{metric.subtext}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
