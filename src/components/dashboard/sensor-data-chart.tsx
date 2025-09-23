
'use client';

import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Tooltip, Line, LineChart, Legend } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltipContent, ChartLegend, ChartLegendContent} from '@/components/ui/chart';
import { mockSensorData } from '@/lib/data';
import { Button } from '@/components/ui/button';
import React from 'react';

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
  const [activeChart, setActiveChart] = React.useState<keyof typeof chartConfig>('displacement');

  return (
    <Card>
      <CardHeader>
        <CardTitle>Geotechnical Sensor Trends</CardTitle>
        <CardDescription>Last 30 Days Overview</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[300px] w-full">
          <LineChart
            data={mockSensorData}
            margin={{
              top: 24,
              right: 24,
              bottom: 24,
              left: 24,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => {
                const date = new Date(value + ' 2024'); // Add a year for proper parsing
                if (isNaN(date.getTime())) return value;
                return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
              }}
            />
             <YAxis
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickCount={3}
              domain={['dataMin - 10', 'dataMax + 10']}
            />
            <Tooltip
              cursor={true}
              content={<ChartTooltipContent indicator="line" />}
            />
            <Legend content={<ChartLegendContent />} />
            {Object.keys(chartConfig).map((key) => (
               <Line
                key={key}
                dataKey={key}
                type="monotone"
                stroke={`var(--color-${key})`}
                strokeWidth={2}
                dot={false}
              />
            ))}
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
