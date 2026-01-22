import type { SensorType } from '@/types';

export const SENSOR_CONFIG: Record<
  SensorType,
  {
    id: string;
    name: string;
    unit: string;
    threshold: {
      min?: number;
      max?: number;
    };
    ranges: {
      min: number;
      max: number;
    };
  }
> = {
  temperature: {
    id: 'temperature',
    name: 'Temperature',
    unit: '°C',
    threshold: { min: 20, max: 30 },
    ranges: { min: 0, max: 50 },
  },
  ph: {
    id: 'ph',
    name: 'pH Level',
    unit: '',
    threshold: { min: 6.0, max: 9.0 },
    ranges: { min: 0, max: 14 },
  },
  dissolvedOxygen: {
    id: 'dissolvedOxygen',
    name: 'Dissolved Oxygen',
    unit: 'mg/L',
    threshold: { min: 4.5 },
    ranges: { min: 0, max: 20 },
  },
  turbidity: {
    id: 'turbidity',
    name: 'Turbidity',
    unit: 'NTU',
    threshold: { max: 75 },
    ranges: { min: 0, max: 200 },
  },
  conductivity: {
    id: 'conductivity',
    name: 'Conductivity',
    unit: 'µS/cm',
    threshold: { max: 2500 },
    ranges: { min: 0, max: 10000 },
  },
  flowRate: {
    id: 'flowRate',
    name: 'Flow Rate',
    unit: 'm³/h',
    threshold: { max: 120 },
    ranges: { min: 0, max: 200 },
  },
  tds: {
    id: 'tds',
    name: 'Total Dissolved Solids',
    unit: 'ppm',
    threshold: { max: 1200 },
    ranges: { min: 0, max: 5000 },
  },
};
