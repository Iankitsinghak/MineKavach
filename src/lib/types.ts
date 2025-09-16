export type SensorData = {
  date: string;
  displacement: number;
  strain: number;
  porePressure: number;
};

export type Alert = {
  id: string;
  timestamp: string;
  location: string;
  severity: 'Low' | 'Medium' | 'High';
  description: string;
};

export type DataSource = {
  name: string;
  type: 'DEM' | 'Drone' | 'Sensor' | 'Environmental';
  status: 'Online' | 'Offline' | 'Error';
};
