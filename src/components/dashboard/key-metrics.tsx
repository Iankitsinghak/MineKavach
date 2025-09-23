
'use client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ShieldAlert, Signal, AlertTriangle, CloudRain } from 'lucide-react';
import { useState, useEffect } from 'react';
import { getWeather, WeatherOutput } from '@/ai/tools/weather-tool';

const staticMetrics = [
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
];

type WeatherState = {
    value: string;
    subtext: string;
}

export function KeyMetrics() {
  const [weather, setWeather] = useState<WeatherState | null>(null);

  useEffect(() => {
    const fetchWeather = async (lat: number, lon: number) => {
      try {
        const weatherReport: WeatherOutput = await getWeather({ latitude: lat, longitude: lon });
        setWeather({
          value: `${weatherReport.temperature.toFixed(1)}°C, ${weatherReport.condition}`,
          subtext: `Wind: ${weatherReport.windSpeed.toFixed(0)} km/h, Humidity: ${weatherReport.humidity.toFixed(0)}%`,
        });
      } catch (error) {
        console.error('Failed to fetch weather:', error);
        setWeather({
          value: 'Not Available',
          subtext: 'Could not retrieve weather.',
        });
      }
    };

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          fetchWeather(position.coords.latitude, position.coords.longitude);
        },
        (error) => {
          console.error("Geolocation error:", error);
          // Default location if geolocation fails (e.g. a known mine location)
          fetchWeather(27.9881, 86.9250); 
        }
      );
    } else {
       // Default location if geolocation is not supported
       fetchWeather(27.9881, 86.9250);
    }
  }, []);

  const metrics = [...staticMetrics];
  
  if (weather) {
      metrics.push({
        title: 'Weather Advisory',
        value: weather.value,
        icon: CloudRain,
        color: 'text-primary',
        subtext: weather.subtext,
      });
  }


  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {metrics.map((metric, index) => (
        <Card key={metric.title}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{metric.title}</CardTitle>
            {metric.icon && <metric.icon className={`h-5 w-5 text-muted-foreground ${metric.color}`} />}
          </CardHeader>
          <CardContent>
             {index === metrics.length -1 && !weather ? (
                <>
                    <div className="text-2xl font-bold">Loading...</div>
                    <p className="text-xs text-muted-foreground">Fetching weather data...</p>
                </>
            ) : (
                <>
                    <div className={`text-2xl font-bold ${metric.color}`}>{metric.value}</div>
                    <p className="text-xs text-muted-foreground">{metric.subtext}</p>
                </>
            )}
          </CardContent>
        </Card>
      ))}
       {!weather && (
         <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Weather Advisory</CardTitle>
                <CloudRain className="h-5 w-5 text-muted-foreground text-primary" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">Loading...</div>
                <p className="text-xs text-muted-foreground">Fetching weather data...</p>
            </CardContent>
         </Card>
      )}
    </div>
  );
}
