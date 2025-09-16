import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { mockDataSources } from '@/lib/data';
import { cn } from '@/lib/utils';
import { Bot, HardDrive, Rss, Cloud } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

const iconMap: { [key: string]: LucideIcon } = {
  DEM: HardDrive,
  Drone: Bot,
  Sensor: Rss,
  Environmental: Cloud,
};

const statusColorMap: { [key: string]: string } = {
  Online: 'bg-green-500',
  Offline: 'bg-slate-400',
  Error: 'bg-red-500',
};

export function DataSources() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Data Sources</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-4">
          {mockDataSources.map((source) => {
            const Icon = iconMap[source.type];
            return (
              <li key={source.name} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Icon className="h-5 w-5 text-muted-foreground" />
                  <span className="font-medium">{source.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span
                    className={cn(
                      'h-2.5 w-2.5 rounded-full',
                      statusColorMap[source.status]
                    )}
                  />
                  <span className="text-sm text-muted-foreground">{source.status}</span>
                </div>
              </li>
            );
          })}
        </ul>
      </CardContent>
    </Card>
  );
}
