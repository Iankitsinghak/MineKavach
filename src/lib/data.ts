import { SensorData, Alert, DataSource } from '@/lib/types';
import { subDays, format } from 'date-fns';

// Mock Sensor Data for the last 30 days
export const mockSensorData: SensorData[] = Array.from({ length: 30 }).map((_, i) => {
  const date = subDays(new Date(), i);
  return {
    date: format(date, 'MMM d'),
    displacement: parseFloat((Math.random() * 5 + 2).toFixed(2)), // in mm
    strain: parseFloat((Math.random() * 200 + 50).toFixed(2)), // in microstrains
    porePressure: parseFloat((Math.random() * 10 + 5).toFixed(2)), // in kPa
  };
}).reverse();

// Mock Recent Alerts
export const mockAlerts: Alert[] = [
  {
    id: 'ALERT-001',
    timestamp: '2024-07-21 14:30',
    location: 'Bench 3, West Wall',
    severity: 'High',
    description: 'Significant displacement detected. Potential for large-scale failure.',
  },
  {
    id: 'ALERT-002',
    timestamp: '2024-07-21 09:15',
    location: 'Haul Road Sector 5',
    severity: 'Medium',
    description: 'Increased strain rates after rainfall event.',
  },
  {
    id: 'ALERT-003',
    timestamp: '2024-07-20 18:45',
    location: 'Bench 2, North Wall',
    severity: 'Low',
    description: 'Minor vibrations detected, within operational limits.',
  },
  {
    id: 'ALERT-004',
    timestamp: '2024-07-20 11:00',
    location: 'Bench 3, West Wall',
    severity: 'Medium',
    description: 'Pore pressure approaching threshold levels.',
  },
];

// Mock Data Sources
export const mockDataSources: DataSource[] = [
  {
    name: 'DEM Scanner',
    type: 'DEM',
    status: 'Online',
  },
  {
    name: 'Drone Unit Alpha',
    type: 'Drone',
    status: 'Online',
  },
  {
    name: 'Geotechnical Sensors',
    type: 'Sensor',
    status: 'Error',
  },
  {
    name: 'Environmental Monitor',
    type: 'Environmental',
    status: 'Offline',
  },
];
