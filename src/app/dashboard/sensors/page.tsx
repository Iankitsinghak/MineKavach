
'use client';
import { useState, useEffect } from 'react';
import { RealtimeSensorChart } from '@/components/dashboard/realtime-sensor-chart';
import { mockDataSources } from '@/lib/data';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { DataSource } from '@/lib/types';

const sensorTypeToNameMapping: { [key: string]: string[] } = {
    vibration: [], // No specific sensor name in mockDataSources for this
    tilt: [], // No specific sensor name in mockDataSources for this
    strain: ['Strain Gauge A'],
    pore_pressure: ['Pore Pressure Sensor 3B'],
    temperature: ['Temperature Sensor'],
    humidity: [], // No specific sensor name in mockDataSources for this
    alert_siren: [], // Not a sensor, so no mapping
    displacement: ['Displacement Sensor 1'],
    rainfall: ['Rainfall Gauge'],
};


export default function SensorsPage() {
  const [visibleSensors, setVisibleSensors] = useState<DataSource[]>([]);
  const [otherSources, setOtherSources] = useState<DataSource[]>([]);

  useEffect(() => {
    const onboardingDataString = localStorage.getItem('onboardingData');
    let sourcesToShow: DataSource[] = [];
    
    const allKnownSensors = mockDataSources.filter(s => s.type === 'Sensor' || s.type === 'Environmental');

    if (onboardingDataString) {
      try {
        const onboardingData = JSON.parse(onboardingDataString);
        const selectedSensorTypes = onboardingData?.dataSources || {};
        
        const selectedSensorNames: string[] = Object.entries(selectedSensorTypes)
          .filter(([, value]) => value === true)
          .flatMap(([key]) => sensorTypeToNameMapping[key as keyof typeof sensorTypeToNameMapping] || []);

        // Always include Rainfall Gauge if it exists, as it's a default environmental sensor.
        if (mockDataSources.find(s => s.name === 'Rainfall Gauge')) {
            selectedSensorNames.push('Rainfall Gauge');
        }

        const uniqueSensorNames = Array.from(new Set(selectedSensorNames));

        sourcesToShow = allKnownSensors.filter(s =>
            uniqueSensorNames.includes(s.name)
        );

      } catch (error) {
        console.error("Failed to parse onboarding data from localStorage, showing all sensors.", error);
        sourcesToShow = allKnownSensors;
      }
    } else {
        console.warn("No onboarding data found in localStorage, showing all sensors.");
      sourcesToShow = allKnownSensors;
    }
    
    setVisibleSensors(sourcesToShow);

    // Set other sources (non-sensor types)
    const otherDataSources = mockDataSources.filter(s => s.type !== 'Sensor' && s.type !== 'Environmental');
    setOtherSources(otherDataSources);

  }, []);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Live Sensor Data</CardTitle>
          <CardDescription>Real-time data streams from active geotechnical and environmental sensors.</CardDescription>
        </CardHeader>
      </Card>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {visibleSensors.map((sensor) => (
          <RealtimeSensorChart key={sensor.name} sensor={sensor} />
        ))}
         {otherSources.length > 0 && (
            <Card className="lg:col-span-2">
                <CardHeader>
                    <CardTitle>Other Data Sources</CardTitle>
                </CardHeader>
                <CardContent>
                    <ul className="space-y-4">
                    {otherSources.map((source) => (
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
        )}
      </div>
    </div>
  );
}

