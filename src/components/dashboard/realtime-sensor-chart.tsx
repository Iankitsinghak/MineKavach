'use client';

import { useState, useEffect } from 'react';
import { Line, LineChart, CartesianGrid, XAxis, YAxis, Tooltip } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltipContent } from '@/components/ui/chart';
import { DataSource } from '@/lib/types';
import { cn } from '@/lib/utils';
import { Rss, Cloud } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

const iconMap: { [key: string]: LucideIcon } = {
  Sensor: Rss,
  Environmental: Cloud,
};

const statusColorMap: { [key: string]: string } = {
  Online: 'bg-green-500',
  Offline: 'bg-slate-400',
  Error: 'bg-red-500',
};


type RealtimeDataPoint = {
  time: string;
  value: number;
};

const chartConfig = {
  value: {
    label: 'Value',
    color: 'hsl(var(--chart-1))',
  },
};

export function RealtimeSensorChart({ sensor }: { sensor: DataSource }) {
  const [data, setData] = useState<RealtimeDataPoint[]>([]);
  const Icon = iconMap[sensor.type] || Rss;

  useEffect(() => {
    const initialData: RealtimeDataPoint[] = Array.from({ length: 10 }).map((_, i) => {
      const time = new Date(Date.now() - (9 - i) * 2000);
      return {
        time: time.toLocaleTimeString(),
        value: Math.random() * (sensor.type === 'Sensor' ? 200 : 30),
      };
    });
    setData(initialData);

    if(sensor.status === 'Online') {
      const interval = setInterval(() => {
        setData((currentData) => {
          const newData = [
            ...currentData.slice(1),
            {
              time: new Date().toLocaleTimeString(),
              value: Math.random() * (sensor.type === 'Sensor' ? 200 : 30),
            },
          ];
          return newData;
        });
      }, 2000);
      return () => clearInterval(interval);
    }
  }, [sensor.type, sensor.status]);

  const getUnit = () => {
    if (sensor.name.includes('Displacement')) return 'mm';
    if (sensor.name.includes('Strain')) return 'µε';
    if (sensor.name.includes('Pore Pressure')) return 'kPa';
    if (sensor.name.includes('Temperature')) return '°C';
    if (sensor.name.includes('Rainfall')) return 'mm/hr';
    return '';
  }

  const unit = getUnit();
  const chartConfigWithValue = {
    value: {
      label: unit,
      color: 'hsl(var(--chart-1))'
    }
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Icon className="h-5 w-5 text-muted-foreground" />
            <CardTitle className="text-lg">{sensor.name}</CardTitle>
          </div>
          <div className="flex items-center gap-2">
            <span
              className={cn(
                'h-2.5 w-2.5 rounded-full',
                statusColorMap[sensor.status]
              )}
            />
            <span className="text-sm text-muted-foreground">{sensor.status}</span>
          </div>
        </div>
        <CardDescription>
          {sensor.status === 'Online' ? 'Live data feed' : `Last seen: ${new Date().toLocaleDateString()}`}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfigWithValue} className="h-[200px] w-full">
          <LineChart data={data} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
            <CartesianGrid vertical={false} />
            <XAxis dataKey="time" tickLine={false} axisLine={false} tickMargin={10} />
            <YAxis domain={['dataMin - 10', 'dataMax + 10']} hide />
            <Tooltip
              cursor={true}
              content={<ChartTooltipContent indicator="line" />}
              labelFormatter={() => ''}
               formatter={(value) => [`${(value as number).toFixed(2)} ${unit}`, 'Value']}
            />
            <Line
              dataKey="value"
              type="monotone"
              stroke="var(--color-value)"
              strokeWidth={2}
              dot={false}
              isAnimationActive={sensor.status === 'Online' ? false : true}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
