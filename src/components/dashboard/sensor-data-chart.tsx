'use client';

import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Tooltip } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltipContent } from '@/components/ui/chart';
import { mockSensorData } from '@/lib/data';

const chartConfig = {
  displacement: {
    label: 'Displacement (mm)',
    color: 'hsl(var(--chart-1))',
  },
  strain: {
    label: 'Strain (µε)',
    color: 'hsl(var(--chart-2))',
  },
  porePressure: {
    label: 'Pore Pressure (kPa)',
    color: 'hsl(var(--chart-3))',
  },
};

export function SensorDataChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Geotechnical Sensor Trends</CardTitle>
        <CardDescription>Last 30 Days Overview</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[300px] w-full">
          <BarChart data={mockSensorData} margin={{ top: 20, right: 20, bottom: 5, left: 0 }}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => value.slice(0, 3)}
            />
             <YAxis />
            <Tooltip
              cursor={false}
              content={<ChartTooltipContent indicator="dot" />}
            />
            <Bar dataKey="displacement" fill="var(--color-displacement)" radius={4} />
            <Bar dataKey="strain" fill="var(--color-strain)" radius={4} className="hidden" />
            <Bar dataKey="porePressure" fill="var(--color-porePressure)" radius={4} className="hidden" />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
