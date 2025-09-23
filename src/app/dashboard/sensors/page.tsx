'use client';
import { useState, useEffect } from 'react';
import { RealtimeSensorChart } from '@/components/dashboard/realtime-sensor-chart';
import { mockDataSources } from '@/lib/data';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { DataSource } from '@/lib/types';

const sensorNameMapping: { [key: string]: string[] } = {
    vibration: [],
    tilt: [],
    strain: ['Strain Gauge A'],
    pore_pressure: ['Pore Pressure Sensor 3B'],
    temperature: ['Temperature Sensor'],
    humidity: [],
    alert_siren: [],
    rainfall: ['Rainfall Gauge'], 
    displacement: ['Displacement Sensor 1']
};


export default function SensorsPage() {
  const [visibleSensors, setVisibleSensors] = useState<DataSource[]>([]);
  const [otherSources, setOtherSources] = useState<DataSource[]>([]);

  useEffect(() => {
    const onboardingDataString = localStorage.getItem('onboardingData');
    if (onboardingDataString) {
      try {
        const onboardingData = JSON.parse(onboardingDataString);
        const selectedSensors = onboardingData?.dataSources || {};
        
        const selectedSensorNames: string[] = Object.entries(selectedSensors)
          .filter(([, value]) => value === true)
          .flatMap(([key]) => sensorNameMapping[key as keyof typeof sensorNameMapping] || []);

        // Also include sensors that might not be in the mapping but are of type 'Sensor' or 'Environmental'
        const defaultSensors = mockDataSources
          .filter(s => (s.type === 'Sensor' || s.type === 'Environmental'))
          .map(s => s.name);
        
        const allRelevantSensorNames = Array.from(new Set([...selectedSensorNames, ...defaultSensors.filter(name => {
           if (name.includes('Displacement')) return selectedSensors.displacement;
           if (name.includes('Strain')) return selectedSensors.strain;
           if (name.includes('Pore Pressure')) return selectedSensors.pore_pressure;
           if (name.includes('Rainfall')) return true; // Always show rainfall
           if (name.includes('Temperature')) return selectedSensors.temperature;
           return false;
        })]));


        const filteredSensors = mockDataSources.filter(s =>
          (s.type === 'Sensor' || s.type === 'Environmental') && allRelevantSensorNames.includes(s.name)
        );

        setVisibleSensors(filteredSensors);
      } catch (error) {
        console.error("Failed to parse onboarding data from localStorage", error);
        // Fallback to showing all sensors if data is corrupt
        const allSensors = mockDataSources.filter(s => s.type === 'Sensor' || s.type === 'Environmental');
        setVisibleSensors(allSensors);
      }
    } else {
      // Fallback to showing all sensors if no onboarding data is found
      const allSensors = mockDataSources.filter(s => s.type === 'Sensor' || s.type === 'Environmental');
      setVisibleSensors(allSensors);
    }
    
    // Set other sources
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
